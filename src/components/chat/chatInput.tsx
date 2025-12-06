"use client";

import type React from "react";

/**
 * Chat Input Component
 * Handles user message input and sending
 * Provides input field and send button with loading state
 *
 * Props:
 *   - input: Current input value
 *   - setInput: Function to update input
 *   - onSendMessage: Callback when send button clicked
 *   - loading: Loading state indicator
 */

import { Send } from "lucide-react";
import { NUMBER_OF_CHATS } from "../../constants";

import type { ChatInputProps } from "../../types";

export function ChatInput({
  input,
  setInput,
  onSendMessage,
  loading,
  messageLength,
  currentChatMessageLen,
}: ChatInputProps) {
  /**
   * Handle Enter key press to send message
   * Prevents default form submission
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  return (
    <div className="mt-4 flex gap-3 items-center">
      {/* Text input field */}
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask about SRASM library, bugs, improvements..."
        disabled={
          loading ||
          messageLength > NUMBER_OF_CHATS ||
          currentChatMessageLen + messageLength > NUMBER_OF_CHATS
        }
        className="flex-1 px-6 py-4 rounded-full bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00E6E6] focus:border-transparent transition-all duration-200 disabled:opacity-50"
        aria-label="Chat message input"
      />

      {/* Send button */}
      <button
        onClick={onSendMessage}
        disabled={
          loading ||
          !input.trim() ||
          messageLength > NUMBER_OF_CHATS ||
          currentChatMessageLen + messageLength > NUMBER_OF_CHATS
        }
        className="px-6 py-4 rounded-full bg-gradient-to-r from-[#00E6E6] to-[#00CFCF] text-black font-semibold hover:shadow-lg hover:shadow-[#00E6E6]/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-200 flex items-center gap-2 group"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        <span>Send</span>
      </button>
    </div>
  );
}
