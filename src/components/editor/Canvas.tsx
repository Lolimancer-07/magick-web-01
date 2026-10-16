"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  Loader2,
  SplitSquareVertical,
  RotateCw,
  ArrowUpDown,
  ArrowLeftRight,
  Maximize2,
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

interface CanvasProps {
  onRetry?: () => void;
}

export default function Canvas({ onRetry }: CanvasProps) {
  const {
    previewUrl,
    beforeUrl,
    previewLoading,
    previewError,
    beforeAfterMode,
    setBeforeAfterMode,
    originalDimensions,
    addStep,
  } = useEditorStore();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [dividerPos, setDividerPos] = useState(50); // percentage 0-100
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Handle Space key for panning
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

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(5, +(z + 0.2).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.15, +(z - 0.2).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => {
      const next = z + delta;
      return Math.min(5, Math.max(0.15, +next.toFixed(2)));
    });
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isDraggingDivider) return;
    setIsPanning(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingDivider && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
        setDividerPos(+pct.toFixed(1));
        return;
      }

      if (isPanning) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPan({
          x: dragStartRef.current.panX + dx,
          y: dragStartRef.current.panY + dy,
        });
      }
    },
    [isPanning, isDraggingDivider]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDraggingDivider(false);
  }, []);

  const activeUrl = previewUrl || beforeUrl;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
      {/* Top Floating Glass Toolbar */}
      <div className="absolute top-4 z-20 flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-2xl border border-ink/10 shadow-[0_8px_30px_rgba(46,54,69,0.1)]">
        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-ink/80 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut size={16} aria-hidden="true" />
        </button>

        {/* Zoom % */}
        <button
          type="button"
          onClick={handleResetZoom}
          className="font-mono font-bold text-xs px-2 py-1 text-ink min-w-[50px] text-center hover:bg-slate-100 rounded-md transition-colors"
          title="Click to reset zoom to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-ink/80 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn size={16} aria-hidden="true" />
        </button>

        {/* Reset / Fit */}
        <button
          type="button"
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg text-ink/80 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Reset zoom and center"
          title="Reset Zoom & Pan"
        >
          <Maximize2 size={15} aria-hidden="true" />
        </button>

        <div className="h-4 w-px bg-ink/15 mx-1" />

        {/* Quick Transforms */}
        <button
          type="button"
          onClick={() => addStep("rotate", { deg: 90 })}
          className="p-1.5 rounded-lg text-ink/80 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          title="Rotate 90° Clockwise"
          aria-label="Rotate 90 degrees clockwise"
        >
          <RotateCw size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => addStep("flop", {})}
          className="p-1.5 rounded-lg text-ink/80 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          title="Flip Horizontal"
          aria-label="Flip Horizontal"
        >
          <ArrowLeftRight size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => addStep("flip", {})}
          className="p-1.5 rounded-lg text-ink/80 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          title="Flip Vertical"
          aria-label="Flip Vertical"
        >
          <ArrowUpDown size={15} aria-hidden="true" />
        </button>

        <div className="h-4 w-px bg-ink/15 mx-1" />

        {/* Before / After Compare Toggle */}
        <button
          type="button"
          onClick={() => setBeforeAfterMode(!beforeAfterMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
            beforeAfterMode
              ? "bg-green text-white shadow-sm"
              : "bg-slate-100 text-ink/80 hover:bg-slate-200"
          }`}
          aria-pressed={beforeAfterMode}
          aria-label="Toggle split compare view"
        >
          <SplitSquareVertical size={14} aria-hidden="true" />
          <span>Compare</span>
        </button>

        {originalDimensions && (
          <span className="hidden lg:inline-block text-[11px] font-mono text-muted pl-2 border-l border-ink/10">
            {originalDimensions.w} × {originalDimensions.h} px
          </span>
        )}
      </div>

      {/* Main Canvas Viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[65vh] md:h-[78vh] flex items-center justify-center rounded-2xl border border-ink/10 overflow-hidden bg-[#dedad5] ${
          spacePressed || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(46,54,69,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
        }}
      >
        {/* Loading overlay badge */}
        {previewLoading && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md border border-ink/15 rounded-full shadow-md animate-in fade-in">
            <Loader2 size={14} className="animate-spin text-green-d" aria-hidden="true" />
            <span className="text-xs font-medium text-ink">Rendering in WASM...</span>
          </div>
        )}

        {/* Error overlay banner */}
        {previewError && (
          <div className="absolute bottom-6 z-30 max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl shadow-xl flex items-start gap-3">
            <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
            <div className="flex-1 text-sm text-red-900">
              <p className="font-bold">Render Issue</p>
              <p className="text-xs mt-0.5 text-red-700">{previewError}</p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-3 py-1 rounded-lg bg-white border border-red-200 text-xs font-semibold text-red-800 hover:bg-red-100 cursor-pointer"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Image Display */}
        {activeUrl ? (
          <div
            className="transition-transform duration-75 ease-out flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            {beforeAfterMode && beforeUrl && previewUrl ? (
              /* Before / After Comparison Split View */
              <div className="relative select-none pointer-events-none rounded-2xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden bg-white">
                {/* Before Image (underneath) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforeUrl}
                  alt="Original before edits"
                  className="max-h-[60vh] max-w-[80vw] object-contain block"
                  draggable={false}
                />

                {/* After Image (clipped on top) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${dividerPos}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Edited preview after edits"
                    className="max-h-[60vh] max-w-none object-contain block"
                    style={{
                      width: containerRef.current?.querySelector("img")?.clientWidth || "auto",
                      height: containerRef.current?.querySelector("img")?.clientHeight || "auto",
                    }}
                    draggable={false}
                  />
                </div>

                {/* Draggable Divider Line */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize z-10 flex items-center justify-center"
                  style={{ left: `calc(${dividerPos}% - 14px)`, width: "28px" }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsDraggingDivider(true);
                  }}
                  role="slider"
                  aria-label="Before/after comparison divider"
                  aria-valuenow={dividerPos}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") {
                      setDividerPos((p) => Math.max(0, +(p - 5).toFixed(1)));
                    } else if (e.key === "ArrowRight") {
                      setDividerPos((p) => Math.min(100, +(p + 5).toFixed(1)));
                    }
                  }}
                >
                  <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                  <div className="absolute w-7 h-7 rounded-full bg-white border border-ink/20 shadow-lg flex items-center justify-center text-ink text-[11px] font-bold select-none">
                    ‹›
                  </div>
                </div>

                {/* Split Badges */}
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Edited (After)
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-md text-ink border border-ink/15 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Original (Before)
                </span>
              </div>
            ) : (
              /* Single View */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeUrl}
                alt="Image workspace canvas preview"
                className="max-h-[60vh] max-w-[80vw] object-contain rounded-2xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] block pointer-events-none bg-white"
                draggable={false}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted">
            <p className="font-display text-lg text-ink font-bold">No Image Active</p>
            <p className="text-sm">Upload an image to start transforming</p>
          </div>
        )}
      </div>
    </div>
  );
}
