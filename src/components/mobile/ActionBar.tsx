"use client";

import React from "react";
import { Share2, Eye, History, Undo2, Redo2, Plus, Download } from "lucide-react";

interface ActionBarProps {
  onShare?: () => void;
  onPreview?: () => void;
  onHistory?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddImage?: () => void;
  onSave: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
  saveLabel?: string;
}

export default function ActionBar({
  onShare,
  onPreview,
  onHistory,
  onUndo,
  onRedo,
  onAddImage,
  onSave,
  canUndo = false,
  canRedo = false,
  isSaving = false,
  saveLabel = "Save",
}: ActionBarProps) {
  return (
    <footer
      id="mobile-action-bar"
      role="toolbar"
      aria-label="Actions toolbar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(var(--m-action-bar-h, 72px) + var(--safe-bottom, 0px))",
        paddingBottom: "var(--safe-bottom, 0px)",
        paddingLeft: "var(--m-pad, 16px)",
        paddingRight: "var(--m-pad, 16px)",
        backgroundColor: "var(--m-surface-1, #1c233c)",
        borderTop: "1px solid var(--line, rgba(255,255,255,0.08))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "6px",
        zIndex: 45,
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.45)",
      }}
    >
      {/* Secondary & History icons group */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {onShare && (
          <button
            type="button"
            id="bar-btn-share"
            onClick={onShare}
            title="Share"
            aria-label="Share"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Share2 size={18} />
          </button>
        )}

        {onPreview && (
          <button
            type="button"
            id="bar-btn-preview"
            onClick={onPreview}
            title="View Fullscreen"
            aria-label="View Fullscreen"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Eye size={18} />
          </button>
        )}

        {onHistory && (
          <button
            type="button"
            id="bar-btn-history"
            onClick={onHistory}
            title="History Steps"
            aria-label="History Steps"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <History size={18} />
          </button>
        )}

        {onUndo && (
          <button
            type="button"
            id="bar-btn-undo"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            aria-label="Undo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              color: canUndo ? "var(--ink, #f2f4fb)" : "var(--dim, #4e5880)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canUndo ? "pointer" : "not-allowed",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Undo2 size={18} />
          </button>
        )}

        {onRedo && (
          <button
            type="button"
            id="bar-btn-redo"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            aria-label="Redo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              color: canRedo ? "var(--ink, #f2f4fb)" : "var(--dim, #4e5880)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canRedo ? "pointer" : "not-allowed",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Redo2 size={18} />
          </button>
        )}
      </div>

      {/* Primary & Tonal Actions: Add Image + Save Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {onAddImage && (
          <button
            type="button"
            id="bar-btn-add-image"
            onClick={onAddImage}
            title="Add image to batch"
            aria-label="Add image"
            style={{
              height: "48px",
              padding: "0 14px",
              borderRadius: "var(--m-radius-chip, 999px)",
              backgroundColor: "var(--m-surface-3, #2a3252)",
              border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        )}

        <button
          type="button"
          id="bar-btn-save"
          onClick={onSave}
          disabled={isSaving}
          aria-label={saveLabel}
          style={{
            height: "48px",
            padding: "0 24px",
            borderRadius: "var(--m-radius-chip, 999px)",
            backgroundColor: "var(--green, #3fed1e)",
            color: "var(--green-ink, #07110a)",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: isSaving ? "wait" : "pointer",
            boxShadow: "0 4px 16px var(--green-glow, rgba(63,237,30,0.3))",
            transition: "all 0.15s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <Download size={18} />
          <span>{isSaving ? "Saving..." : saveLabel}</span>
        </button>
      </div>
    </footer>
  );
}
