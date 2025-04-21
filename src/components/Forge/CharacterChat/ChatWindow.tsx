'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { CharacterData, formatCharacterName } from '@/lib/characterUtils.client';
import { UserRound, Info, X, MessageSquare, Send, FileText, Plus } from 'lucide-react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { MessageItem, scrollToMessage } from './MessageComponents';
import { Conversation, Message } from '@/lib/storageUtils';

// Memoized message item component for maximum performance
const VirtualizedMessageList = memo(({ 
  messages, 
  character, 
  imageError, 
  setImageError, 
  innerRef 
}: { 
  messages: Message[];
  character: CharacterData | null; 
  imageError: boolean; 
  setImageError: (val: boolean) => void; 
  innerRef: React.RefObject<VariableSizeList>; 
}) => {
  const imagePath = character ? `/characters/${character.id}.png` : '/characters/images/default-avatar.png';
  const listRef = useRef<VariableSizeList>(null);
  
  // Estimate the height of each message - could be refined further for more accuracy
  const getItemHeight = useCallback((index: number) => {
    const message = messages[index];
    if (!message) return 0;
    
    const contentLength = message.content.length;
    const baseHeight = 80; // Minimum height for a message bubble
    const lineHeight = 24; // Approximate line height in pixels
    const charsPerLine = 60; // Approximate characters per line
    
    // Estimate number of lines based on content length and chars per line
    const estimatedLines = Math.ceil(contentLength / charsPerLine);
    
    // Calculate estimated height
    return baseHeight + (estimatedLines * lineHeight);
  }, [messages]);
  
  // List key to force rerender when messages change
  const messageListKey = useMemo(() => 
    messages.map(m => m.id).join(','),
  [messages]);
  
  // Scroll to end on new messages
  useEffect(() => {
    if (innerRef.current && messages.length > 0) {
      innerRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [innerRef, messages, messageListKey]);

  // Row renderer for virtualized list
  const Row = useCallback(({ 
    index, 
    style, 
    data: {
      messages,
      character,
      imagePath
    } 
  }: { 
    index: number; 
    style: React.CSSProperties; 
    data: {
      messages: Message[];
      character: CharacterData | null;
      imagePath: string;
    }
  }) => {
    const message = messages[index];
    const isFirst = index === 0 || (index > 0 && messages[index - 1].role !== message.role);
    const isLatest = index === messages.length - 1;
    
    return (
      <MessageItem
        message={message}
        characterName={character?.name}
        characterImagePath={imagePath}
        isLatest={isLatest}
        index={index}
        isFirst={isFirst}
      />
    );
  }, []);
  
  return (
    <div className="flex-grow overflow-hidden h-full">
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            ref={innerRef}
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={getItemHeight}
            itemData={{
              messages,
              character,
              imagePath
            }}
            overscanCount={5}
            initialScrollOffset={0}
            style={{ overflowX: 'hidden' }}
          >
            {Row}
          </VariableSizeList>
        )}
      </AutoSizer>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom memo comparison to prevent unnecessary re-renders
  return (
    prevProps.messages.length === nextProps.messages.length &&
    prevProps.character?.id === nextProps.character?.id &&
    prevProps.imageError === nextProps.imageError
  );
});

VirtualizedMessageList.displayName = 'VirtualizedMessageList';

interface ChatWindowProps {
  messages: Message[];
  character: CharacterData | null;
  isGenerating?: boolean;
  hasCharacterSelected?: boolean;
  onSendMessage?: (message: string) => void;
  onRetry?: (messageId: string) => void;
  onClearChat?: () => void;
  onCharacterSelect?: () => void;
  isSending?: boolean;
  isLoading?: boolean;
  conversations?: Conversation[];
  currentConversation?: Conversation | null;
  onNewConversation?: () => void;
  onLoadConversation?: (id: string) => void;
  characters?: CharacterData[];
  onCancelStreaming?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  character, 
  isGenerating = false,
  hasCharacterSelected = true,
  onSendMessage,
  onRetry,
  onClearChat,
  onCharacterSelect,
  isSending = false,
  isLoading = false,
  conversations = [],
  currentConversation = null,
  onNewConversation,
  onLoadConversation,
  characters = [],
  onCancelStreaming,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [imageError, setImageError] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);

  // Ensure image path is correctly formatted with direct path to PNG files
  const imagePath = character ? `/characters/${character.id}.png` : '/characters/images/default-avatar.png';

  // Default Genesis Engine description
  const genesisEngineDescription = `This character is powered by TheoForge's Genesis Engine, which creates advanced AI personas with complex cognitive, emotional, and social profiles. Genesis Engine characters feature detailed backgrounds, personalities, and perspectives, enabling richer, more nuanced interactions.`;

  // Memoize character bio to prevent unnecessary recalculations
  const characterBio = useMemo(() => {
    if (!character) return genesisEngineDescription;
    
    if (character.background?.full_bio) {
      return character.background.full_bio;
    } else if (character.background?.short_bio) {
      return `${character.background.short_bio}\n\n${genesisEngineDescription}`;
    } else {
      return genesisEngineDescription;
    }
  }, [character, genesisEngineDescription]);

  useEffect(() => {
    // Add global method that can be called from other components
    if (typeof window !== 'undefined') {
      // @ts-ignore - Adding a custom property to the window object
      window.sendMessageToCharacter = (message: string) => {
        if (onSendMessage) {
          onSendMessage(message);
          return true;
        }
        return false;
      };
    }

    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        // @ts-ignore - Removing the custom property
        delete window.sendMessageToCharacter;
      }
    };
  }, [onSendMessage]);

  // Smooth scroll to bottom of messages when new messages are added
  useEffect(() => {
    // Use RAF for smoother animation frame-aligned scrolling
    requestAnimationFrame(() => {
      if (messagesEndRef.current && messageContainerRef.current) {
        const container = messageContainerRef.current;
        
        // For virtualized list implementation, we need to programmatically scroll
        // to the bottom using the container's scrollHeight
        if (messages.length > 0) {
          // Implementing a high-performance scroll without janky reflows
          try {
            // The virtualized list handles most of the DOM manipulation efficiently
            // Calculate approximate position - will be slightly imprecise but visually correct
            const scrollOptions = { 
              behavior: 'smooth' as const,
              block: 'end' as const
            };
            
            setTimeout(() => {
              // This creates a deferred execution path, reducing main thread blocking
              if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView(scrollOptions);
                
                // For virtualized lists, sometimes we need this additional scroll nudge
                // to ensure we're at the very bottom
                setTimeout(() => {
                  if (container) {
                    container.scrollTop = container.scrollHeight;
                  }
                }, 50);
              }
            }, 10);
            
            // Play subtle notification sound for new messages
            // Only play if we have messages and the last one is from the assistant
            if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
              // We could add a sound effect here if desired
              // const audio = new Audio('/sounds/message-received.mp3');
              // audio.volume = 0.2;
              // audio.play().catch(e => console.log('Audio play failed:', e));
            }
          } catch (e) {
            // Fallback for rare edge cases where scroll calculations might fail
            console.log('Scroll adjustment error:', e);
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }
        }
      }
    });
  }, [messages]);

  // Focus input field when character is selected
  useEffect(() => {
    if (character && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [character]);

  // Function to handle sending messages
  const handleSendMessage = () => {
    const textArea = messageInputRef.current;
    if (!textArea || !textArea.value.trim() || !onSendMessage) return;
    
    onSendMessage(textArea.value.trim());
    textArea.value = '';
    // Reset the height
    textArea.style.height = 'auto';
    // Focus back on input after sending
    setTimeout(() => textArea.focus(), 10);
  };

  // Function to handle Enter key press to send messages
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to auto-resize textarea
  const handleTextAreaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  // Create a properly typed ref for the virtualized list
  const virtualListRef = useRef<VariableSizeList>(null);

  return (
    <div className="h-full flex flex-col">
      {/* Chat message area */}
      <div 
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        style={{ backgroundColor: showBio ? 'rgba(0,0,0,0.02)' : '' }}
      >
        {!hasCharacterSelected && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400">
            <MessageSquare size={40} className="mb-4 opacity-50" />
            <h3 className="text-lg font-poppins font-medium mb-2">Select a Character to Begin</h3>
            <p className="max-w-md">
              Choose a character from the sidebar to start a conversation
            </p>
            <button
              onClick={onCharacterSelect}
              className="mt-6 md:hidden px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors"
            >
              View Characters
            </button>
          </div>
        )}
        
        {hasCharacterSelected && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md mb-4">
              <Image
                src={imagePath}
                alt={character ? formatCharacterName(character.name) : 'Character'}
                fill
                sizes="(max-width: 768px) 96px, 96px"
                className="object-cover"
                onError={() => setImageError(true)}
                style={{ 
                  opacity: imageError ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <UserRound size={40} className="text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-poppins font-medium mb-2">
              {character ? formatCharacterName(character.name) : 'Character'}
            </h3>
            {character?.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{character.title}</p>
            )}
            <div className="max-w-md space-y-3">
              {character?.conversation_starters && character.conversation_starters.length > 0 ? (
                <>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Start your conversation:</p>
                  <div className="grid gap-2">
                    {character.conversation_starters.slice(0, 3).map((starter, index) => (
                      <button
                        key={index}
                        onClick={() => onSendMessage?.(starter)}
                        className="text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p>
                  Start your conversation with {character ? formatCharacterName(character.name) : 'the character'}.
                </p>
              )}
            </div>
          </div>
        )}
        
        {hasCharacterSelected && messages.length > 0 && (
          <>
            {/* Virtualized message list for performance optimization */}
            <div className="h-full">
              <VirtualizedMessageList 
                messages={messages}
                character={character}
                imageError={imageError}
                setImageError={setImageError}
                innerRef={virtualListRef}
              />
            </div>
            
            {/* Typing indicator */}
            {isGenerating && (
              <div className="flex justify-start items-end space-x-2 animate-fade-in">
                <div className="flex-shrink-0 relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={imagePath}
                    alt={character ? formatCharacterName(character.name) : 'Character'}
                    fill
                    sizes="32px"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    style={{ 
                      opacity: imageError ? 0 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <UserRound size={16} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 rounded-lg bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-typing"></span>
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Character bio overlay */}
      {showBio && character && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 z-10 overflow-auto p-4 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-poppins font-semibold text-gray-900 dark:text-white">
                About {formatCharacterName(character.name)}
              </h3>
              <button 
                onClick={() => setShowBio(false)} 
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close bio"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                  <Image
                    src={imagePath}
                    alt={formatCharacterName(character.name)}
                    fill
                    sizes="(max-width: 768px) 96px, 160px"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    style={{ 
                      opacity: imageError ? 0 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <UserRound size={40} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-grow">
                <h4 className="text-xl font-poppins font-medium text-gray-900 dark:text-white mb-1">
                  {formatCharacterName(character.name)}
                </h4>
                {character.title && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{character.title}</p>
                )}
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{characterBio}</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowBio(false)}
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors mt-4"
            >
              Return to Conversation
            </button>
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900">
        {/* Character info button or typing status */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {character && (
              <button
                onClick={() => setShowBio(true)}
                className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="View character information"
              >
                <Info size={14} className="mr-1" />
                <span>About {formatCharacterName(character.name)}</span>
              </button>
            )}
          </div>
          
          {isGenerating && (
            <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
              Thinking...
            </div>
          )}
        </div>
        
        {/* Message input */}
        <div 
          className={`flex items-end border ${isInputFocused ? 'border-primary dark:border-primary-dark' : 'border-gray-200 dark:border-gray-700'} rounded-lg overflow-hidden transition-colors`}
        >
          <textarea
            ref={messageInputRef}
            placeholder={hasCharacterSelected ? `Message ${character ? formatCharacterName(character.name) : ''}...` : "Select a character to start chatting"}
            className="w-full px-3 py-2 resize-none max-h-32 focus:outline-none dark:bg-gray-800 dark:text-white"
            rows={1}
            disabled={!hasCharacterSelected || isGenerating}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={handleKeyPress}
            onInput={handleTextAreaInput}
            aria-label="Type your message"
          />
          <button
            onClick={handleSendMessage}
            disabled={!hasCharacterSelected || isGenerating}
            className={`flex-shrink-0 p-3 ${
              !hasCharacterSelected || isGenerating 
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' 
                : 'bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600'
            } transition-colors`}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add typing to the window object
declare global {
  interface Window {
    sendMessageToCharacter?: (message: string) => void;
  }
}

export default ChatWindow;
