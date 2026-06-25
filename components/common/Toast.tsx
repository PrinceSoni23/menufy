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
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    info: "bg-sky-50 border-sky-200 text-sky-700",
  };

  const iconColors = {
    success: "text-emerald-500",
    error: "text-rose-500",
    warning: "text-amber-500",
    info: "text-sky-500",
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
        <span className="text-xs font-bold uppercase tracking-[0.18em]">
          OK
        </span>
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
