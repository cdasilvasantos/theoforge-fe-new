/**
 * Message State Management - Client Compatible
 * 
 * Optimized state management for real-time chat messages using reducers
 * to minimize re-renders and improve performance.
 */

import { Message } from './storageUtils.client';
import { createObjectPool } from './objectPool';

// Message action types
export type MessageAction = 
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'APPEND_TO_MESSAGE'; id: string; content: string }
  | { type: 'UPDATE_MESSAGE'; id: string; updates: Partial<Message> }
  | { type: 'REPLACE_MESSAGE'; tempId: string; message: Message }
  | { type: 'UPDATE_MESSAGE_STATUS'; id: string; status: 'sending' | 'sent' | 'failed' }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_MESSAGES'; messages: Message[] };

// Object pool for message objects to reduce GC pressure
const messagePool = createObjectPool<Message>(
  50, // pool size
  () => ({
    id: '',
    content: '',
    role: 'user',
    timestamp: ''
  }),
  (msg) => {
    msg.id = '';
    msg.content = '';
    msg.role = 'user';
    msg.timestamp = '';
  }
);

/**
 * Get a message object from the pool or create a new one
 */
export function getMessage(role: 'user' | 'assistant', content: string = ''): Message {
  const msg = messagePool.get();
  msg.id = `${role}_${Date.now()}`;
  msg.content = content;
  msg.role = role;
  msg.timestamp = new Date().toISOString();
  return msg;
}

/**
 * Return a message object to the pool for reuse
 */
export function recycleMessage(message: Message): void {
  messagePool.release(message);
}

/**
 * Recycle an array of messages
 */
export function recycleMessages(messages: Message[]): void {
  messages.forEach(recycleMessage);
}

/**
 * Message reducer for managing chat message state
 */
export function messageReducer(state: Message[], action: MessageAction): Message[] {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.message];
      
    case 'APPEND_TO_MESSAGE':
      return state.map(msg => 
        msg.id === action.id 
          ? { ...msg, content: msg.content + action.content }
          : msg
      );
      
    case 'UPDATE_MESSAGE':
      return state.map(msg => 
        msg.id === action.id 
          ? { ...msg, ...action.updates }
          : msg
      );
    
    case 'REPLACE_MESSAGE':
      return state.map(msg => 
        msg.id === action.tempId 
          ? action.message
          : msg
      );
      
    case 'UPDATE_MESSAGE_STATUS':
      return state.map(msg => 
        msg.id === action.id 
          ? { ...msg, status: action.status }
          : msg
      );
      
    case 'CLEAR_MESSAGES':
      // Recycle all messages back to the pool
      recycleMessages(state);
      return [];
      
    case 'SET_MESSAGES':
      // Recycle previous messages first
      recycleMessages(state);
      return action.messages;
      
    default:
      return state;
  }
}

/**
 * Create an optimistic user message
 */
export function createOptimisticUserMessage(text: string): Message {
  return {
    id: `temp_${Date.now()}`,
    content: text,
    role: 'user',
    timestamp: new Date().toISOString(),
    status: 'sending'
  };
}

/**
 * Create an assistant typing message (empty content)
 */
export function createTypingMessage(): Message {
  return {
    id: `typing_${Date.now()}`,
    content: '',
    role: 'assistant',
    timestamp: new Date().toISOString(),
    status: 'typing'
  };
}

/**
 * Create an error message
 */
export function createErrorMessage(errorText: string): Message {
  return {
    id: `error_${Date.now()}`,
    content: errorText,
    role: 'assistant',
    timestamp: new Date().toISOString(),
    status: 'error'
  };
}
