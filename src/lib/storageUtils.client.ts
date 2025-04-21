/**
 * Client-side Storage Utilities
 * 
 * Promise-based client-compatible persistence layer for Next.js client components.
 * Uses Promise chains instead of async/await to avoid client component restrictions.
 */

// Types for storage operations
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  status?: 'sending' | 'sent' | 'failed' | 'typing' | 'streaming' | 'error';
}

export interface Conversation {
  id: string;
  characterId: string;
  messages: Message[];
  lastUpdated: number;
  title?: string;
}

// Simple localStorage-based implementation for client components
const STORAGE_PREFIX = 'theoforge_';

/**
 * Save an item to localStorage with proper error handling
 */
function saveToLocalStorage<T>(key: string, data: T): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
      resolve({ success: true });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      resolve({ success: false });
    }
  });
}

/**
 * Load an item from localStorage with proper error handling
 */
function loadFromLocalStorage<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    try {
      const serialized = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!serialized) {
        resolve(null);
        return;
      }
      
      const data = JSON.parse(serialized) as T;
      resolve(data);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      resolve(null);
    }
  });
}

/**
 * Get all items matching a pattern from localStorage
 */
function getAllItemsFromLocalStorage<T>(prefix: string): Promise<T[]> {
  return new Promise((resolve) => {
    try {
      const fullPrefix = `${STORAGE_PREFIX}${prefix}`;
      const results: T[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(fullPrefix)) {
          try {
            const serialized = localStorage.getItem(key);
            if (serialized) {
              const data = JSON.parse(serialized) as T;
              results.push(data);
            }
          } catch (e) {
            // Skip items that can't be parsed
            console.error('Error parsing item:', e);
          }
        }
      }
      
      resolve(results);
    } catch (error) {
      console.error('Error loading all items from localStorage:', error);
      resolve([]);
    }
  });
}

/**
 * Save a conversation to storage
 */
export function saveConversation(
  conversation: Conversation
): Promise<{ success: boolean }> {
  return saveToLocalStorage(`conversation_${conversation.id}`, conversation);
}

/**
 * Load a conversation from storage
 */
export function loadConversation(
  conversationId: string
): Promise<Conversation | null> {
  return loadFromLocalStorage<Conversation>(`conversation_${conversationId}`);
}

/**
 * Get all conversations for a character
 */
export function getCharacterConversations(
  characterId: string
): Promise<Conversation[]> {
  return getAllItemsFromLocalStorage<Conversation>(`conversation_`)
    .then(conversations => {
      // Filter conversations for this character
      const filtered = conversations.filter(conv => conv.characterId === characterId);
      // Sort by last updated (newest first)
      return filtered.sort((a, b) => b.lastUpdated - a.lastUpdated);
    });
}

/**
 * Create a new conversation
 */
export function createConversation(
  characterId: string,
  initialMessage?: Message
): Promise<Conversation> {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const conversation: Conversation = {
    id: conversationId,
    characterId,
    messages: initialMessage ? [initialMessage] : [],
    lastUpdated: Date.now()
  };
  
  return saveConversation(conversation)
    .then(() => conversation);
}

/**
 * Add a message to a conversation
 */
export function addMessageToConversation(
  conversationId: string,
  message: Message
): Promise<Conversation | null> {
  return loadConversation(conversationId)
    .then(conversation => {
      if (!conversation) return null;
      
      conversation.messages.push(message);
      conversation.lastUpdated = Date.now();
      
      return saveConversation(conversation)
        .then(() => conversation);
    });
}

/**
 * Update character usage metrics
 */
export function updateCharacterMetrics(
  characterId: string
): Promise<{ success: boolean }> {
  const key = `metrics_${characterId}`;
  
  return loadFromLocalStorage<{ 
    characterId: string; 
    uses: number; 
    lastUsed: number; 
  }>(key)
    .then(metrics => {
      const updatedMetrics = metrics 
        ? { 
            ...metrics, 
            uses: metrics.uses + 1, 
            lastUsed: Date.now() 
          }
        : { 
            characterId, 
            uses: 1, 
            lastUsed: Date.now() 
          };
      
      return saveToLocalStorage(key, updatedMetrics);
    });
}
