"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
          <div className="card max-w-md">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-red-400 mb-2">
                Something went Wrong
              </h1>
              <p className="text-slate-400 mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.props.fallback || (
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Refresh Page
                </button>
              )}
              <details className="mt-6 text-left text-xs text-slate-500">
                <summary className="cursor-pointer hover:text-slate-400">
                  Error Details
                </summary>
                <pre className="mt-2 p-2 bg-slate-800 rounded overflow-auto">
                  {this.state.error?.message}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

