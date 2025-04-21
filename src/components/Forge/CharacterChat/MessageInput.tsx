'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isGenerating?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isGenerating = false,
  disabled = false,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 44), 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isGenerating && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-grow bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 min-h-[44px] max-h-[150px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark resize-none"
          style={{ scrollbarWidth: 'thin' }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isGenerating || disabled}
          className={`
            flex-shrink-0 rounded-lg p-2
            ${(!message.trim() || isGenerating || disabled)
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-primary dark:bg-primary-dark text-white cursor-pointer hover:bg-primary-dark dark:hover:bg-opacity-90'
            }
            transition-colors
          `}
          aria-label="Send message"
        >
          <SendIcon size={20} />
        </button>
      </div>
      <p className="mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400 px-1">
        {isGenerating ? 'AI is responding...' : <span className="hidden sm:inline">Press Enter to send, Shift+Enter for a new line</span>}
      </p>
    </div>
  );
};

export default MessageInput;
