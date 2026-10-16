"use client";

import { ZoomIn, ZoomOut, Maximize2, SplitSquareVertical } from "lucide-react";
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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#cfc9c3] shadow-[0_4px_16px_rgba(46,54,69,0.12)] text-ink select-none">
      {/* Zoom Out */}
      <button
        type="button"
        onClick={handleZoomOut}
        className="p-1 rounded-full hover:bg-[#ebe8e5] text-ink/80 hover:text-ink transition-colors cursor-pointer"
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <ZoomOut size={15} />
      </button>

      {/* Percentage dropdown / button */}
      <button
        type="button"
        onClick={handleFit}
        className="px-2 py-0.5 rounded-md font-mono font-bold text-xs hover:bg-[#ebe8e5] text-ink transition-colors min-w-[48px] text-center"
        title="Click to Fit to View (0)"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom In */}
      <button
        type="button"
        onClick={handleZoomIn}
        className="p-1 rounded-full hover:bg-[#ebe8e5] text-ink/80 hover:text-ink transition-colors cursor-pointer"
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <ZoomIn size={15} />
      </button>

      <div className="h-3.5 w-px bg-[#cfc9c3] mx-1" />

      {/* Fit to View */}
      <button
        type="button"
        onClick={handleFit}
        className="px-2 py-1 rounded-md text-[11px] font-semibold hover:bg-[#ebe8e5] text-ink transition-colors cursor-pointer"
        title="Fit to Screen (0)"
      >
        Fit
      </button>

      {/* 100% (1:1) */}
      <button
        type="button"
        onClick={handle100}
        className="px-2 py-1 rounded-md text-[11px] font-semibold hover:bg-[#ebe8e5] text-ink transition-colors cursor-pointer"
        title="100% Actual Size (1)"
      >
        1:1
      </button>

      <div className="h-3.5 w-px bg-[#cfc9c3] mx-1" />

      {/* Compare button */}
      <button
        type="button"
        onClick={() => setBeforeAfterMode(!beforeAfterMode)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          beforeAfterMode
            ? "bg-[#2abc60] text-ink font-bold shadow-sm"
            : "text-ink/80 hover:bg-[#ebe8e5]"
        }`}
        title="Toggle Before/After Compare (\ key)"
      >
        <SplitSquareVertical size={13} />
        <span>Compare</span>
      </button>
    </div>
  );
}
