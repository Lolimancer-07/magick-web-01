"use client";

import { Suspense } from "react";
import EditorShell from "@/components/editor/EditorShell";

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-beige flex items-center justify-center">
          <div className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-ink rounded-2xl shadow-[4px_4px_0_var(--ink)]">
            <span className="w-4 h-4 rounded-full bg-green animate-ping" />
            <span className="font-display font-bold text-ink">Loading Magick Studio...</span>
          </div>
        </div>
      }
    >
      <EditorShell />
    </Suspense>
  );
}
