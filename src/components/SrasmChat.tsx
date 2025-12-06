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

import React, { useCallback, useEffect, useState } from "react";
import { useChat } from "../hooks";
import { ChatHeader, ChatMessagesContainer, ChatInput } from "./chat";
import ChatSidebar from "./ChatSideBar";
import type { TextSize, SrasmChatProps } from "../types";

export default function SrasmChat(props: SrasmChatProps) {
  // Manage text size preference
  const [textSize, setTextSize] = useState<TextSize>("normal");

  // Get all chat state and methods from custom hook
  const {
    messages,
    input,
    setInput,
    currentAiText,
    loading,

    sendMessage,
    setChatId,
    currentChatId,
    loadMore,
    isAutoScroll,
    setIsAutoScroll,
    messageLength,
    setMessages
  } = useChat();

  const [wasAtBottom, setWasAtBottom] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Have to work on the scroll again;
  const onScrollChats = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      const reachedBottom = scrollHeight - (scrollTop + clientHeight) < 20;

      // Step 1: Detect bottom ONCE
      if (!wasAtBottom && !isAtBottom && reachedBottom) {
        setIsAtBottom(true);
        setWasAtBottom(true); // updates on next render
        return;
      }

      // alert(wasAtBottom)
      // alert(wasAtBottom)
      // Step 2: Allow loading only if user once reached bottom
      if (wasAtBottom && scrollTop < 6000) {
        // alert("yes")
        loadMore?.();
      }
    },
    [wasAtBottom, isAtBottom, loadMore]
  );

  useEffect(() => {
    return () => {
      setWasAtBottom(false);
      setIsAtBottom(false);
    };
  }, [currentChatId]);

  useEffect(() => {
    return () => {
      if (
        props.chatPath.toString().trim() !== location.pathname.toString().trim()
      ) {
        sessionStorage.removeItem("chatId");
      }
    };
  }, [location.pathname, props.chatPath]);

  return (
    <div className="w-full h-screen flex flex-col bg-[#0A0A0A]">
      {/* Main container with gradient background */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] h-full">
          <ChatSidebar
            setChatMessages={setMessages}
            handleChatClick={setChatId}
            currentChatId={currentChatId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0A] shadow-[#00E6E6]/10 border-l border-[#1A1A1A]">
          {/* Header with title and controls */}
          <div className="px-8 pt-6">
            <ChatHeader textSize={textSize} onTextSizeChange={setTextSize} />
          </div>

          {/* Messages display area */}
          <div className="flex-1 overflow-y-auto">
            <ChatMessagesContainer
              messages={messages}
              currentAiText={currentAiText}
              loading={loading}
              loadMore={loadMore}
              textSize={textSize}
              onScrollChats={onScrollChats}
              isAutoScroll={isAutoScroll}
              setIsAutoScroll={setIsAutoScroll}
            />
          </div>

          {/* Input area */}
          <div className="px-8 pb-6 pt-4">
            <ChatInput
              messageLength={messageLength}
              input={input}
              setInput={setInput}
              onSendMessage={sendMessage}
              loading={loading}
              currentChatMessageLen={messages.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
