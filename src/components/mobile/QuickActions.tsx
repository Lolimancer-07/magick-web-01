"use client";

import React from "react";
import { RotateCcw, FlipHorizontal, RotateCw, FileCode } from "lucide-react";

interface QuickActionsProps {
  onRotateLeft: () => void;
  onFlip: () => void;
  onRotateRight: () => void;
  onEditExif?: () => void;
  disableExif?: boolean;
}

export default function QuickActions({
  onRotateLeft,
  onFlip,
  onRotateRight,
  onEditExif,
  disableExif = false,
}: QuickActionsProps) {
  return (
    <div
      id="quick-actions-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "0 var(--m-pad, 16px) 12px",
      }}
    >
      {/* Pill button: Edit EXIF */}
      {onEditExif && (
        <button
          id="btn-quick-edit-exif"
          onClick={onEditExif}
          disabled={disableExif}
          style={{
            flex: 1,
            height: "var(--m-tap, 48px)",
            borderRadius: "var(--m-radius-chip, 999px)",
            backgroundColor: "var(--m-surface-2, #222a46)",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            color: disableExif ? "var(--dim, #4e5880)" : "var(--ink, #f2f4fb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: disableExif ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <FileCode size={18} style={{ color: "var(--green, #3fed1e)" }} />
          <span>Edit EXIF</span>
        </button>
      )}

      {/* Round 48px quick action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          id="btn-quick-rotate-left"
          onClick={onRotateLeft}
          title="Rotate Left 90°"
          aria-label="Rotate Left 90 degrees"
          style={{
            width: "var(--m-tap, 48px)",
            height: "var(--m-tap, 48px)",
            borderRadius: "50%",
            backgroundColor: "var(--m-surface-2, #222a46)",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            color: "var(--ink, #f2f4fb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <RotateCcw size={19} />
        </button>

        <button
          id="btn-quick-flip"
          onClick={onFlip}
          title="Flip Horizontal"
          aria-label="Flip Horizontal"
          style={{
            width: "var(--m-tap, 48px)",
            height: "var(--m-tap, 48px)",
            borderRadius: "50%",
            backgroundColor: "var(--m-surface-2, #222a46)",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            color: "var(--ink, #f2f4fb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <FlipHorizontal size={19} />
        </button>

        <button
          id="btn-quick-rotate-right"
          onClick={onRotateRight}
          title="Rotate Right 90°"
          aria-label="Rotate Right 90 degrees"
          style={{
            width: "var(--m-tap, 48px)",
            height: "var(--m-tap, 48px)",
            borderRadius: "50%",
            backgroundColor: "var(--m-surface-2, #222a46)",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            color: "var(--ink, #f2f4fb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <RotateCw size={19} />
        </button>
      </div>
    </div>
  );
}
