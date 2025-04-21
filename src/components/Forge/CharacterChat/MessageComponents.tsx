/**
 * Message Components
 * 
 * Optimized rendering components for chat messages using temporal component splitting
 * to improve performance and provide a premium experience.
 */

import React, { useState, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { measureExecution } from '@/lib/performanceMonitoring';

// Types for message components
export interface MessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    isError?: boolean;
  };
  characterName?: string;
  characterImagePath?: string;
  isLatest?: boolean;
  index?: number;
  isFirst?: boolean;
}

/**
 * Static content component that rarely re-renders
 * This separates expensive content rendering from animation logic
 */
export const StaticMessageContent = React.memo(({ content }: { content: string }) => {
  return (
    <div className="message-content prose prose-sm dark:prose-invert max-w-none">
      {content}
    </div>
  );
});

StaticMessageContent.displayName = 'StaticMessageContent';

/**
 * Animated container component for messages
 * Handles animation states independently from content
 */
export const AnimatedMessageContainer: React.FC<{
  message: MessageProps['message']; 
  children: React.ReactNode;
  isLatest?: boolean;
  className?: string;
}> = ({ message, children, isLatest, className = '' }) => {
  // Animation state management
  const [animationState, setAnimationState] = useState<'entering' | 'animating' | 'complete'>('entering');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use Layout Effect for animation transitions to ensure they happen before paint
  useLayoutEffect(() => {
    if (isLatest) {
      // Immediate layout phase
      setAnimationState('animating');
      
      // Calculate appropriate animation timing based on message complexity
      const wordCount = message.content.split(/\s+/).length;
      const baseDelay = Math.min(wordCount * 10, 300);
      
      // Schedule completion phase
      const timer = setTimeout(() => {
        setAnimationState('complete');
      }, baseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isLatest, message.content]);
  
  // Apply different classes based on animation state
  const animationClasses = 
    animationState === 'entering' ? 'opacity-0 transform translate-y-2' :
    animationState === 'animating' ? 'opacity-100 transform translate-y-0 transition-all duration-300' :
    'opacity-100';
  
  return (
    <div 
      ref={containerRef}
      className={`message-container ${animationClasses} ${className}`}
      data-message-id={message.id}
      data-message-role={message.role}
    >
      {children}
    </div>
  );
};

/**
 * Message metadata component
 * Can render independently from content
 */
export const MessageMetadata = React.memo(({ 
  timestamp, 
  authorName,
  isTyping
}: { 
  timestamp: string; 
  authorName: string;
  isTyping?: boolean;
}) => {
  return (
    <div className="message-meta flex items-center text-xs text-gray-500 dark:text-gray-400 justify-between">
      <span className="message-author font-medium">
        {authorName}
        {isTyping && (
          <span className="ml-2 italic text-xs">typing...</span>
        )}
      </span>
      <span className="message-time">{formatMessageTime(timestamp)}</span>
    </div>
  );
});

MessageMetadata.displayName = 'MessageMetadata';

/**
 * Format timestamp for display
 */
const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * User message component with optimized rendering
 */
export const UserMessage = React.memo(({ message, isLatest }: MessageProps) => {
  return (
    <AnimatedMessageContainer 
      message={message} 
      isLatest={isLatest}
      className="flex flex-col items-end my-2"
    >
      <div className="max-w-[85%] md:max-w-[75%] bg-blue-600 text-white rounded-lg px-4 py-2 shadow-sm">
        <StaticMessageContent content={message.content} />
      </div>
      <div className="px-2 pt-1">
        <MessageMetadata 
          timestamp={message.timestamp} 
          authorName="You" 
        />
      </div>
    </AnimatedMessageContainer>
  );
});

UserMessage.displayName = 'UserMessage';

/**
 * Assistant message component with optimized rendering
 */
export const AssistantMessage = React.memo(({ 
  message, 
  characterName = 'Assistant',
  characterImagePath = '/characters/images/default-avatar.png',
  isLatest,
  isFirst
}: MessageProps) => {
  return (
    <AnimatedMessageContainer 
      message={message} 
      isLatest={isLatest}
      className="flex flex-col my-2"
    >
      <div className="flex items-start">
        {isFirst && (
          <div className="mr-2 flex-shrink-0">
            <Image 
              src={characterImagePath}
              alt={characterName}
              width={40}
              height={40}
              className="rounded-full"
              loading="lazy"
            />
          </div>
        )}
        <div className={`max-w-[85%] md:max-w-[75%] ${isFirst ? 'ml-0' : 'ml-12'} bg-gray-200 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 shadow-sm`}>
          <StaticMessageContent content={message.content} />
        </div>
      </div>
      <div className="px-2 pt-1 ml-12">
        <MessageMetadata 
          timestamp={message.timestamp} 
          authorName={characterName}
          isTyping={message.content === '' && isLatest}
        />
      </div>
    </AnimatedMessageContainer>
  );
});

AssistantMessage.displayName = 'AssistantMessage';

/**
 * Advanced typing indicator with variable rhythm
 */
export const TypingIndicator = React.memo(({ 
  isTyping, 
  messageLength = 0, 
  characterResponseSpeed = 1 
}: { 
  isTyping: boolean; 
  messageLength?: number;
  characterResponseSpeed?: number;
}) => {
  // Calculate expected typing duration based on message complexity
  const expectedDuration = React.useMemo(() => {
    return messageLength * characterResponseSpeed * (0.8 + Math.random() * 0.4);
  }, [messageLength, characterResponseSpeed]);
  
  if (!isTyping) return null;
  
  return (
    <div 
      className="typing-indicator flex opacity-100 transition-opacity duration-200"
      style={{ 
        opacity: isTyping ? 1 : 0,
        height: isTyping ? 'auto' : 0,
        overflow: 'hidden'
      }}
    >
      <div className="flex space-x-1 p-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
      </div>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

/**
 * Message item container - picks the appropriate message type
 */
export const MessageItem = React.memo((props: MessageProps) => {
  return measureExecution(() => {
    if (props.message.role === 'user') {
      return <UserMessage {...props} />;
    } else {
      return <AssistantMessage {...props} />;
    }
  }, 'message_render', { 
    role: props.message.role, 
    isLatest: props.isLatest || false 
  });
});

MessageItem.displayName = 'MessageItem';

/**
 * Physics-based smooth scrolling function
 */
export const smoothScrollTo = (
  element: HTMLElement, 
  targetPosition: number, 
  options: { duration?: number; easing?: (t: number) => number } = {}
): void => {
  const startTime = performance.now();
  const startPosition = element.scrollTop;
  const distance = targetPosition - startPosition;
  const duration = options.duration || 300;
  
  // Default cubic easing
  const easing = options.easing || ((t) => 1 - Math.pow(1 - t, 3));
  
  // Animation frame loop
  const scroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    element.scrollTop = startPosition + distance * easedProgress;
    
    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };
  
  requestAnimationFrame(scroll);
};

/**
 * Two-phase scroll to message
 */
export const scrollToMessage = (
  containerRef: React.RefObject<HTMLElement>,
  messageId: string,
  smooth = true
): void => {
  if (!containerRef.current) return;
  
  // Phase 1: Fast initial positioning
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (!messageElement) return;
  
  const containerRect = containerRef.current.getBoundingClientRect();
  const messageRect = messageElement.getBoundingClientRect();
  
  // Calculate optimal scroll position
  const optimalScroll = containerRef.current.scrollTop + 
    (messageRect.top - containerRect.top) - 
    (containerRect.height - messageRect.height) / 2;
  
  if (smooth) {
    // Phase 2: Smooth animation to final position
    smoothScrollTo(containerRef.current, optimalScroll);
  } else {
    // Immediate jump without animation
    containerRef.current.scrollTop = optimalScroll;
  }
};
