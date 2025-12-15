/**
 * Custom Button Component
 *
 * Purpose: Provides a consistent button design across the application
 * with support for different variants and sizes.
 *
 * Features:
 * - Primary variant uses #00E6E6 brand color
 * - Outline variant for secondary actions
 * - Multiple size options
 * - Disabled state handling
 * - Accessible with proper focus states
 */

import type React from "react"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const Button: React.FC<CustomButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}) => {
  // Base styles applied to all buttons
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E6E6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  // Variant-specific styles
  const variantStyles = {
    primary: "bg-[#00E6E6] hover:bg-[#00E6E6]/90 text-black shadow-sm",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  }

  // Size-specific styles
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
