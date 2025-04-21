/**
 * Resilient Fetch - Client Compatible Version
 * 
 * Promise-based utilities for fault-tolerant API requests with automatic retry, 
 * timeout, and graceful degradation. Uses Promise chains instead of async/await.
 */

import { performanceMonitor } from './performanceMetrics';

interface RetryOptions {
  retries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  timeout?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  status: number;
  success: boolean;
  retryCount: number;
}

/**
 * Generate an exponential backoff delay
 */
function calculateBackoff(attempt: number, options: Required<RetryOptions>): number {
  const delay = Math.min(
    options.maxDelay,
    options.initialDelay * Math.pow(options.factor, attempt)
  );
  
  // Add jitter to prevent thundering herd problem
  return delay * (0.5 + Math.random() * 0.5);
}

/**
 * Promise-based delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Enhanced fetch with automatic retry and exponential backoff
 * Client-compatible Promise-based implementation
 */
export function resilientFetch<T = any>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<FetchResult<T>> {
  // Start performance monitoring
  const fetchId = performanceMonitor.start('resilient_fetch', {
    url,
    method: options.method || 'GET'
  });
  
  // Default retry options
  const defaultOptions: Required<RetryOptions> = {
    retries: 3,
    initialDelay: 300,
    maxDelay: 5000,
    factor: 2,
    timeout: 10000,
    onRetry: () => {}
  };
  
  const config = { ...defaultOptions, ...retryOptions };
  
  // Create a function that attempts the fetch
  function attemptFetch(attempt: number, retryCount: number): Promise<FetchResult<T>> {
    // Add timeout to the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    // Merge abort signal with existing options
    const fetchOptions = {
      ...options,
      signal: controller.signal
    };
    
    // Attempt the fetch
    return fetch(url, fetchOptions)
      .then(response => {
        clearTimeout(timeoutId);
        
        // Handle response based on status
        if (response.ok) {
          // Success case
          return response.json()
            .then(data => {
              performanceMonitor.end(fetchId);
              
              return {
                data,
                error: null,
                status: response.status,
                success: true,
                retryCount
              };
            });
        }
        
        // Specific status code handling
        if (response.status === 429) {
          // Rate limiting - always retry with backoff
          const retryAfter = response.headers.get('Retry-After');
          const backoffTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : calculateBackoff(attempt, config);
          
          const error = new Error(`Rate limited: ${response.status}`);
          
          if (attempt >= config.retries) {
            performanceMonitor.end(fetchId);
            return {
              data: null,
              error,
              status: response.status,
              success: false,
              retryCount
            };
          }
          
          // Retry with delay
          config.onRetry(error, attempt + 1);
          return delay(backoffTime)
            .then(() => attemptFetch(attempt + 1, retryCount + 1));
        }
        
        if (response.status >= 500) {
          // Server errors - retry with backoff
          const error = new Error(`Server error: ${response.status}`);
          
          if (attempt >= config.retries) {
            performanceMonitor.end(fetchId);
            return {
              data: null,
              error,
              status: response.status,
              success: false,
              retryCount
            };
          }
          
          // Retry with delay
          config.onRetry(error, attempt + 1);
          return delay(calculateBackoff(attempt, config))
            .then(() => attemptFetch(attempt + 1, retryCount + 1));
        }
        
        // Client errors - don't retry
        return response.json()
          .catch(() => ({ message: 'Unknown error' }))
          .then(errorData => {
            const error = new Error(`Request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
            
            performanceMonitor.end(fetchId);
            return {
              data: null,
              error,
              status: response.status,
              success: false,
              retryCount
            };
          });
      })
      .catch(error => {
        clearTimeout(timeoutId);
        const isTimeout = error instanceof Error && error.name === 'AbortError';
        const fetchError = error instanceof Error 
          ? error 
          : new Error('Unknown error occurred');
        
        // Don't retry after all attempts are exhausted
        if (attempt >= config.retries) {
          performanceMonitor.end(fetchId);
          return {
            data: null,
            error: fetchError,
            status: 0,
            success: false,
            retryCount
          };
        }
        
        // Wait before retrying
        config.onRetry(fetchError, attempt + 1);
        return delay(calculateBackoff(attempt, config))
          .then(() => attemptFetch(attempt + 1, retryCount + 1));
      });
  }
  
  // Start the first attempt
  return attemptFetch(0, 0);
}

// Type for stream chunk responses
export interface StreamChunk<T> {
  value: T;
  done: boolean;
}

/**
 * Stream handler for client components
 * Uses the Observer pattern for stream processing
 */
export function streamFetch<T = any>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): AsyncIterableIterator<any> {
  const fetchId = performanceMonitor.start('stream_fetch', {
    url,
    method: options.method || 'GET'
  });
  
  // Default retry options
  const defaultOptions: Required<RetryOptions> = {
    retries: 1, // Limited retries for streaming
    initialDelay: 300,
    maxDelay: 3000,
    factor: 2,
    timeout: 30000, // Longer timeout for streaming
    onRetry: () => {}
  };
  
  const config = { ...defaultOptions, ...retryOptions };
  let attempt = 0;
  let paused = false;
  let finished = false;
  let requestController: AbortController | null = null;
  let resolveNext: ((value: IteratorResult<any>) => void) | null = null;
  
  // Function to process fetch response
  function processFetchResponse(response: Response) {
    if (!response.ok) {
      throw new Error(`Stream request failed with status ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error('ReadableStream not supported');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    // Process chunks
    function processChunk(): Promise<any> {
      if (finished) {
        return Promise.resolve({ done: true });
      }
      
      return reader.read().then(result => {
        if (result.done) {
          // Stream completed
          performanceMonitor.end(fetchId);
          finished = true;
          
          // Process any remaining buffer content
          if (buffer.trim()) {
            try {
              // Try parsing the buffer
              return { done: false, value: { done: true, timestamp: new Date().toISOString() } };
            } catch (e) {
              // If parsing fails, return done
              return { done: true };
            }
          }
          
          return { done: true };
        }
        
        // Decode the chunk data
        const chunk = decoder.decode(result.value, { stream: true });
        buffer += chunk;
        
        // Parse SSE format: 'data: {...}\n\n'
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        const parsedChunks = lines
          .map(line => line.replace(/^data: /, '').trim())
          .filter(line => line !== '')
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (e) {
              return null;
            }
          })
          .filter(item => item !== null);
        
        if (parsedChunks.length > 0) {
          return { done: false, value: parsedChunks[0] };
        }
        
        // No complete chunks yet, continue reading
        return processChunk();
      });
    }
    
    // Set up the iterator
    const iterator: AsyncIterableIterator<any> = {
      [Symbol.asyncIterator]() {
        return this;
      },
      next() {
        if (finished) {
          return Promise.resolve({ done: true, value: undefined });
        }
        
        if (paused) {
          return new Promise(resolve => {
            resolveNext = resolve as (value: IteratorResult<any>) => void;
          });
        }
        
        return processChunk();
      },
      return() {
        // Cleanup on iterator termination
        if (requestController) {
          requestController.abort();
        }
        finished = true;
        performanceMonitor.end(fetchId);
        return Promise.resolve({ done: true, value: undefined });
      },
      throw(error) {
        // Handle errors
        if (requestController) {
          requestController.abort();
        }
        finished = true;
        performanceMonitor.end(fetchId);
        return Promise.reject(error);
      }
    };
    
    return iterator;
  }
  
  // Function to attempt streaming fetch
  function attemptStreamFetch(): Promise<AsyncIterableIterator<any>> {
    // Create AbortController for timeout
    requestController = new AbortController();
    const timeoutId = setTimeout(() => {
      if (requestController) {
        requestController.abort();
      }
    }, config.timeout);
    
    // Merge abort signal with existing options
    const fetchOptions = {
      ...options,
      signal: requestController.signal
    };
    
    return fetch(url, fetchOptions)
      .then(response => {
        clearTimeout(timeoutId);
        return processFetchResponse(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        
        if (attempt >= config.retries) {
          // All retries exhausted
          performanceMonitor.end(fetchId);
          const errorIterator: AsyncIterableIterator<any> = {
            [Symbol.asyncIterator]() {
              return this;
            },
            next() {
              return Promise.resolve({ 
                done: false, 
                value: { 
                  error: error instanceof Error ? error.message : 'Unknown error',
                  done: true 
                } 
              });
            },
            return() {
              return Promise.resolve({ done: true, value: undefined });
            },
            throw(e) {
              return Promise.reject(e);
            }
          };
          return errorIterator;
        }
        
        // Retry after delay
        attempt++;
        const backoffTime = calculateBackoff(attempt, config);
        return delay(backoffTime).then(attemptStreamFetch);
      });
  }
  
  // Start the first attempt
  let iterator: AsyncIterableIterator<any>;
  
  const promise = attemptStreamFetch()
    .then(result => {
      iterator = result;
      return iterator;
    });
  
  // Return a proxy iterator that will use the real iterator once it's available
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      return promise.then(iterator => iterator.next());
    },
    return() {
      return promise.then(iterator => iterator.return ? iterator.return() : { done: true, value: undefined });
    },
    throw(error) {
      return promise.then(iterator => iterator.throw ? iterator.throw(error) : Promise.reject(error));
    }
  };
}
