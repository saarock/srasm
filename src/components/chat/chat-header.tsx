"use client"

/**
 * Chat Header Component
 * Displays the app title, branding, and text size controls
 * Allows users to adjust message text size (compact, normal, large)
 *
 * Props:
 *   - textSize: Current text size setting
 *   - onTextSizeChange: Callback when text size changes
 */

import { Type } from "lucide-react"

interface ChatHeaderProps {
  /** Current text size: compact, normal, or large */
  textSize: "compact" | "normal" | "large"
  /** Callback to update text size */
  onTextSizeChange: (size: "compact" | "normal" | "large") => void
}

/**
 * Sizes available for text adjustment
 */
const SIZES = [
  { value: "compact" as const, label: "A−" },
  { value: "normal" as const, label: "A" },
  { value: "large" as const, label: "A+" },
] as const

export function ChatHeader({ textSize, onTextSizeChange }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A2A2A]">
      {/* Left: Title and branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E6E6] to-[#00CFCF] flex items-center justify-center">
          <span className="text-black font-bold text-lg">🤖</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">SRASM AI Debugger</h1>
          <p className="text-xs text-[#888]">Developer Guidance & Support</p>
        </div>
      </div>

      {/* Right: Text size controls */}
      <div className="flex gap-2 items-center bg-[#1A1A1A] p-1.5 rounded-full border border-[#2A2A2A]">
        <Type className="w-4 h-4 text-[#00E6E6] ml-2" />
        {SIZES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTextSizeChange(value)}
            className={`px-3 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              textSize === value
                ? "bg-gradient-to-r from-[#00E6E6] to-[#00CFCF] text-black shadow-lg shadow-[#00E6E6]/20"
                : "text-[#888] hover:text-[#00E6E6]"
            }`}
            aria-label={`Set text size to ${value}`}
            aria-pressed={textSize === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
