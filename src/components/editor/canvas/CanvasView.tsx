"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import ZoomToolbar from "./ZoomToolbar";
import CompareSlider from "./CompareSlider";

interface CanvasViewProps {
  onRetry?: () => void;
}

export default function CanvasView({ onRetry }: CanvasViewProps) {
  const {
    previewUrl,
    beforeUrl,
    previewLoading,
    previewError,
    beforeAfterMode,
    peekOriginal,
    zoom,
    setZoom,
    pan,
    setPan,
  } = useEditorStore();

  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Handle Space key for pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && document.activeElement?.tagName !== "INPUT") {
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpacePressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Wheel zoom anchored at cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => {
      const next = z + delta;
      return Math.min(5, Math.max(0.15, +next.toFixed(2)));
    });
  };

  // Mouse pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    },
    [isPanning, setPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Display URL: if holding peekOriginal, show beforeUrl; otherwise previewUrl or beforeUrl
  const activeUrl = peekOriginal ? beforeUrl : (previewUrl || beforeUrl);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative flex-1 w-full h-full flex items-center justify-center overflow-hidden canvas-checkerboard select-none ${
        spacePressed || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
    >
      {/* Non-blocking Rendering indicator in corner */}
      {previewLoading && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--line)] rounded-full shadow-sm text-xs text-[var(--ink)] font-medium pointer-events-none animate-in fade-in">
          <Loader2 size={13} className="animate-spin text-[var(--green)]" />
          <span>Rendering…</span>
        </div>
      )}

      {/* Peek Original Indicator */}
      {peekOriginal && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-black/80 text-white rounded-full text-xs font-bold uppercase tracking-wider pointer-events-none animate-in fade-in">
          Peeking Original (\)
        </div>
      )}

      {/* Error banner */}
      {previewError && (
        <div className="absolute bottom-16 z-30 max-w-sm mx-auto p-3 bg-red-50 border border-red-200 rounded-xl shadow-lg flex items-center gap-2.5 text-xs text-red-900">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <span className="flex-1 truncate">{previewError}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-2 py-0.5 rounded bg-[var(--surface)] border border-red-200 font-semibold hover:bg-red-50 cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Main Image Viewport */}
      {activeUrl ? (
        <div
          className="transition-transform duration-75 ease-out flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {beforeAfterMode && beforeUrl && previewUrl && !peekOriginal ? (
            <CompareSlider beforeUrl={beforeUrl} afterUrl={previewUrl} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeUrl}
              alt="Editor preview"
              className="max-h-[70vh] max-w-[85vw] object-contain rounded-xl border border-black/10 shadow-[0_20px_50px_rgba(46,54,69,0.18)] block pointer-events-none bg-[var(--surface)]"
              draggable={false}
            />
          )}
        </div>
      ) : null}

      {/* Floating Zoom Toolbar at bottom center */}
      <ZoomToolbar />
    </div>
  );
}
