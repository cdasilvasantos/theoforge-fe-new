/**
 * Storage Worker - Offloads storage operations from the main thread
 * 
 * This worker handles IndexedDB operations for conversation history and
 * character data to prevent UI jank during heavy I/O operations.
 */

// Database configuration
const DB_NAME = 'character_chat_db';
const DB_VERSION = 1;
const CONVERSATIONS_STORE = 'conversations';
const CHARACTERS_STORE = 'characters';
const PREFERENCES_STORE = 'preferences';

// Open/initialize the database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Database error: ' + request.error);
    };
    
    request.onsuccess = (event) => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create conversation store with indices
      if (!db.objectStoreNames.contains(CONVERSATIONS_STORE)) {
        const conversationsStore = db.createObjectStore(CONVERSATIONS_STORE, { 
          keyPath: 'id' 
        });
        conversationsStore.createIndex('characterId', 'characterId', { unique: false });
        conversationsStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      }
      
      // Create characters store
      if (!db.objectStoreNames.contains(CHARACTERS_STORE)) {
        const charactersStore = db.createObjectStore(CHARACTERS_STORE, { 
          keyPath: 'id' 
        });
        charactersStore.createIndex('accessCount', 'accessCount', { unique: false });
        charactersStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
      }
      
      // Create preferences store
      if (!db.objectStoreNames.contains(PREFERENCES_STORE)) {
        db.createObjectStore(PREFERENCES_STORE, { 
          keyPath: 'key' 
        });
      }
    };
  });
}

/**
 * Save data to IndexedDB
 */
async function saveToIndexedDB(storeName, data) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put(data);
      
      request.onsuccess = () => {
        resolve({ success: true, id: request.result });
      };
      
      request.onerror = () => {
        reject('Error saving data: ' + request.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB save error:', error);
    throw error;
  }
}

/**
 * Load data from IndexedDB
 */
async function loadFromIndexedDB(storeName, key) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject('Error loading data: ' + request.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB load error:', error);
    throw error;
  }
}

/**
 * Get all data from a store
 */
async function getAllFromStore(storeName, query = null, count = 100) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (query && query.indexName) {
        const index = store.index(query.indexName);
        if (query.direction) {
          request = index.getAll(query.keyRange, count);
        } else {
          request = index.getAll(null, count);
        }
      } else {
        request = store.getAll(null, count);
      }
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject('Error getting data: ' + request.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB getAll error:', error);
    throw error;
  }
}

/**
 * Delete data from IndexedDB
 */
async function deleteFromIndexedDB(storeName, key) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.delete(key);
      
      request.onsuccess = () => {
        resolve({ success: true });
      };
      
      request.onerror = () => {
        reject('Error deleting data: ' + request.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB delete error:', error);
    throw error;
  }
}

/**
 * Clear all data from a store
 */
async function clearStore(storeName) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve({ success: true });
      };
      
      request.onerror = () => {
        reject('Error clearing store: ' + request.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB clear error:', error);
    throw error;
  }
}

/**
 * Save conversation data with optimized batching for large conversations
 */
async function saveConversation(conversation) {
  // Add metadata for storage
  const enhancedConversation = {
    ...conversation,
    lastUpdated: Date.now()
  };
  
  try {
    return await saveToIndexedDB(CONVERSATIONS_STORE, enhancedConversation);
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

/**
 * Update character access metrics for predictive loading
 */
async function updateCharacterMetrics(characterId) {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(CHARACTERS_STORE, 'readwrite');
    const store = transaction.objectStore(CHARACTERS_STORE);
    
    // Get current metrics or initialize new ones
    const getRequest = store.get(characterId);
    
    getRequest.onsuccess = () => {
      const metrics = getRequest.result || { 
        id: characterId, 
        accessCount: 0,
        lastAccessed: 0
      };
      
      // Update metrics
      metrics.accessCount += 1;
      metrics.lastAccessed = Date.now();
      
      // Save updated metrics
      store.put(metrics);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
    
    return { success: true };
  } catch (error) {
    console.error('Error updating character metrics:', error);
    return { success: false, error };
  }
}

// Message handler for worker
self.onmessage = async (event) => {
  const { type, key, data, storeName, port } = event.data;
  let result;
  
  try {
    switch (type) {
      case 'save':
        if (storeName === CONVERSATIONS_STORE) {
          result = await saveConversation(data);
        } else {
          result = await saveToIndexedDB(storeName || PREFERENCES_STORE, data);
        }
        break;
        
      case 'load':
        result = await loadFromIndexedDB(storeName || PREFERENCES_STORE, key);
        break;
        
      case 'delete':
        result = await deleteFromIndexedDB(storeName || PREFERENCES_STORE, key);
        break;
        
      case 'clear':
        result = await clearStore(storeName || PREFERENCES_STORE);
        break;
        
      case 'getAll':
        result = await getAllFromStore(storeName || CONVERSATIONS_STORE, data);
        break;
        
      case 'updateCharacterMetrics':
        result = await updateCharacterMetrics(key);
        break;
        
      default:
        result = { error: 'Unknown operation type' };
    }
    
    // Send result back if a MessagePort was provided
    if (port && port.postMessage) {
      port.postMessage(result);
    }
  } catch (error) {
    const errorResult = { 
      error: error.message || 'Unknown error in storage worker',
      errorType: error.name,
      success: false
    };
    
    // Send error back if a MessagePort was provided
    if (port && port.postMessage) {
      port.postMessage(errorResult);
    }
  }
};
