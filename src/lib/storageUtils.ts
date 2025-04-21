/**
 * Storage Utilities - Client-side persistence layer with worker offloading
 * 
 * This module provides an interface for persisting data using a dedicated web worker
 * to prevent main thread blocking during storage operations.
 */

import { startMeasurement, endMeasurement } from './performanceMonitoring';

// Types for storage operations
export type StorageKey = string;

export interface StorageOptions {
  /** Store name to use (defaults to 'preferences') */
  storeName?: 'conversations' | 'characters' | 'preferences';
  /** Whether to use memory cache for this item */
  useCache?: boolean;
}

// In-memory cache for frequently accessed data
const memoryCache = new Map<string, any>();

// Maximum cache size
const MAX_CACHE_SIZE = 50;

// Cache key generator
const getCacheKey = (key: StorageKey, options: StorageOptions = { storeName: 'preferences' }): string => {
  return `${options.storeName ?? 'preferences'}:${key}`;
};

/**
 * Create and initialize the storage worker
 */
const createStorageWorker = (): Worker | null => {
  try {
    return new Worker('/workers/storage-worker.js');
  } catch (error) {
    console.error('Failed to create storage worker:', error);
    return null;
  }
};

// Create the worker
let storageWorker: Worker | null = null;

// Initialize the worker on first use
const getWorker = (): Worker | null => {
  if (!storageWorker && typeof window !== 'undefined') {
    storageWorker = createStorageWorker();
  }
  return storageWorker;
};

/**
 * Save data to storage using the worker
 */
