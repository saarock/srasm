/**
 * Chat Message Component
 * Renders individual messages in the conversation
 * Handles different message types and code block rendering
 *
 * Props:
 *   - role: Who sent the message (user, agent, system)
 *   - content: Message text content
 *   - timestamp: When message was sent
 *   - textSize: Current text size setting
 */

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


interface ChatMessageProps {
  /** Role of message sender */
  role: "user" | "agent" | "system";
  /** Message content text */
  content: string;
  /** Optional timestamp */
  timestamp?: Date;
  /** Current text size setting */
  textSize: "compact" | "normal" | "large";
}

/**
 * Get text size classes based on setting
 */
function getTextSizeClass(size: "compact" | "normal" | "large") {
  switch (size) {
    case "compact":
      return "text-sm leading-relaxed";
    case "large":
      return "text-lg leading-relaxed";
    default:
      return "text-base leading-relaxed";
  }
}

export function ChatMessage({
  role,
  content,
  timestamp,
  textSize,
}: ChatMessageProps) {
  // Don't render system messages
  if (role === "system") return null;

  // Determine message styling based on role
  const isUser = role === "user";
  const baseClasses = isUser
    ? "bg-gradient-to-r from-[#00E6E6] to-[#00CFCF] text-black shadow-lg shadow-[#00E6E6]/20"
    : "bg-[#1A1A1A] text-[#E0E0E0] border border-[#2A2A2A]";

  // const parsedContent = parseMessageContent(content)

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] ${
          isUser ? "rounded-3xl rounded-tr-lg" : "rounded-3xl rounded-tl-lg"
        } px-6 py-4 ${baseClasses} shadow-md`}
      >
        {/* Message content with mixed text and code blocks */}
        <div className={getTextSizeClass(textSize)}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </Markdown>
        </div>

        {/* Optional timestamp */}
        {timestamp && (
          <div
            className={`text-xs mt-2 ${
              isUser ? "text-black/60" : "text-[#888]"
            }`}
          >
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
