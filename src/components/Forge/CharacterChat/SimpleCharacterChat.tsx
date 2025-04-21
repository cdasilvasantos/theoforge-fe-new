'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CharacterData } from '@/lib/characterUtils.client';

interface SimpleCharacterChatProps {
  initialCharacters: CharacterData[];
  title?: string;
  subtitle?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const SimpleCharacterChat: React.FC<SimpleCharacterChatProps> = ({
  initialCharacters,
  title = 'Character Chat',
  subtitle = 'Chat with AI characters',
}) => {
  // State management
  const [characters] = useState<CharacterData[]>(initialCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with first character if available
  useEffect(() => {
    if (initialCharacters.length > 0 && !selectedCharacter) {
      setSelectedCharacter(initialCharacters[0]);
      console.log('Initialized with character:', initialCharacters[0].name);
    }
  }, [initialCharacters, selectedCharacter]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle character selection
  const handleCharacterSelect = (character: CharacterData) => {
    setSelectedCharacter(character);
    setMessages([]);
    console.log('Selected character:', character.name);
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedCharacter) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Optimistically update UI
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setConnectionError(null);
    
    // Create a placeholder message
    const placeholderMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: '...',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, placeholderMessage]);
    
    try {
      console.log('Sending message to direct chat server...');
      
      // Connect directly to the chat server running on port 3000
      const chatServerUrl = 'http://localhost:3000/chat';
      
      console.log('Using chat server URL:', chatServerUrl);
      
      const response = await fetch(chatServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3001', // Add origin for CORS
        },
        body: JSON.stringify({
          message: userMessage.content
        }),
      });
      
      console.log('Chat server response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // This is a streaming response, so we need to handle it differently
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });
          
          // Process SSE format (data: {...}\n\n)
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.trim().startsWith('data:')) {
              try {
                const jsonStr = line.replace('data:', '').trim();
                const data = JSON.parse(jsonStr);
                
                if (data.content) {
                  responseText += data.content;
                  
                  // Update the placeholder message as we receive content
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === placeholderMessage.id
                        ? {
                            ...msg,
                            content: responseText,
                          }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
      
      if (!responseText) {
        throw new Error('No response content received');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError(String(error));
      
      // Update placeholder with fallback response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === placeholderMessage.id
            ? {
                ...msg,
                content: `I am ${selectedCharacter.name}. I'm having trouble with my connection, but I look forward to our conversation. Please try again in a moment.`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Character selection sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Characters</h2>
          <div className="space-y-2">
            {characters.map(character => (
              <button
                key={character.id}
                className={`w-full text-left p-2 rounded ${
                  selectedCharacter?.id === character.id 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 overflow-hidden">
                    <Image 
                      src={character.imagePath || "/characters/images/default-avatar.png"} 
                      alt={character.name}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{character.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{character.title}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedCharacter ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {connectionError && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                      <div>
                        <p className="text-sm text-red-700">
                          Connection error: {connectionError}. Make sure the chat server is running on port 3000.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
                      <Image 
                        src={selectedCharacter.imagePath || "/characters/images/default-avatar.png"} 
                        alt={selectedCharacter.name}
                        width={80}
                        height={80}
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">{selectedCharacter.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedCharacter.shortBio}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Start your conversation by typing a message below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Input area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Message ${selectedCharacter.name}...`}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg px-4 py-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Please select a character to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCharacterChat;
