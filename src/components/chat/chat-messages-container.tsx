/**
 * Chat Messages Container Component
 * Displays the list of messages and handles auto-scroll
 * Shows loading animation while waiting for response
 *
 * Props:
 *   - messages: Array of chat messages
 *   - currentAiText: Streaming AI response text
 *   - loading: Loading state indicator
 *   - textSize: Current text size setting
 */

import React, { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "../../types/chat";
import { ChatMessage } from "./chat-message";
import { ThinkingAnimation } from "./thinking-animation";

interface ChatMessagesContainerProps {
  /** Array of all messages in conversation */
  messages: ChatMessageType[];
  /** Partially streamed AI response */
  currentAiText: string;
  /** Loading indicator state */
  loading: boolean;
  /** Current text size: compact, normal, or large */
  textSize: "compact" | "normal" | "large";
  loadMore?: () => void;
  onScrollChats?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ChatMessagesContainer({
  messages,
  currentAiText,
  loading,
  textSize,
  onScrollChats,
}: ChatMessagesContainerProps) {
  // Reference to scroll to bottom when new messages arrive
  const chatEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when messages change or text streams in
   * Uses smooth scroll behavior for better UX
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAiText, loading]);

  return (
    <div
      className="flex-1 relative h-full overflow-y-auto p-4 bg-[#0F0F0F] rounded-2xl flex flex-col gap-4"
      onScroll={onScrollChats}
    >
      {/* Render all previous messages */}
      {messages.map((msg, idx) => (
        <ChatMessage
          key={idx}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
          textSize={textSize}
        />
      ))}

      {/* Show thinking animation while loading */}
      {loading && <ThinkingAnimation />}

      {/* Show streaming AI response in real-time */}
      {currentAiText && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-3xl rounded-tl-lg px-6 py-4 bg-[#1A1A1A] text-[#E0E0E0] border border-[#2A2A2A]">
            <div
              className={
                textSize === "compact"
                  ? "text-sm"
                  : textSize === "large"
                  ? "text-lg"
                  : "text-base"
              }
            >
              <p className="whitespace-pre-wrap break-words">{currentAiText}</p>
              {/* Blinking cursor indicator */}
              <span className="animate-pulse ml-1 inline-block">|</span>
            </div>
          </div>
        </div>
      )}

      {/* Anchor point for auto-scroll */}
      <div ref={chatEndRef} />
    </div>
  );
}
