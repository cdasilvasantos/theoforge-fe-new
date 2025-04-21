/**
 * Cache System
 * 
 * A tiered caching implementation with memory and storage layers
 * designed for high-performance data access while maintaining
 * resource efficiency and predictable memory usage.
 */

// Interface for cache entries with TTL support
interface CacheEntry<T> {
  value: T;
  expires: number; // Unix timestamp for expiration
}

/**
 * LRU (Least Recently Used) Cache implementation
 * Automatically evicts least recently used items when capacity is reached
 */
export class LRUCache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private readonly max: number;
  private readonly defaultTTL: number;

  /**
   * Create a new LRU Cache
   * 
   * @param options Configuration options
   * @param options.max Maximum number of items to store
   * @param options.ttl Default time-to-live in milliseconds
   */
  constructor(options: { max: number; ttl: number }) {
    this.max = options.max;
    this.defaultTTL = options.ttl;
  }

  /**
   * Get a value from the cache
   * 
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get(key: K): V | undefined {
    const item = this.cache.get(key);
    
    // Return undefined if item doesn't exist
    if (!item) return undefined;
    
    // Check if item has expired
    if (item.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Move the accessed item to the end of the Map to mark as recently used
    this.cache.delete(key);
    this.cache.set(key, item);
    
    return item.value;
  }

  /**
   * Store a value in the cache
   * 
   * @param key The cache key
   * @param value The value to store
   * @param ttl Optional custom TTL in milliseconds
   */
  set(key: K, value: V, ttl?: number): void {
    // If cache has reached max size, remove the first item (least recently used)
    if (this.cache.size >= this.max) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    
    // Calculate expiration time
    const expires = Date.now() + (ttl || this.defaultTTL);
    
    // Add or update cache entry
    this.cache.set(key, { value, expires });
  }

  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key The cache key
   * @returns True if key exists and is not expired
   */
  has(key: K): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    
    if (item.expires < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove an item from the cache
   * 
   * @param key The cache key
   * @returns True if an item was removed
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Remove all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  size(): number {
    // Clean expired items first
    this.removeExpired();
    return this.cache.size;
  }

  /**
   * Remove all expired items from the cache
   */
  removeExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Storage Cache interface for persistence
 */
export interface StorageCache {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * LocalStorage implementation of the StorageCache interface
 */
export class LocalStorageCache implements StorageCache {
  private readonly prefix: string;

  constructor(prefix: string = 'app_cache_') {
    this.prefix = prefix;
  }

  /**
   * Get a value from localStorage
   */
  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item) as CacheEntry<T>;
      
      // Check if expired
      if (parsed.expires < Date.now()) {
        await this.remove(key);
        return null;
      }
      
      return parsed.value;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  }

  /**
   * Store a value in localStorage
   */
  async set<T>(key: string, value: T, ttl: number = 86400000): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const expires = Date.now() + ttl;
      const item: CacheEntry<T> = { value, expires };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.error('Error storing in localStorage:', error);
    }
  }

  /**
   * Remove an item from localStorage
   */
  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all cache items from localStorage
   */
  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing localStorage cache:', error);
    }
  }
}

/**
 * Tiered caching system that combines in-memory and storage caches
 */
export class TieredCache {
  private memoryCache: LRUCache<string, any>;
  private storageCache: StorageCache;

  /**
   * Create a new tiered cache
   * 
   * @param options Configuration options
   */
  constructor(options: {
    memoryCacheSize?: number;
    memoryTTL?: number;
    storageCache?: StorageCache;
  } = {}) {
    this.memoryCache = new LRUCache({
      max: options.memoryCacheSize || 100,
      ttl: options.memoryTTL || 300000 // 5 minutes
    });
    
    this.storageCache = options.storageCache || new LocalStorageCache();
  }

  /**
   * Get a value from the cache, trying memory first, then storage
   * 
   * @param key The cache key
   * @returns The value and its source
   */
  async get<T>(key: string): Promise<{ data: T | null; source: 'memory' | 'storage' | 'miss' }> {
    // Try memory cache first (fastest)
    const memoryResult = this.memoryCache.get(key) as T;
    if (memoryResult !== undefined) {
      return { data: memoryResult, source: 'memory' };
    }
    
    // Try storage cache next
    const storageResult = await this.storageCache.get<T>(key);
    if (storageResult !== null) {
      // Populate memory cache for future requests
      this.memoryCache.set(key, storageResult);
      return { data: storageResult, source: 'storage' };
    }
    
    // Cache miss
    return { data: null, source: 'miss' };
  }

  /**
   * Store a value in both memory and storage caches
   * 
   * @param key The cache key
   * @param value The value to store
   * @param ttl Optional time-to-live in milliseconds
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Always update memory cache
    this.memoryCache.set(key, value, ttl);
    
    // Update storage cache asynchronously
    await this.storageCache.set(key, value, ttl);
  }

  /**
   * Remove a value from all cache layers
   * 
   * @param key The cache key
   */
  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.storageCache.remove(key);
  }

  /**
   * Clear all cache layers
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.storageCache.clear();
  }
}

// Create singleton instance for global usage
export const appCache = new TieredCache();
