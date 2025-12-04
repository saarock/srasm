// Types for Toast
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItemProps {
  id: string;
  message: string;
  type: ToastType;
  onRemove: (id: string) => void;
}

// Tailwind styles for toast types
export const toastStyles: Record<ToastType, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-400 text-black",
  info: "bg-blue-500 text-white",
};
