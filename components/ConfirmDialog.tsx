"use client";

import { useState, useCallback, useEffect } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

let confirmResolver: ((result: boolean) => void) | null = null;

export const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      confirmResolver = result => {
        resolve(result);
        setOpen(false);
      };
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  return { confirm, open, options, setOpen };
};

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  // Listen for confirm requests
  useEffect(() => {
    const originalConfirm = window.confirm;
    // Set up global listener if needed
  }, []);

  const handleConfirm = () => {
    if (confirmResolver) {
      confirmResolver(true);
      confirmResolver = null;
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (confirmResolver) {
      confirmResolver(false);
      confirmResolver = null;
    }
    setOpen(false);
  };

  if (!options || !open) return null;

  const variantColors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${open ? "block" : "hidden"}`}
    >
      <div className="bg-slate-800 rounded-lg p-6 max-w-sm border border-slate-700">
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          {options.title}
        </h2>
        <p className="text-slate-400 mb-6">{options.message}</p>
        <div className="flex gap-3">
          <button onClick={handleCancel} className="flex-1 btn-outline">
            {options.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 ${variantColors[options.variant || "danger"]} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
          >
            {options.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

