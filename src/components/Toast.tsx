import { useEffect } from "react";
import { type ToastItemProps, toastStyles } from "../types";

// Single Toast
export const ToastItem = ({ id, message, type, onRemove }: ToastItemProps) => {
  useEffect(() => {
    // Auto remove toast after 4 seconds
    const timer = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${toastStyles[type]}`}
    >
      <div>
        {type === "success" && "✔️"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </div>
      <div className="flex-1 text-sm font-medium">{message}</div>
    </div>
  );
};
