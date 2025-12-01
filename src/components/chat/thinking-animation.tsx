/**
 * Thinking Animation Component
 * Displays an elegant loading animation while waiting for AI response
 * Shows animated bouncing dots with cyan color scheme
 *
 * @returns {JSX.Element} Animated thinking indicator
 */

export function ThinkingAnimation() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <span className="text-sm text-[#00E6E6] font-medium">Thinking</span>
      <div className="flex gap-1.5 items-center">
        {/* Three animated dots with staggered animation */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-[#00E6E6] rounded-full animate-bounce"
            style={{
              // Stagger the animation with delays
              animationDelay: `${i * 150}ms`,
              animationDuration: "1.4s",
            }}
          />
        ))}
      </div>
    </div>
  )
}
