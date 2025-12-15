"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"

// Toast type definition for developer clarity
export type ToastType = "success" | "error" | "loading" | "info"

// Individual toast interface - defines structure of a single toast notification
export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

// Global toast state management
let toastListeners: Array<(toast: Toast) => void> = []
let dismissListeners: Array<(id: string) => void> = []
let toastId = 0

/**
 * Custom Toast API - Replaces react-hot-toast
 * Primary color: #00E6E6 (cyan/turquoise)
 */
export const toast = {
    // Show success toast with primary color (#00E6E6)
    success: (message: string, options?: { duration?: number }) => {
        const id = `toast-${toastId++}`
        const newToast: Toast = {
            id,
            message,
            type: "success",
            duration: options?.duration || 4000,
        }
        toastListeners.forEach((listener) => listener(newToast))
        return id
    },

    // Show error toast with red color
    error: (message: string, options?: { duration?: number }) => {
        const id = `toast-${toastId++}`
        const newToast: Toast = {
            id,
            message,
            type: "error",
            duration: options?.duration || 4000,
        }
        toastListeners.forEach((listener) => listener(newToast))
        return id
    },

    // Show loading toast - doesn't auto-dismiss
    loading: (message: string) => {
        const id = `toast-${toastId++}`
        const newToast: Toast = {
            id,
            message,
            type: "loading",
            duration: 0, // Loading toasts don't auto-dismiss
        }
        toastListeners.forEach((listener) => listener(newToast))
        return id
    },

    // Show info toast
    info: (message: string, options?: { duration?: number }) => {
        const id = `toast-${toastId++}`
        const newToast: Toast = {
            id,
            message,
            type: "info",
            duration: options?.duration || 4000,
        }
        toastListeners.forEach((listener) => listener(newToast))
        return id
    },

    // Manually dismiss a toast by its ID
    dismiss: (id: string) => {
        dismissListeners.forEach((listener) => listener(id))
    },
}

/**
 * Custom Toast Container Component
 * Displays toast notifications in bottom-right corner with animations
 */
export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        // Register listener to add new toasts
        const addToast = (toast: Toast) => {
            setToasts((prev) => [...prev, toast])

            // Auto-dismiss toasts with duration > 0
            if (toast.duration && toast.duration > 0) {
                setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }, toast.duration)
            }
        }

        const handleDismiss = (id: string) => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }

        toastListeners.push(addToast)
        dismissListeners.push(handleDismiss)

        // Cleanup listeners on unmount
        return () => {
            toastListeners = toastListeners.filter((l) => l !== addToast)
            dismissListeners = dismissListeners.filter((l) => l !== handleDismiss)
        }
    }, [])

    // Manual dismiss function for close button
    const dismissToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
            ))}
        </div>
    )
}

/**
 * Individual Toast Item Component
 * Renders a single toast with appropriate styling based on type
 */
interface ToastItemProps {
    toast: Toast
    onDismiss: () => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    // Determine colors and icons based on toast type
    const getToastStyles = () => {
        switch (toast.type) {
            case "success":
                // Primary color: #00E6E6
                return "bg-[#00E6E6] text-black border-[#00E6E6]"
            case "error":
                return "bg-red-500 text-white border-red-500"
            case "loading":
                return "bg-gray-800 text-white border-gray-600"
            case "info":
                return "bg-blue-500 text-white border-blue-500"
            default:
                return "bg-gray-800 text-white border-gray-600"
        }
    }

    return (
        <div
            className={`
        ${getToastStyles()}
        min-w-[300px] max-w-[400px]
        px-4 py-3 rounded-lg
        shadow-lg border-2
        flex items-center justify-between gap-3
        animate-in slide-in-from-right duration-300
      `}
        >
            {/* Loading spinner for loading state */}
            {toast.type === "loading" && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}

            {/* Toast message */}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>

            {/* Close button - hidden for loading toasts */}
            {toast.type !== "loading" && (
                <button onClick={onDismiss} className="shrink-0 hover:opacity-70 transition-opacity" aria-label="Dismiss toast">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
