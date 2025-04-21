/**
 * Resilient Fetch
 * 
 * Fault-tolerant API request utilities with automatic retry, 
 * timeout, and graceful degradation.
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
 * Enhanced fetch with automatic retry and exponential backoff
 */
export async function resilientFetch<T = any>(
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
  let attempt = 0;
  let retryCount = 0;
  let lastError: Error | null = null;
  
  while (attempt <= config.retries) {
    try {
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      // Merge abort signal with existing options
      const fetchOptions = {
        ...options,
        signal: controller.signal
      };
      
      // Attempt the fetch
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // Handle response based on status
      if (response.ok) {
        // Success case
        const data = await response.json() as T;
        performanceMonitor.end(fetchId);
        
        return {
          data,
          error: null,
          status: response.status,
          success: true,
          retryCount
        };
      }
      
      // Specific status code handling
      if (response.status === 429) {
        // Rate limiting - always retry with backoff
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : calculateBackoff(attempt, config);
        
        lastError = new Error(`Rate limited: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        retryCount++;
        config.onRetry(lastError, attempt);
        continue;
      }
      
      if (response.status >= 500) {
        // Server errors - retry with backoff
        lastError = new Error(`Server error: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, calculateBackoff(attempt, config)));
        attempt++;
        retryCount++;
        config.onRetry(lastError, attempt);
        continue;
      }
      
      // Client errors - don't retry
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      lastError = new Error(`Request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
      
      performanceMonitor.end(fetchId);
      return {
        data: null,
        error: lastError,
        status: response.status,
        success: false,
        retryCount
      };
      
    } catch (error) {
      // Network errors or timeouts
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      lastError = error instanceof Error 
        ? error 
        : new Error('Unknown error occurred');
      
      // Don't retry after all attempts are exhausted
      if (attempt >= config.retries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, calculateBackoff(attempt, config)));
      attempt++;
      retryCount++;
      config.onRetry(lastError, attempt);
    }
  }
  
  // All retry attempts failed
  performanceMonitor.end(fetchId);
  return {
    data: null,
    error: lastError,
    status: 0,
    success: false,
    retryCount
  };
}

/**
 * Stream data from the server with fetch
 */
export async function* streamFetch<T = any>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): AsyncGenerator<T, void, unknown> {
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
  
  while (attempt <= config.retries) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      // Merge abort signal with existing options
      const fetchOptions = {
        ...options,
        signal: controller.signal
      };
      
      // Make the request
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }
      
      // Get the reader from the response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            performanceMonitor.end(fetchId);
            return;
          }
          
          // Convert the chunk to text
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // Process any complete events in the buffer
          let lineEnd = buffer.indexOf('\n\n');
          while (lineEnd > -1) {
            const line = buffer.substring(0, lineEnd).trim();
            buffer = buffer.substring(lineEnd + 2);
            
            if (line.startsWith('data: ')) {
              const eventData = line.substring(6);
              try {
                const parsedData = JSON.parse(eventData) as T;
                yield parsedData;
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
            
            lineEnd = buffer.indexOf('\n\n');
          }
        }
      } catch (error) {
        // Stream error - attempt retry
        const streamError = error instanceof Error 
          ? error 
          : new Error('Unknown streaming error');
        
        if (attempt >= config.retries) {
          console.error('Streaming failed after retries:', streamError);
          performanceMonitor.end(fetchId);
          return;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, calculateBackoff(attempt, config)));
        attempt++;
        config.onRetry(streamError, attempt);
      }
    } catch (error) {
      // Request setup error
      const requestError = error instanceof Error 
        ? error 
        : new Error('Unknown request error');
      
      if (attempt >= config.retries) {
        console.error('Stream request failed after retries:', requestError);
        performanceMonitor.end(fetchId);
        return;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, calculateBackoff(attempt, config)));
      attempt++;
      config.onRetry(requestError, attempt);
    }
  }
  
  performanceMonitor.end(fetchId);
}
