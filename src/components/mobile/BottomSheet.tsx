"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  snapPoints?: number[]; // e.g. [40, 60, 92]
  defaultSnap?: number;
  children: React.ReactNode;
}

export default function BottomSheet({
  id = "mobile-bottom-sheet",
  isOpen,
  onClose,
  title,
  snapPoints = [40, 60, 92],
  defaultSnap = 60,
  children,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(defaultSnap);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  // Sync snap on open
  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(defaultSnap);
    }
  }, [isOpen, defaultSnap]);

  // Support hardware/system back button via history state
  useEffect(() => {
    if (!isOpen) return;

    // Push a dummy state so back gesture pops it and closes the sheet
    window.history.pushState({ bottomSheet: true }, "");

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaY = e.changedTouches[0].clientY - dragStartY.current;

    if (deltaY > 100) {
      // Swiped down significantly: snap down or close
      const lowerSnaps = snapPoints.filter((s) => s < currentSnap);
      if (lowerSnaps.length === 0 || deltaY > 200) {
        onClose();
      } else {
        setCurrentSnap(lowerSnaps[lowerSnaps.length - 1]);
      }
    } else if (deltaY < -60) {
      // Swiped up: snap to next higher snap point
      const higherSnaps = snapPoints.filter((s) => s > currentSnap);
      if (higherSnaps.length > 0) {
        setCurrentSnap(higherSnaps[0]);
      }
    }
  };

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(7, 10, 20, 0.75)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease-out forwards",
        }}
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        style={{
          position: "relative",
          width: "100%",
          maxHeight: `${currentSnap}vh`,
          height: `${currentSnap}vh`,
          backgroundColor: "var(--m-surface-1, #1c233c)",
          borderTopLeftRadius: "var(--m-radius-card, 24px)",
          borderTopRightRadius: "var(--m-radius-card, 24px)",
          border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
          zIndex: 1,
          transition: isDragging.current ? "none" : "height 0.24s cubic-bezier(0.2, 0, 0, 1)",
          overflow: "hidden",
        }}
      >
        {/* Drag Handle Bar */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            padding: "12px 16px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "var(--muted, #8a93b8)",
              opacity: 0.6,
              marginBottom: "8px",
            }}
          />

          {title && (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink, #f2f4fb)" }}>
                {title}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "none",
                  border: "none",
                  color: "var(--muted, #8a93b8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 16px calc(16px + var(--safe-bottom, 0px))",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
