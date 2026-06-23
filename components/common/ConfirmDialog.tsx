"use client";

import { AlertTriangle } from "lucide-react";
import { useState, useCallback, useEffect as useReactEffect } from "react";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

const confirmResolvers: Map<string, (confirmed: boolean) => void> = new Map();
let dialogId = 0;

export const confirmAction = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise(resolve => {
    const id = `confirm-${dialogId++}`;
    confirmResolvers.set(id, resolve);
    window.dispatchEvent(
      new CustomEvent("showConfirm", {
        detail: { ...options, id },
      }),
    );
  });
};

interface ConfirmDialogState {
  isOpen: boolean;
  options: ConfirmOptions & { id: string };
  isLoading: boolean;
}

export const ConfirmDialog = () => {
  const [state, setState] = useState<ConfirmDialogState>({
    isOpen: false,
    options: {
      id: "",
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      isDangerous: false,
    },
    isLoading: false,
  });

  useReactEffect(() => {
    const handleShowConfirm = ((e: CustomEvent) => {
      setState({
        isOpen: true,
        options: e.detail,
        isLoading: false,
      });
    }) as EventListener;

    window.addEventListener("showConfirm", handleShowConfirm);
    return () => window.removeEventListener("showConfirm", handleShowConfirm);
  }, []);

  const handleConfirm = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const resolver = confirmResolvers.get(state.options.id);
    if (resolver) {
      resolver(true);
      confirmResolvers.delete(state.options.id);
    }
    setState({
      isOpen: false,
      options: { ...state.options },
      isLoading: false,
    });
  }, [state.options]);

  const handleCancel = useCallback(() => {
    const resolver = confirmResolvers.get(state.options.id);
    if (resolver) {
      resolver(false);
      confirmResolvers.delete(state.options.id);
    }
    setState({
      isOpen: false,
      options: { ...state.options },
      isLoading: false,
    });
  }, [state.options]);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-200/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel rounded-2xl shadow-lg max-w-sm mx-4 overflow-hidden border border-slate-200">
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          {state.options.isDangerous && (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <h2 className="text-lg font-bold text-slate-900 font-serif italic">
            {state.options.title}
          </h2>
        </div>

        <p className="px-6 py-4 text-slate-600">{state.options.message}</p>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-200">
          <button
            onClick={handleCancel}
            disabled={state.isLoading}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
          >
            {state.options.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={state.isLoading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 transition-colors ${
              state.options.isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {state.isLoading
              ? "Please wait..."
              : state.options.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
