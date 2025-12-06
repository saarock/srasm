import type { Dispatch, SetStateAction } from "react";
import type { ChatMessage as ChatMessageType } from "./chat";

/**
 * Props for the ChatHeader component
 */
export interface ChatHeaderProps {
  /** Current text size: compact, normal, or large */
  textSize: "compact" | "normal" | "large";
  /** Callback to update text size */
  onTextSizeChange: (size: "compact" | "normal" | "large") => void;
}

/**
 * Props for the ChatInput component
 */
export interface ChatInputProps {
  /** Current input text value */
  input: string;
  /** Function to update input text */
  setInput: (input: string) => void;
  /** Callback when message is sent */
  onSendMessage: () => void;
  /** Loading state - true while waiting for response */
  loading: boolean;
  messageLength: number;
  currentChatMessageLen: number;
}

/**
 * Props for the ChatMessage component
 */
export interface ChatMessageProps {
  /** Role of message sender */
  role: "user" | "agent" | "system";
  /** Message content text */
  content: string;
  /** Optional timestamp */
  timestamp?: Date;
  /** Current text size setting */
  textSize: "compact" | "normal" | "large";
  loadMore?: () => void;
}

/**
 * Props for the ChatMessagesContainer component
 */
export interface ChatMessagesContainerProps {
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
  isAutoScroll?: boolean;
  setIsAutoScroll?: Dispatch<SetStateAction<boolean>>;
}

/**
 * Props for the CodeBlock component
 */
export interface CodeBlockProps {
  /** The code content to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
}
