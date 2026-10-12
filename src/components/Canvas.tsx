"use client";

import { useState, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";

interface CanvasProps {
  onZoomChange?: (z: number) => void;
}

export default function Canvas({ onZoomChange }: CanvasProps) {
  const { previewUrl, beforeUrl, beforeAfterMode, previewLoading, previewError } =
    useEditorStore();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, zoom * delta));
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isDraggingSlider) return;
    if (e.button === 1 || (e.button === 0 && (e.altKey || e.shiftKey))) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
      e.preventDefault();
    }
  }, [isDraggingSlider, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: panStart.current.px + (e.clientX - panStart.current.x),
        y: panStart.current.py + (e.clientY - panStart.current.y),
      });
    }
    if (isDraggingSlider && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setSliderPos(pct);
    }
  }, [isPanning, isDraggingSlider]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDraggingSlider(false);
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onZoomChange?.(1);
  };

  const displayUrl = previewUrl || beforeUrl;

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Empty state */}
      {!displayUrl && !previewLoading && (
        <div className="canvas-empty">
          <div className="canvas-empty-icon">🖼️</div>
          <p>Upload an image to get started</p>
        </div>
      )}

      {/* Loading state when no image yet */}
      {!displayUrl && previewLoading && (
        <div className="canvas-loading">
          <div className="spinner" />
          <p>Processing…</p>
        </div>
      )}

      {/* Error state */}
      {previewError && (
        <div className="canvas-error">
          <span>⚠️</span>
          <p>{previewError}</p>
        </div>
      )}

      {/* Image display */}
      {displayUrl && (
        <div
          className="canvas-image-wrapper"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center",
          }}
        >
          {beforeAfterMode && beforeUrl && previewUrl ? (
            /* Before/After slider with pixel-perfect clip-path */
            <div className="before-after" style={{ position: "relative", display: "inline-block" }}>
              {/* After (edited) image */}
              <img src={previewUrl} alt="After" className="canvas-img" draggable={false} />

              {/* Before (original) clipped overlay */}
              <img
                src={beforeUrl}
                alt="Before"
                className="canvas-img"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  pointerEvents: "none",
                }}
                draggable={false}
              />

              {/* Slider line */}
              <div
                className="slider-line"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDraggingSlider(true);
                }}
              >
                <div className="slider-handle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <span className="ba-label ba-label-before">Before</span>
              <span className="ba-label ba-label-after">After</span>
            </div>
          ) : (
            <img
              src={displayUrl}
              alt="Preview"
              className="canvas-img"
              draggable={false}
            />
          )}
        </div>
      )}

      {/* Smooth updating badge without flicker */}
      {displayUrl && previewLoading && (
        <div className="canvas-updating-badge">
          <div className="spinner-sm" />
          <span>Updating…</span>
        </div>
      )}

      {/* Controls */}
      {displayUrl && (
        <div className="canvas-controls">
          <button className="ctrl-btn" onClick={() => { setZoom(z => Math.min(10, z * 1.2)); }}>+</button>
          <button className="ctrl-btn" onClick={resetView} title="Reset view">
            {Math.round(zoom * 100)}%
          </button>
          <button className="ctrl-btn" onClick={() => { setZoom(z => Math.max(0.1, z * 0.8)); }}>−</button>
        </div>
      )}

      <div className="canvas-hint">Alt + drag to pan • Scroll to zoom</div>
    </div>
  );
}
