/**
 * Task Scheduler
 * 
 * Efficient priority-based task scheduling system that properly manages the event loop
 * to ensure optimal performance for both critical and background operations.
 */

type Task = () => void;
type TaskId = number;

/**
 * Priority-based task scheduler that efficiently manages the event loop
 */
export const taskScheduler = {
  /**
   * Schedule a high-priority task for immediate execution on the next animation frame
   * Use for visual updates that need to be synchronized with the browser's render cycle
   */
  high: (task: Task): TaskId => {
    return requestAnimationFrame(task);
  },

  /**
   * Schedule a medium-priority task to run as soon as possible after current execution
   * Use for operations that should happen quickly but don't need visual synchronization
   */
  medium: (task: Task): TaskId => {
    return window.setTimeout(task, 0);
  },

  /**
   * Schedule a low-priority task to run during idle periods
   * Use for non-essential background operations that can be deferred
   */
  low: (task: Task): TaskId => {
    if (typeof window.requestIdleCallback === 'function') {
      return window.requestIdleCallback(task);
    } else {
      return window.setTimeout(task, 50);
    }
  },

  /**
   * Cancel a scheduled task by ID and priority level
   */
  cancel: (id: TaskId, priority: 'high' | 'medium' | 'low'): void => {
    switch (priority) {
      case 'high':
        cancelAnimationFrame(id);
        break;
      case 'medium':
        clearTimeout(id);
        break;
      case 'low':
        if (typeof window.cancelIdleCallback === 'function') {
          window.cancelIdleCallback(id);
        } else {
          clearTimeout(id);
        }
        break;
    }
  }
};

/**
 * Debounce function that limits how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait) as unknown as number;
  };
}

/**
 * Throttle function that ensures a function is called at most once per specified period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          const currentArgs = lastArgs;
          lastArgs = null;
          func(...currentArgs);
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

// Add requestIdleCallback type definitions for TypeScript
declare global {
  interface Window {
    requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}
