/**
 * Managed Request System for controlled API interactions
 * 
 * This utility provides a structured system for managing API requests with
 * priority levels, automatic cancellation, and timeout management.
 */

export type RequestPriority = 'low' | 'normal' | 'high' | 'critical';

interface PendingRequest {
  controller: AbortController;
  priority: RequestPriority;
  timestamp: number;
}

/**
 * Creates a request manager for controlled API interactions
 */
export const createManagedRequest = () => {
  const pendingRequests = new Map<string, PendingRequest>();
  
  return {
    /**
     * Fetch with built-in management features
     */
    fetch: <T>(
      url: string, 
      options: RequestInit = {}, 
      priority: RequestPriority = 'normal'
    ): [Promise<T>, string] => {
      // Create unique request ID
      const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      
      // Set up abort controller
      const controller = new AbortController();
      const { signal } = controller;
      
      // Create fetch promise
      const fetchPromise = fetch(url, { ...options, signal })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json() as Promise<T>;
        })
        .then(data => {
          logApiCall(url, 'GET', undefined, undefined);
          return data;
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            logApiCall(url, 'GET', undefined, 'Request was cancelled');
            throw new Error('Request was cancelled');
          }
          logApiCall(url, 'GET', undefined, error);
          throw error;
        })
        .finally(() => {
          pendingRequests.delete(requestId);
        });
      
      // Store in pending requests map
      pendingRequests.set(requestId, {
        controller,
        priority,
        timestamp: Date.now()
      });
      
      return [fetchPromise, requestId];
    },
    
    /**
     * Cancel a specific request by ID
     */
    cancelRequest: (requestId: string): boolean => {
      const request = pendingRequests.get(requestId);
      if (request) {
        request.controller.abort();
        pendingRequests.delete(requestId);
        return true;
      }
      return false;
    },
    
    /**
     * Cancel all requests with priority lower than specified
     */
    cancelLowerPriority: (thanPriority: RequestPriority): number => {
      const priorities: Record<RequestPriority, number> = { 
        low: 0, 
        normal: 1, 
        high: 2, 
        critical: 3 
      };
      const targetPriority = priorities[thanPriority] || 1;
      
      let cancelCount = 0;
      for (const [id, request] of pendingRequests.entries()) {
        if (priorities[request.priority] < targetPriority) {
          request.controller.abort();
          pendingRequests.delete(id);
          cancelCount++;
        }
      }
      
      return cancelCount;
    },
    
    /**
     * Cancel all requests older than specified timestamp or age
     */
    cancelOlderThan: (timestampOrAge: number): number => {
      const cutoffTime = timestampOrAge > 1000000000000 
        ? timestampOrAge  // Timestamp
        : Date.now() - timestampOrAge;  // Age in ms
      
      let cancelCount = 0;
      for (const [id, request] of pendingRequests.entries()) {
        if (request.timestamp < cutoffTime) {
          request.controller.abort();
          pendingRequests.delete(id);
          cancelCount++;
        }
      }
      
      return cancelCount;
    },
    
    /**
     * Get current count of pending requests
     */
    getPendingCount: (): number => {
      return pendingRequests.size;
    }
  };
};

/**
 * Application-wide request manager instance
 */
export const apiRequests = createManagedRequest();

/**
 * Execute a function with a timeout, returning fallback on timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  fallbackFn: (() => T | Promise<T>) | T
): Promise<T> {
  try {
    const result = await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
      })
    ]);
    return result;
  } catch (error) {
    if (typeof fallbackFn === 'function') {
      const fallbackResult = (fallbackFn as Function)();
      return fallbackResult instanceof Promise ? await fallbackResult : fallbackResult;
    }
    return fallbackFn as T;
  }
}

/**
 * Generate a response using the specified function, with fallback in case of errors
 */
export async function withFallback<T>(
  generatorFn: () => Promise<T>,
  fallbackFn: (error: Error) => T | Promise<T>
): Promise<T> {
  try {
    return await generatorFn();
  } catch (error) {
    const fallbackResult = fallbackFn(error instanceof Error ? error : new Error(String(error)));
    return fallbackResult instanceof Promise ? await fallbackResult : fallbackResult;
  }
}

/**
 * Enhanced API logging utility
 */
export function logApiCall(url: string, method = 'GET', status?: number, error?: any) {
  console.log(`API ${method} to ${url} ${status ? `completed with status ${status}` : 'called'} ${error ? `ERROR: ${error}` : ''}`);
  
  // Debug the current environment
  console.log('Environment debug info:');
  console.log('- BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
}
