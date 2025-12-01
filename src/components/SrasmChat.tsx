"use client";

/**
 * Main SRASM Chat Component
 * Orchestrates all chat sub-components and manages state
 * This is the primary UI container for the chat interface
 *
 * Architecture:
 * - Uses useChat hook for state management
 * - Coordinates between header, messages, and input components
 * - Handles text size preferences
 */

import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { ChatHeader } from "./chat/chat-header";
import { ChatMessagesContainer } from "./chat/chat-messages-container";
import { ChatInput } from "./chat/chat-input";

export default function SrasmChat() {
  // Manage text size preference
  const [textSize, setTextSize] = useState<"compact" | "normal" | "large">(
    "normal"
  );

  // Get all chat state and methods from custom hook
  const { messages, input, setInput, currentAiText, loading, sendMessage } =
    useChat();

  return (
    <div className="w-full  h-screen flex flex-col">
      {/* Main container with gradient background */}
      <div className="flex-1 bg-[#0A0A0A]  shadow-[#00E6E6]/10 border border-[#1A1A1A] flex flex-col overflow-hidden">
        {/* Header with title and controls */}
        <div className="px-8 pt-6">
          <ChatHeader textSize={textSize} onTextSizeChange={setTextSize} />
        </div>

        {/* Messages display area */}
        <div className="flex-1 px-8 pb-4 overflow-hidden">
          <ChatMessagesContainer
            messages={messages}
            currentAiText={currentAiText}
            loading={loading}
            textSize={textSize}
          />
        </div>

        {/* Input area */}
        <div className="px-8 pb-6">
          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={sendMessage}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