export const saveToStorage = async <T>(
  key: StorageKey, 
  data: T,
  options?: StorageOptions
): Promise<{ success: boolean; error?: string }> => {
  const perfMark = startMeasurement('storage_save', { 
    key,
    storeName: options?.storeName ?? 'preferences',
    dataSize: JSON.stringify(data).length
  });
  
  try {
    // Cache the data in memory if caching is enabled
    if (options?.useCache !== false) {
      const cacheKey = getCacheKey(key, options || { storeName: 'preferences' });
      memoryCache.set(cacheKey, data);
      
      // Trim cache if it gets too large
      if (memoryCache.size > MAX_CACHE_SIZE) {
        const oldestKey = memoryCache.keys().next().value;
        if (oldestKey) {
          memoryCache.delete(oldestKey);
        }
      }
    }
    
    // Use local storage fallback if worker is unavailable
    const worker = getWorker();
    if (!worker) {
      if (typeof localStorage !== 'undefined') {
        const storageKey = `${(options?.storeName ?? 'preferences')}.${key}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
        endMeasurement(perfMark, { metadata: { fallback: true } });
        return { success: true };
      }
      endMeasurement(perfMark, { metadata: { error: true } });
      return { success: false, error: 'Storage not available' };
    }
    
    // Use the worker for async storage
    return new Promise(resolve => {
      worker.postMessage({ 
        type: 'save', 
        storeName: options?.storeName ?? 'preferences', 
        key, 
        data 
      });
      
      // Set up a listener for this specific operation
      const messageHandler = (event: MessageEvent) => {
        worker.removeEventListener('message', messageHandler);
        endMeasurement(perfMark);
        resolve(event.data ?? { success: true });
      };
      
      worker.addEventListener('message', messageHandler);
      
      // Fallback timeout in case worker doesn't respond
      setTimeout(() => {
        worker.removeEventListener('message', messageHandler);
        endMeasurement(perfMark, { metadata: { timeout: true } });
        resolve({ success: false, error: 'Worker timeout' });
      }, 5000);
    });
  } catch (error) {
    endMeasurement(perfMark, { metadata: { error: true } });
    console.error('Storage error:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Load data from storage using the worker
 */
export const loadFromStorage = async <T>(
  key: StorageKey, 
  options?: StorageOptions
): Promise<T | null> => {
  const perfMark = startMeasurement('storage_load', { 
    key,
    storeName: options?.storeName ?? 'preferences'
  });
  
  try {
    // Check memory cache first if caching is enabled
    if (options?.useCache !== false) {
      const cacheKey = getCacheKey(key, options || { storeName: 'preferences' });
      if (memoryCache.has(cacheKey)) {
        const cachedData = memoryCache.get(cacheKey);
        endMeasurement(perfMark, { metadata: { fromCache: true } });
        return cachedData as T;
      }
    }
    
    // Use local storage fallback if worker is unavailable
    const worker = getWorker();
    if (!worker) {
      if (typeof localStorage !== 'undefined') {
        const storageKey = `${options?.storeName ?? 'preferences'}.${key}`;
        const data = localStorage.getItem(storageKey);
        if (data) {
          try {
            const parsedData = JSON.parse(data) as T;
            
            // Cache the data
            if (options?.useCache !== false) {
              const cacheKey = getCacheKey(key, options || { storeName: 'preferences' });
              memoryCache.set(cacheKey, parsedData);
            }
            
            endMeasurement(perfMark, { metadata: { fallback: true } });
            return parsedData;
          } catch (e) {
            console.error('Error parsing storage data:', e);
          }
        }
        endMeasurement(perfMark, { metadata: { notFound: true } });
        return null;
      }
      endMeasurement(perfMark, { metadata: { error: true } });
      return null;
    }
    
    // Use the worker with MessageChannel for response
    return new Promise(resolve => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        const result = event.data;
        
        // Cache the data if found
        if (result && options?.useCache !== false) {
          const cacheKey = getCacheKey(key, options || { storeName: 'preferences' });
          memoryCache.set(cacheKey, result);
        }
        
        endMeasurement(perfMark);
        resolve(result ?? null);
      };
      
      worker.postMessage({ 
        type: 'load', 
        storeName: options?.storeName ?? 'preferences', 
        key 
      }, [channel.port2]);
      
      // Fallback timeout in case worker doesn't respond
      setTimeout(() => {
        endMeasurement(perfMark, { metadata: { timeout: true } });
        resolve(null);
      }, 3000);
    });
  } catch (error) {
    endMeasurement(perfMark, { metadata: { error: true } });
    console.error('Storage load error:', error);
    return null;
  }
};

/**
 * Get all items from a store
 */
export const getAllItems = async <T>(
  options?: StorageOptions & { 
    query?: { 
      indexName?: string; 
      keyRange?: IDBKeyRange; 
      direction?: 'next' | 'prev' 
    };
    limit?: number;
  }
): Promise<T[]> => {
  const perfMark = startMeasurement('storage_getAll', { 
    storeName: options?.storeName ?? 'conversations'
  });
  
  try {
    const worker = getWorker();
    if (!worker) {
      endMeasurement(perfMark, { metadata: { error: true } });
      return [];
    }
    
    // Use the worker with MessageChannel for response
    return new Promise(resolve => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        endMeasurement(perfMark);
        resolve(event.data ?? []);
      };
      
      worker.postMessage({ 
        type: 'getAll', 
        storeName: options?.storeName ?? 'conversations',
        data: options?.query,
        limit: options?.limit ?? 100
      }, [channel.port2]);
      
      // Fallback timeout in case worker doesn't respond
      setTimeout(() => {
        endMeasurement(perfMark, { metadata: { timeout: true } });
        resolve([]);
      }, 3000);
    });
  } catch (error) {
    endMeasurement(perfMark, { metadata: { error: true } });
    console.error('Storage getAll error:', error);
    return [];
  }
};

/**
 * Delete data from storage
 */
export const deleteFromStorage = async (
  key: StorageKey, 
  options?: StorageOptions
): Promise<{ success: boolean }> => {
  const perfMark = startMeasurement('storage_delete', { 
    key,
    storeName: options?.storeName ?? 'preferences'
  });
  
  try {
    // Remove from memory cache
    if (options?.useCache !== false) {
      const cacheKey = getCacheKey(key, options || { storeName: 'preferences' });
      memoryCache.delete(cacheKey);
    }
    
    // Use local storage fallback if worker is unavailable
    const worker = getWorker();
    if (!worker) {
      if (typeof localStorage !== 'undefined') {
        const storageKey = `${(options?.storeName ?? 'preferences')}.${key}`;
        localStorage.removeItem(storageKey);
        endMeasurement(perfMark, { metadata: { fallback: true } });
        return { success: true };
      }
      endMeasurement(perfMark, { metadata: { error: true } });
      return { success: false };
    }
    
    // Use the worker for async storage
    return new Promise(resolve => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        endMeasurement(perfMark);
        resolve(event.data ?? { success: true });
      };
      
      worker.postMessage({ 
        type: 'delete', 
        storeName: options?.storeName ?? 'preferences', 
        key 
      }, [channel.port2]);
      
      // Fallback timeout in case worker doesn't respond
      setTimeout(() => {
        endMeasurement(perfMark, { metadata: { timeout: true } });
        resolve({ success: false });
      }, 3000);
    });
  } catch (error) {
    endMeasurement(perfMark, { metadata: { error: true } });
    console.error('Storage delete error:', error);
    return { success: false };
  }
};

/**
 * Update character access metrics for predictive loading
 */
export const updateCharacterMetrics = async (
  characterId: string
): Promise<void> => {
  const worker = getWorker();
  if (!worker) return;
  
  worker.postMessage({ 
    type: 'updateCharacterMetrics', 
    key: characterId 
  });
};

/**
 * Conversation storage interface
 */
export interface Conversation {
  id: string;
  characterId: string;
  messages: Message[];
  lastUpdated: number;
  title?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  status?: 'sending' | 'sent' | 'failed' | 'typing' | 'streaming' | 'error';
}

/**
 * Save a conversation to storage
 */
export const saveConversation = async (
  conversation: Conversation
): Promise<{ success: boolean }> => {
  return saveToStorage(
    conversation.id,
    conversation,
    { storeName: 'conversations', useCache: true }
  );
};

/**
 * Load a conversation from storage
 */
export const loadConversation = async (
  conversationId: string
): Promise<Conversation | null> => {
  return loadFromStorage<Conversation>(
    conversationId,
    { storeName: 'conversations', useCache: true }
  );
};

/**
 * Get all conversations for a character
 */
export const getCharacterConversations = async (
  characterId: string
): Promise<Conversation[]> => {
  const allConversations = await getAllItems<Conversation>({
    storeName: 'conversations',
    query: {
      indexName: 'characterId',
      keyRange: IDBKeyRange.only(characterId),
      direction: 'prev'
    }
  });
  
  return allConversations.sort((a, b) => b.lastUpdated - a.lastUpdated);
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  characterId: string,
  initialMessage?: Message
): Promise<Conversation> => {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const conversation: Conversation = {
    id: conversationId,
    characterId,
    messages: initialMessage ? [initialMessage] : [],
    lastUpdated: Date.now()
  };
  
  await saveConversation(conversation);
  return conversation;
};

/**
 * Add a message to a conversation
 */
export const addMessageToConversation = async (
  conversationId: string,
  message: Message
): Promise<Conversation | null> => {
  const conversation = await loadConversation(conversationId);
  if (!conversation) return null;
  
  conversation.messages.push(message);
  conversation.lastUpdated = Date.now();
  
  await saveConversation(conversation);
  return conversation;
};
