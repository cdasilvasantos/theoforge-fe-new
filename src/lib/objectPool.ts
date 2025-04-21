/**
 * Object Pool
 * 
 * A high-performance memory management system that reduces garbage collection
 * pressure by reusing objects instead of creating new ones.
 */

export interface ObjectPool<T> {
  /**
   * Get an object from the pool or create a new one if the pool is empty
   */
  get: () => T;
  
  /**
   * Return an object to the pool for future reuse
   */
  release: (obj: T) => void;
  
  /**
   * Get the current size of the pool
   */
  size: () => number;
  
  /**
   * Reset all objects in the pool to their initial state
   */
  reset: (resetFn?: (obj: T) => void) => void;
  
  /**
   * Drain the pool (for cleanup on component unmount)
   */
  drain: () => void;
}

/**
 * Creates an object pool for efficient memory management
 * 
 * @param maxSize Maximum number of objects to keep in the pool
 * @param factory Function that creates new objects when the pool is empty
 * @param reset Optional function to reset an object before returning it to the pool
 * @returns An ObjectPool instance
 */
export function createObjectPool<T>(
  maxSize: number,
  factory: () => T,
  reset?: (obj: T) => void
): ObjectPool<T> {
  // Initialize pool with specified size
  const pool: T[] = [];
  
  return {
    get: () => {
      if (pool.length > 0) {
        return pool.pop()!;
      }
      return factory();
    },
    
    release: (obj: T) => {
      if (pool.length < maxSize) {
        // Reset the object if a reset function is provided
        if (reset) {
          reset(obj);
        }
        pool.push(obj);
      }
      // If pool is full, object is left for garbage collection
    },
    
    size: () => pool.length,
    
    reset: (resetFn) => {
      if (resetFn) {
        pool.forEach(resetFn);
      } else if (reset) {
        pool.forEach(reset);
      }
    },
    
    drain: () => {
      pool.length = 0;
    }
  };
}

/**
 * Creates a specialized pool for message objects
 * 
 * @param maxSize Maximum pool size
 * @returns Message object pool
 */
export function createMessagePool<T extends {
  id: string;
  content: string;
  role: string;
  timestamp: string;
}>(maxSize: number = 50): ObjectPool<T> {
  return createObjectPool<T>(
    maxSize,
    // Factory function creates empty message objects
    () => ({
      id: '',
      content: '',
      role: '',
      timestamp: ''
    }) as T,
    // Reset function clears message properties
    (msg) => {
      msg.id = '';
      msg.content = '';
      msg.role = '';
      msg.timestamp = '';
    }
  );
}

/**
 * Creates a reusable array pool to reduce allocations during list operations
 * 
 * @param maxSize Maximum pool size
 * @param arraySize Initial size of created arrays
 * @returns Array object pool
 */
export function createArrayPool<T>(
  maxSize: number = 20,
  arraySize: number = 10
): ObjectPool<T[]> {
  return createObjectPool<T[]>(
    maxSize,
    // Factory creates new arrays with preallocated capacity
    () => new Array<T>(arraySize),
    // Reset empties the array without deallocating
    (arr) => {
      arr.length = 0;
    }
  );
}
