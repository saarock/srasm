/**
 * Chat Type Definitions
 * Centralized TypeScript interfaces for the chat application
 * Ensures type safety across components
 */

/** Represents a single message in the chat conversation */
export interface ChatMessage {
  /** Role of the message sender: user, agent, or system */
  role: "user" | "agent" | "system"
  /** The content/text of the message */
  content: string
  /** Optional timestamp for when message was created */
  timestamp?: Date
  /** Optional ID for unique message identification */
  id?: string
}

// For multiple chat load
export interface ChatMessages {
  messages: ChatMessage[];
  noMoreData: boolean;
}

/** Converts chat role to LangChain-compatible format */
export function mapRole(role: ChatMessage["role"]): "human" | "ai" | "system" {
  if (role === "user") return "human"
  if (role === "agent") return "ai"
  return "system"
}

/** Text size options for the chat interface */
export type TextSize = "compact" | "normal" | "large"

/** Configuration for text size styling */
export interface TextSizeConfig {
  compact: string
  normal: string
  large: string
}
