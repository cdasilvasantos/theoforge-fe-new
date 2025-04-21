/**
 * Event Stream Client
 * 
 * A simple callback-based implementation for handling streaming responses
 * that is fully compatible with Next.js client components.
 */

import { performanceMonitor } from './performanceMetrics';

// Stream event handlers
export interface StreamHandlers<T> {
  onChunk: (chunk: T) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

// Stream options (subset of RequestInit)
export interface StreamOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  signal?: AbortSignal;
  timeout?: number;
  retries?: number;
}

/**
 * Fetch a stream and process it with callbacks
 * Uses a pure callback approach instead of promises/async to be client-compatible
 */
export function fetchEventStream<T = any>(
  url: string, 
  handlers: StreamHandlers<T>,
  options: StreamOptions = {}
): { 
  abort: () => void 
} {
  const fetchId = performanceMonitor.start('event_stream');
  
  // Default options
  const {
    method = 'GET',
    headers = {},
    body,
    signal,
    timeout = 30000,
    retries = 1
  } = options;
  
  // Create internal controller for timeouts
  const controller = new AbortController();
  let timeoutId: number | null = null;
  
  // Connect external signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }
  
  // Set timeout
  if (timeout > 0) {
    timeoutId = window.setTimeout(() => {
      controller.abort();
      handlers.onError(new Error('Request timeout'));
    }, timeout);
  }
  
  // State tracking
  let currentAttempt = 0;
  let completed = false;
  
  // Function to clean up resources
  function cleanup() {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    completed = true;
    performanceMonitor.end(fetchId);
  }
  
  // Process the stream via ReadableStream API
  function processStream(response: Response) {
    if (!response.ok) {
      const error = new Error(`HTTP error ${response.status}: ${response.statusText}`);
      handlers.onError(error);
      cleanup();
      return;
    }
    
    if (!response.body) {
      handlers.onError(new Error('ReadableStream not supported in this browser'));
      cleanup();
      return;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    // Read chunks recursively with .read() and callbacks
    function readNextChunk() {
      if (completed) return;
      
      reader.read().then(
        ({ done, value }) => {
          if (completed) return;
          
          if (done) {
            // Process any remaining data in buffer
            if (buffer.trim()) {
              try {
                const finalData = JSON.parse(buffer);
                handlers.onChunk(finalData);
              } catch (e) {
                // Ignore parsing errors on final chunk
              }
            }
            
            // Signal completion
            handlers.onComplete();
            cleanup();
            return;
          }
          
          try {
            // Decode binary chunk to text
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // Handle server-sent events format (data: {...}\n\n)
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';
            
            // Process complete messages
            for (const line of lines) {
              try {
                // Strip 'data: ' prefix if present (SSE format)
                const content = line.replace(/^data: /, '').trim();
                if (!content) continue;
                
                const data = JSON.parse(content);
                if (data) handlers.onChunk(data);
              } catch (err) {
                console.warn('Error parsing chunk:', err);
              }
            }
            
            // Continue reading
            readNextChunk();
          } catch (error) {
            handlers.onError(error instanceof Error ? error : new Error(String(error)));
            cleanup();
          }
        },
        error => {
          // Handle reader errors
          if (controller.signal.aborted) {
            // Intentional abort - no error
            cleanup();
            return;
          }
          
          // Real error - retry or report
          if (currentAttempt < retries) {
            currentAttempt++;
            const backoff = Math.min(1000 * Math.pow(2, currentAttempt), 10000);
            window.setTimeout(() => startFetch(), backoff);
          } else {
            handlers.onError(error instanceof Error ? error : new Error(String(error)));
            cleanup();
          }
        }
      ).catch(error => {
        // Catch any errors in the promise chain
        handlers.onError(error instanceof Error ? error : new Error(String(error)));
        cleanup();
      });
    }
    
    // Start reading chunks
    readNextChunk();
  }
  
  // Start the fetch request
  function startFetch() {
    if (completed) return;
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...headers,
        'Accept': 'text/event-stream'
      },
      body,
      signal: controller.signal
    };
    
    // Use .then() callbacks instead of await
    fetch(url, fetchOptions).then(
      response => {
        processStream(response);
      },
      error => {
        // Handle network errors
        if (controller.signal.aborted) {
          // Intentional abort - no error
          cleanup();
          return;
        }
        
        // Network failure - retry or report
        if (currentAttempt < retries) {
          currentAttempt++;
          const backoff = Math.min(1000 * Math.pow(2, currentAttempt), 10000);
          window.setTimeout(() => startFetch(), backoff);
        } else {
          handlers.onError(error instanceof Error ? error : new Error(String(error)));
          cleanup();
        }
      }
    ).catch(error => {
      // Catch any errors in the promise chain
      handlers.onError(error instanceof Error ? error : new Error(String(error)));
      cleanup();
    });
  }
  
  // Start the fetch
  startFetch();
  
  // Return control object
  return {
    abort: () => {
      if (!completed) {
        controller.abort();
        cleanup();
      }
    }
  };
}
