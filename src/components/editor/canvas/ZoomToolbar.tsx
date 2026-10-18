"use client";

import { ZoomIn, ZoomOut, SplitSquareVertical } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

export default function ZoomToolbar() {
  const { zoom, setZoom, setPan, beforeAfterMode, setBeforeAfterMode } = useEditorStore();

  const handleZoomIn = () => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.15, +(z - 0.25).toFixed(2)));
  const handleFit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handle100 = () => {
    setZoom(1);
  };

  return (
    <div
      className="zoom-toolbar-container absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--surface-2)]/90 backdrop-blur-md border border-[var(--line-2)] shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-[var(--ink)] select-none"
    >
      {/* Zoom Out */}
      <button
        type="button"
        onClick={handleZoomOut}
        className="p-1.5 rounded-full hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <ZoomOut size={14} />
      </button>

      {/* Percentage dropdown / button */}
      <button
        type="button"
        onClick={handleFit}
        className="px-1.5 py-0.5 rounded-md font-mono font-bold text-xs hover:bg-[var(--surface-3)] text-[var(--ink)] transition-colors min-w-[42px] text-center"
        title="Click to Fit to View (0)"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom In */}
      <button
        type="button"
        onClick={handleZoomIn}
        className="p-1.5 rounded-full hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <ZoomIn size={14} />
      </button>

      <div className="h-3.5 w-px bg-[var(--line)] mx-0.5" />

      {/* Fit to View */}
      <button
        type="button"
        onClick={handleFit}
        className="px-2 py-1 rounded-md text-[11px] font-semibold hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        title="Fit to Screen (0)"
      >
        Fit
      </button>

      {/* 100% (1:1) */}
      <button
        type="button"
        onClick={handle100}
        className="hidden sm:inline-block px-2 py-1 rounded-md text-[11px] font-semibold hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        title="100% Actual Size (1)"
      >
        1:1
      </button>

      <div className="h-3.5 w-px bg-[var(--line)] mx-0.5" />

      {/* Compare button */}
      <button
        type="button"
        onClick={() => setBeforeAfterMode(!beforeAfterMode)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          beforeAfterMode
            ? "bg-[var(--green)] text-[var(--green-ink)] font-bold shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-3)]"
        }`}
        title="Toggle Before/After Compare (\ key)"
      >
        <SplitSquareVertical size={13} />
        <span className="hidden xs:inline">Compare</span>
      </button>

      <style jsx>{`
        .zoom-toolbar-container {
          bottom: 16px;
        }
        @media (max-width: 900px) {
          .zoom-toolbar-container {
            bottom: calc(72px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </div>
  );
}
