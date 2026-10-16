"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, AlertTriangle, Loader2, SplitSquareVertical } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import ClayCard from "@/components/ui/ClayCard";
import Button from "@/components/ui/Button";

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
  const handleZoomIn = () => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.2, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((z) => {
      const next = z + delta;
      return Math.min(5, Math.max(0.2, +next.toFixed(2)));
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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none overflow-hidden">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 z-20 flex flex-wrap items-center gap-2 px-3 py-2 bg-beige/90 backdrop-blur-md rounded-2xl border-2 border-ink shadow-[3px_3px_0_var(--ink)]">
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 rounded-xl border-2 border-ink bg-white hover:bg-gray text-ink font-display cursor-pointer transition-transform active:translate-y-0.5"
          aria-label="Zoom out"
        >
          <ZoomOut size={18} aria-hidden="true" />
        </button>

        <span className="font-display font-bold text-xs px-2 text-ink min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 rounded-xl border-2 border-ink bg-white hover:bg-gray text-ink font-display cursor-pointer transition-transform active:translate-y-0.5"
          aria-label="Zoom in"
        >
          <ZoomIn size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleResetZoom}
          className="p-2 rounded-xl border-2 border-ink bg-white hover:bg-gray text-ink font-display cursor-pointer transition-transform active:translate-y-0.5"
          aria-label="Reset zoom and position"
          title="Reset Zoom"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>

        <div className="h-5 w-0.5 bg-ink/20 mx-1" />

        <button
          type="button"
          onClick={() => setBeforeAfterMode(!beforeAfterMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-ink font-display text-xs font-bold cursor-pointer transition-transform active:translate-y-0.5 ${
            beforeAfterMode ? "bg-mint text-ink shadow-[2px_2px_0_var(--ink)]" : "bg-white text-ink hover:bg-gray"
          }`}
          aria-pressed={beforeAfterMode}
          aria-label="Toggle before and after split view"
        >
          <SplitSquareVertical size={16} aria-hidden="true" />
          <span>Compare</span>
        </button>

        {originalDimensions && (
          <span className="hidden sm:inline-block text-xs font-semibold text-muted ml-2">
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
        className={`relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center rounded-2xl border-2 border-ink overflow-hidden bg-gray/40 pattern-grid ${
          spacePressed || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--ink) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
        }}
      >
        {/* Loading overlay indicator */}
        {previewLoading && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-mint border-2 border-ink rounded-full shadow-[2px_2px_0_var(--ink)] animate-pulse">
            <Loader2 size={16} className="animate-spin text-ink" aria-hidden="true" />
            <span className="text-xs font-display font-bold text-ink">Rendering...</span>
          </div>
        )}

        {/* Error overlay banner */}
        {previewError && (
          <div className="absolute bottom-6 z-30 max-w-md mx-auto p-4 bg-salmon border-2 border-ink rounded-2xl shadow-[4px_4px_0_var(--ink)] flex items-start gap-3">
            <AlertTriangle size={24} className="shrink-0 text-ink" aria-hidden="true" />
            <div className="flex-1 text-sm font-medium text-ink">
              <p className="font-bold font-display">Processing Error</p>
              <p className="text-xs mt-0.5 text-ink/80">{previewError}</p>
            </div>
            {onRetry && (
              <Button size="sm" variant="white" onClick={onRetry}>
                Retry
              </Button>
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
              <div className="relative select-none pointer-events-none rounded-xl border-2 border-ink shadow-[4px_4px_0_var(--ink)] overflow-hidden">
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
                  <div className="w-1 h-full bg-ink" />
                  <div className="absolute w-7 h-7 rounded-full bg-white border-2 border-ink shadow-[2px_2px_0_var(--ink)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-ink" />
                  </div>
                </div>

                {/* Split Labels */}
                <span className="absolute top-3 left-3 px-2 py-1 bg-ink text-white rounded-lg text-[10px] font-bold font-display uppercase tracking-wider">
                  After
                </span>
                <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 text-ink border border-ink rounded-lg text-[10px] font-bold font-display uppercase tracking-wider">
                  Before
                </span>
              </div>
            ) : (
              /* Single View */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeUrl}
                alt="Image workspace canvas preview"
                className="max-h-[60vh] max-w-[80vw] object-contain rounded-xl border-2 border-ink shadow-[4px_4px_0_var(--ink)] block pointer-events-none"
                draggable={false}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted">
            <p className="font-display text-lg text-ink font-bold">No Image Active</p>
            <p className="text-sm">Upload an image to start transforming it</p>
          </div>
        )}
      </div>
    </div>
  );
}
