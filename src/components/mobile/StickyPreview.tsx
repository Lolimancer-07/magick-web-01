"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, Columns, Eye } from "lucide-react";

interface StickyPreviewProps {
  previewUrl: string | null;
  originalUrl: string | null;
  isLoading?: boolean;
  onOpenZoom?: () => void;
  compareMode?: boolean;
  onToggleCompare?: () => void;
}

export default function StickyPreview({
  previewUrl,
  originalUrl,
  isLoading = false,
  onOpenZoom,
  compareMode = false,
  onToggleCompare,
}: StickyPreviewProps) {
  const [isHoldingOriginal, setIsHoldingOriginal] = useState(false);
  const [splitPos, setSplitPos] = useState(50); // 0 to 100%
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplit = useRef(false);

  // Touch hold handlers for "Hold to peek original"
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const startHold = useCallback(() => {
    holdTimer.current = setTimeout(() => {
      if (originalUrl) {
        setIsHoldingOriginal(true);
      }
    }, 150);
  }, [originalUrl]);

  const endHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setIsHoldingOriginal(false);
  }, []);

  // Split drag handler for compare mode
  const handleSplitMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPos(pct);
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingSplit.current && e.touches[0]) {
        handleSplitMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      isDraggingSplit.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingSplit.current) {
        handleSplitMove(e.clientX);
      }
    };
    const onMouseUp = () => {
      isDraggingSplit.current = false;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const displayUrl = isHoldingOriginal && originalUrl ? originalUrl : previewUrl || originalUrl;

  return (
    <div
      ref={containerRef}
      id="sticky-preview-container"
      style={{
        position: "sticky",
        top: "calc(var(--m-topbar-h, 56px) + var(--safe-top, 0px))",
        zIndex: 30,
        padding: "8px var(--m-pad, 16px) 12px",
        backgroundColor: "var(--bg, #0f1320)",
      }}
    >
      <div
        id="preview-frame"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(180px, 28vh, 340px)",
          borderRadius: "var(--m-radius-card, 24px)",
          backgroundColor: "#121626",
          backgroundImage:
            "linear-gradient(45deg, #181d33 25%, transparent 25%), linear-gradient(-45deg, #181d33 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #181d33 75%), linear-gradient(-45deg, transparent 75%, #181d33 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          border: "1px solid var(--line, rgba(255,255,255,0.08))",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {displayUrl ? (
          <>
            {/* Main or Peek Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
                transition: "opacity 0.15s ease",
              }}
            />

            {/* Split Compare Mode */}
            {compareMode && originalUrl && previewUrl && !isHoldingOriginal && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${splitPos}%`,
                    overflow: "hidden",
                    borderRight: "2px solid var(--green, #3fed1e)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalUrl}
                    alt="Original"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: containerRef.current ? `${containerRef.current.clientWidth - 32}px` : "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    BEFORE
                  </span>
                </div>

                {/* Split Handle */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    isDraggingSplit.current = true;
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    isDraggingSplit.current = true;
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${splitPos}%`,
                    transform: "translate(-50%, -50%)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--green, #3fed1e)",
                    color: "var(--green-ink, #07110a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                    cursor: "ew-resize",
                    zIndex: 10,
                  }}
                >
                  <Columns size={16} />
                </div>
              </>
            )}

            {/* Status pill: ORIGINAL if holding */}
            {isHoldingOriginal && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "var(--blue, #3089c5)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                ORIGINAL
              </div>
            )}
          </>
        ) : (
          <div style={{ color: "var(--muted, #8a93b8)", fontSize: "14px" }}>
            No image loaded
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15, 19, 32, 0.45)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: "var(--m-surface-3, #2a3252)",
                color: "var(--green, #3fed1e)",
                fontSize: "12px",
                fontWeight: 600,
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              Rendering...
            </div>
          </div>
        )}

        {/* Overlay Action Buttons at top-right of preview frame */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 20,
          }}
        >
          {onToggleCompare && originalUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              title="Compare with original"
              aria-label="Compare toggle"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: compareMode ? "var(--green, #3fed1e)" : "rgba(22, 27, 46, 0.8)",
                color: compareMode ? "var(--green-ink, #07110a)" : "var(--ink, #f2f4fb)",
                border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
              }}
            >
              <Columns size={16} />
            </button>
          )}

          {onOpenZoom && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom();
              }}
              title="Full-screen zoom view"
              aria-label="Zoom view"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "rgba(22, 27, 46, 0.8)",
                color: "var(--ink, #f2f4fb)",
                border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
              }}
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>

        {/* Tap and hold hint if originalUrl exists */}
        {originalUrl && !compareMode && !isHoldingOriginal && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "12px",
              padding: "4px 8px",
              borderRadius: "6px",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "rgba(255,255,255,0.75)",
              fontSize: "10px",
              fontWeight: 500,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Eye size={11} />
            <span>Hold for original</span>
          </div>
        )}
      </div>
    </div>
  );
}
