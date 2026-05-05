"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastId = 0;
const toastListeners: Set<(toast: Toast) => void> = new Set();

export const showToast = (
  message: string,
  type: ToastType = "info",
  duration = 3000,
) => {
  const toast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type,
    duration,
  };

  toastListeners.forEach(listener => listener(toast));
  return toast.id;
};

interface ToastItemProps extends Toast {
  onClose: (id: string) => void;
}

export const ToastItem = ({
  id,
  message,
  type,
  duration,
  onClose,
}: ToastItemProps) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-900/20 border-green-600/70 text-green-200",
    error: "bg-red-900/20 border-red-600/70 text-red-200",
    warning: "bg-yellow-900/20 border-yellow-600/70 text-yellow-200",
    info: "bg-teal-900/20 border-teal-600/70 text-teal-200",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return (
    <div
      className={`glass-panel flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[type]} mb-2 animate-slideIn`}
    >
      <div className={iconColors[type]}>{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleNewToast = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
    };

    toastListeners.add(handleNewToast);
    return () => {
      toastListeners.delete(handleNewToast);
    };
  }, []);

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-60">
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} onClose={handleClose} />
      ))}
    </div>
  );
};

