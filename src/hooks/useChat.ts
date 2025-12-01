"use client";

/**
 * useChat Custom Hook
 * Manages all chat-related state and logic
 * Handles message state, API communication, and streaming responses
 *
 * This hook encapsulates the core chat functionality, making it reusable
 * across multiple components and easy to test
 */

import { useState, useCallback } from "react";
import { type ChatMessage } from "../types";
import model from "../config/lanchain";

/**
 * Interface for the use-chat hook return value
 */
interface UseChartReturn {
  /** Array of all chat messages */
  messages: ChatMessage[];
  /** Current user input value */
  input: string;
  /** Partially streamed AI response text */
  currentAiText: string;
  /** Loading state - true while waiting for AI response */
  loading: boolean;
  /** Update user input value */
  setInput: (input: string) => void;
  /** Send a new message and get AI response */
  sendMessage: () => Promise<void>;
}

/**
 * Custom hook for managing chat state and operations
 *
 * @returns {UseChartReturn} Chat state and methods
 */
export function useChat(): UseChartReturn {
  // State for all messages in the conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "Actually this tool is for developer guidance. Suggest improvements about the SRASM library and try to solve possible issues.",
    },
  ]);

  // State for current user input
  const [input, setInput] = useState("");

  // State for streaming AI response text
  const [currentAiText, setCurrentAiText] = useState("");

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  /**
   * Send a message to the AI and receive a streaming response
   * Updates message history and handles real-time text streaming
   */
  const sendMessage = useCallback(async () => {
    // Validate input is not empty and not already loading
    if (!input.trim() || loading) return;

    const userInput = input;

    // Reset input fields
    setInput("");
    setCurrentAiText("");
    setLoading(true);

    // Inside sendMessage, replace the API call block with LangChain streaming
    try {
      const updatedMessages = [
        ...messages,
        { role: "user", content: userInput },
      ];
      setMessages(updatedMessages as ChatMessage[]);

      // Convert messages to LangChain roles
      const langChainMessages = updatedMessages.map((m) => ({
        role:
          m.role === "user" ? "human" : m.role === "agent" ? "ai" : "system",
        content: m.content,
      }));

      // Use LangChain streaming
      const stream = await model.stream(langChainMessages);

      let partial = "";

      // Stream AIMessageChunk objects from LangChain
      for await (const chunk of stream) {
        partial += chunk.text ?? "";
        setCurrentAiText(partial); // Update typing effect
      }

      // Add full AI message to chat history
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: partial, timestamp: new Date() },
      ]);
      setCurrentAiText("");
    } catch (err) {
      console.error("[useChat] AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: `Error: Failed to get response. ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return {
    messages,
    input,
    currentAiText,
    loading,
    setInput,
    sendMessage,
  };
}
