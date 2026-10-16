"use client";

import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-900 flex items-center justify-between gap-3 shrink-0"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={15} className="text-red-600 shrink-0" />
        <span>{message}</span>
      </div>

      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-2 py-0.5 rounded bg-white border border-red-300 font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          aria-label="Dismiss error"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
