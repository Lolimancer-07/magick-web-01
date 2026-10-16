"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

export default function Toasts() {
  const { toasts, removeToast } = useEditorStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-10 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none select-none"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-[0_4px_16px_rgba(46,54,69,0.12)] text-xs text-[var(--ink)] animate-in slide-in-from-bottom duration-200"
        >
          {t.type === "success" && <CheckCircle2 size={15} className="text-[var(--green)] shrink-0" />}
          {t.type === "error" && <AlertCircle size={15} className="text-red-600 shrink-0" />}
          {(!t.type || t.type === "info") && <Info size={15} className="text-blue-500 shrink-0" />}

          <span className="flex-1 font-medium">{t.message}</span>

          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="p-0.5 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
