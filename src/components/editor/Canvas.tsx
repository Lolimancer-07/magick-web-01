"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
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

  const iconBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "var(--muted)",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
  };

  const iconBtnHoverStyle: React.CSSProperties = {
    ...iconBtnStyle,
    background: "var(--surface-2)",
    color: "var(--ink)",
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
      {/* Top Floating Glass Toolbar */}
      <div
        className="absolute top-4 z-20 flex flex-wrap items-center gap-1.5 px-3 py-1.5"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line-2)",
          borderRadius: "9999px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
        }}
      >
        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className=""
          style={iconBtnStyle}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut size={16} aria-hidden="true" />
        </button>

        {/* Zoom % */}
        <button
          type="button"
          onClick={handleResetZoom}
          className=""
          style={{ ...iconBtnStyle, minWidth: "46px", background: "transparent", color: "var(--ink)" }}
          title="Click to reset zoom to 100%"
          aria-label="Reset zoom"
        >
          {Math.round(zoom * 100)}
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className=""
          style={iconBtnStyle}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn size={16} aria-hidden="true" />
        </button>

        {/* Reset / Fit */}
        <button
          type="button"
          onClick={handleResetZoom}
          className=""
          style={iconBtnStyle}
          aria-label="Reset zoom and center"
          title="Reset Zoom & Pan"
        >
          <Maximize2 size={15} aria-hidden="true" />
        </button>

        <div style={{ width: 1, height: 16, background: "var(--line-2)", margin: "0 2px" }} />

        {/* Quick Transforms */}
        <button
          type="button"
          onClick={() => addStep("rotate", { deg: 90 })}
          className=""
          style={iconBtnStyle}
          title="Rotate 90° Clockwise"
          aria-label="Rotate 90 degrees clockwise"
        >
          <RotateCw size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => addStep("flop", {})}
          className=""
          style={iconBtnStyle}
          title="Flip Horizontal"
          aria-label="Flip Horizontal"
        >
          <ArrowLeftRight size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => addStep("flip", {})}
          className=""
          style={iconBtnStyle}
          title="Flip Vertical"
          aria-label="Flip Vertical"
        >
          <ArrowUpDown size={15} aria-hidden="true" />
        </button>

        <div style={{ width: 1, height: 16, background: "var(--line-2)", margin: "0 2px" }} />

        {/* Before / After Compare Toggle */}
        <button
          type="button"
          onClick={() => setBeforeAfterMode(!beforeAfterMode)}
          className=""
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            background: beforeAfterMode ? "var(--green)" : "var(--surface-2)",
            color: beforeAfterMode ? "var(--green-ink)" : "var(--muted)",
            fontSize: "0.75rem",
            fontWeight: 700,
            transition: "background 0.2s, color 0.2s",
          }}
          aria-pressed={beforeAfterMode}
          aria-label="Toggle split compare view"
        >
          <SplitSquareVertical size={14} aria-hidden="true" />
          <span>Compare</span>
        </button>

        {originalDimensions && (
          <span
            className="text-[11px] font-mono pl-2"
            style={{ color: "var(--muted)", paddingLeft: 8, borderLeft: "1px solid var(--line-2)" }}
          >
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
        className={`relative w-full h-[65vh] md:h-[78vh] flex items-center justify-center rounded-[18px] border overflow-hidden ${
          spacePressed || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        style={{
          backgroundColor: "var(--ed-bg)",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
        }}
      >
        {/* Loading overlay badge */}
        {previewLoading && (
          <div
            className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "var(--surface)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--line-2)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Loader2 size={14} className="animate-spin" style={{ color: "var(--green)" }} aria-hidden="true" />
            <span className="text-xs font-medium" style={{ color: "var(--ink)" }}>
              Rendering in WASM...
            </span>
          </div>
        )}

        {/* Error overlay banner */}
        {previewError && (
          <div
            className="absolute bottom-6 z-30 max-w-md mx-auto p-4 rounded-2xl flex items-start gap-3"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,69,58,0.35)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: "var(--red)" }} aria-hidden="true" />
            <div className="flex-1 text-sm" style={{ color: "var(--ink)" }}>
              <p className="font-bold">Render Issue</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{previewError}</p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className=""
                style={{
                  padding: "4px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--line-2)",
                  background: "transparent",
                  color: "var(--ink)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
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
              <div className="relative select-none pointer-events-none rounded-[18px] overflow-hidden" style={{ border: "1px solid var(--line-2)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", background: "var(--ed-bg)" }}>
                {/* Before Image (underneath) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforeUrl}
                  alt="Original before edits"
                  className="max-h-[60vh] max-w-[80vw] object-contain block"
                  style={{ background: "var(--ed-bg)" }}
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
                      background: "var(--ed-bg)",
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
                  <div className="absolute w-7 h-7 rounded-full bg-white border border-[var(--line-2)] shadow-lg flex items-center justify-center text-[var(--ink)] text-[11px] font-bold select-none">
                    ‹›
                  </div>
                </div>

                {/* Split Badges */}
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Edited (After)
                </span>
                <span
                  className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "var(--surface-2)", backdropFilter: "blur(12px)", color: "var(--ink)", border: "1px solid var(--line-2)" }}
                >
                  Original (Before)
                </span>
              </div>
            ) : (
              /* Single View */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeUrl}
                alt="Image workspace canvas preview"
                className=""
                style={{
                  maxHeight: "60vh",
                  maxWidth: "80vw",
                  objectFit: "contain",
                  borderRadius: "18px",
                  border: "1px solid var(--line-2)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  background: "var(--ed-bg)",
                  display: "block",
                  pointerEvents: "none",
                }}
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
