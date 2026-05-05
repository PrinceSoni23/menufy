"use client";

import React, { ReactNode, useEffect } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ToastContainer } from "@/components/common/Toast";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export function RootLayoutClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .card"),
    );

    targets.forEach(target => {
      if (target.classList.contains("card")) {
        target.classList.add("reveal");
      }
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    targets.forEach(target => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <ErrorBoundary
      onError={error => {
        console.error("Application error:", error);
      }}
    >
      {children}
      <ToastContainer />
      <ConfirmDialog />
    </ErrorBoundary>
  );
}

