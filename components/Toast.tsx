"use client";

import { useState, useCallback, useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastId = 0;
const toastListeners = new Set<(toast: Toast) => void>();

export const useToast = () => {
  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const id = `toast-${++toastId}`;
      const toast = { id, message, type, duration };
      toastListeners.forEach(listener => listener(toast));
    },
    [],
  );

  return {
    success: (message: string) => showToast(message, "success"),
    error: (message: string) => showToast(message, "error"),
    info: (message: string) => showToast(message, "info"),
    warning: (message: string) => showToast(message, "warning"),
  };
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      if (toast.duration) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
      }
    };

    toastListeners.add(handleToast);
    return () => {
      toastListeners.delete(handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-lg text-white font-medium max-w-sm animate-slide-in-right ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <span>
              {toast.type === "success" && "✓ "}
              {toast.type === "error" && "✗ "}
              {toast.type === "warning" && "⚠ "}
              {toast.type === "info" && "ℹ "}
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

