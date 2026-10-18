"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";

interface ZoomViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageName?: string;
  originalWidth?: number;
  originalHeight?: number;
}

export default function ZoomViewer({
  isOpen,
  onClose,
  imageUrl,
  imageName = "Preview",
  originalWidth,
  originalHeight,
}: ZoomViewerProps) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);

  // Reset transform when opened
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  const handleDoubleTap = () => {
    if (scale > 1.5) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      startPos.current = {
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y,
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      setTranslate({
        x: e.touches[0].clientX - startPos.current.x,
        y: e.touches[0].clientY - startPos.current.y,
      });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / lastTouchDist.current;
      setScale((s) => Math.max(0.5, Math.min(8, s * factor)));
      lastTouchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    lastTouchDist.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 7, 14, 0.96)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "calc(var(--safe-top, 0px) + 12px) 16px 12px",
          backgroundColor: "rgba(15, 19, 32, 0.7)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--line, rgba(255,255,255,0.08))",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink, #f2f4fb)" }}>
            {imageName}
          </span>
          {originalWidth && originalHeight && (
            <span style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
              {originalWidth} × {originalHeight} px · {Math.round(scale * 100)}%
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              setScale(1);
              setTranslate({ x: 0, y: 0 });
            }}
            title="Reset to 100%"
            style={actionBtnStyle}
          >
            <RefreshCcw size={18} />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.5))}
            title="Zoom Out"
            style={actionBtnStyle}
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(8, s + 0.5))}
            title="Zoom In"
            style={actionBtnStyle}
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{ ...actionBtnStyle, backgroundColor: "var(--m-surface-3, #2a3252)" }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          userSelect: "none",
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageName}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: isDragging.current ? "none" : "transform 0.1s ease-out",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  border: "none",
  color: "var(--ink, #f2f4fb)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
