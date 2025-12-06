"use client"

/**
 * Code Block Component
 * Renders code snippets with syntax highlighting and copy functionality
 * Supports multiple programming languages with proper formatting
 *
 * Props:
 *   - code: The code content to display
 *   - language: Programming language (optional, defaults to 'plaintext')
 */

import { useState } from "react"
import { Copy, Check } from "lucide-react"

import type { CodeBlockProps } from "../../types/chatComponentsTypes"

export function CodeBlock({ code, language = "plaintext" }: CodeBlockProps) {
  // Track copy button state for visual feedback
  const [copied, setCopied] = useState(false)

  /**
   * Handle copy to clipboard action
   * Shows temporary feedback to user
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)

      // Reset copy button after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[CodeBlock] Copy failed:", error)
    }
  }

  return (
    <div className="relative my-3 bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg overflow-hidden group">
      {/* Header with language label and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-[#2A2A2A] rounded transition-colors duration-200"
          aria-label="Copy code to clipboard"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#00E6E6]" />
          ) : (
            <Copy className="w-4 h-4 text-[#00E6E6] opacity-60 group-hover:opacity-100" />
          )}
        </button>
      </div>

      {/* Code content with syntax highlighting */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
