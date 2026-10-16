"use client";

import Link from "next/link";
import { ArrowLeft, Wand2, Undo2, Redo2, ZoomIn, ZoomOut, SplitSquareVertical, Download, ImagePlus, HelpCircle, Menu } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

interface TopBarProps {
  onOpenExport: () => void;
  onOpenNew: () => void;
  onToggleLibrary?: () => void;
  onToggleInspector?: () => void;
  libraryOpen?: boolean;
  inspectorOpen?: boolean;
}

export default function TopBar({
  onOpenExport,
  onOpenNew,
  onToggleLibrary,
  libraryOpen,
}: TopBarProps) {
  const {
    fileName,
    originalDimensions,
    past,
    future,
    undo,
    redo,
    beforeAfterMode,
    setBeforeAfterMode,
    zoom,
    setZoom,
    setShortcutSheetOpen,
  } = useEditorStore();

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const handleZoomIn  = () => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.15, +(z - 0.25).toFixed(2)));
  const handleZoomFit = () => setZoom(1);

  return (
    <header
      style={{
        height: "var(--topbar-h)",
        padding: "0 10px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 30,
        position: "relative",
        boxShadow: "0 2px 12px rgba(0,0,0,.4)",
      }}
    >
      {/* ── Left Section ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
        {/* Toggle Library */}
        {onToggleLibrary && (
          <button
            type="button"
            onClick={onToggleLibrary}
            style={{
              padding: "7px",
              borderRadius: "8px",
              border: `1px solid ${libraryOpen ? "var(--line-2)" : "transparent"}`,
              background: libraryOpen ? "var(--surface-2)" : "transparent",
              color: "var(--muted)",
              cursor: "pointer",
              transition: "all .15s",
              display: "none",
            }}
            className="sm-flex xl-none"
            title="Toggle Tool Library"
            aria-label="Toggle tool library"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              if (!libraryOpen) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
              }
            }}
          >
            <Menu size={16} />
          </button>
        )}

        {/* Back home */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid transparent",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--muted)",
            transition: "all .15s",
          }}
          title="Home"
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--surface-2)";
            el.style.color = "var(--ink)";
            el.style.borderColor = "var(--line)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "var(--muted)";
            el.style.borderColor = "transparent";
          }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span style={{ display: "none" }} className="md-inline">Home</span>
        </Link>

        <div style={{ width: "1px", height: "16px", background: "var(--line)", flexShrink: 0 }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(63,237,30,.15)",
              border: "1px solid rgba(63,237,30,.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green)",
            }}
          >
            <Wand2 size={14} aria-hidden="true" />
          </div>
          <span
            className="font-display"
            style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--ink)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
          >
            Magick<span style={{ color: "var(--green)" }}>Studio</span>
          </span>
        </div>

        {/* File Meta */}
        {fileName && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "10px", borderLeft: "1px solid var(--line)", minWidth: 0 }}>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "6px",
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--muted)",
                maxWidth: "160px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={fileName}
            >
              {fileName}
            </span>
            {originalDimensions && (
              <span
                style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--dim)", whiteSpace: "nowrap" }}
              >
                {originalDimensions.w}×{originalDimensions.h}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Right Section ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {fileName && (
          <>
            {/* Undo / Redo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "2px",
                gap: "1px",
              }}
            >
              {[
                { onClick: undo, disabled: !canUndo, icon: Undo2, label: "Undo (Ctrl+Z)", title: "Undo" },
                { onClick: redo, disabled: !canRedo, icon: Redo2, label: "Redo (Ctrl+Y)", title: "Redo" },
              ].map((btn) => (
                <button
                  key={btn.title}
                  type="button"
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  title={btn.label}
                  aria-label={btn.title}
                  style={{
                    padding: "5px 6px",
                    borderRadius: "6px",
                    border: "none",
                    background: "transparent",
                    color: btn.disabled ? "var(--dim)" : "var(--muted)",
                    cursor: btn.disabled ? "not-allowed" : "pointer",
                    transition: "all .15s",
                    opacity: btn.disabled ? 0.35 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!btn.disabled) (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                  }}
                  onMouseLeave={(e) => {
                    if (!btn.disabled) (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                  }}
                >
                  <btn.icon size={13} />
                </button>
              ))}
            </div>

            {/* Compare toggle */}
            <button
              type="button"
              onClick={() => setBeforeAfterMode(!beforeAfterMode)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: `1px solid ${beforeAfterMode ? "rgba(63,237,30,.35)" : "var(--line)"}`,
                background: beforeAfterMode ? "rgba(63,237,30,.12)" : "var(--surface-2)",
                color: beforeAfterMode ? "var(--green)" : "var(--muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .15s",
                whiteSpace: "nowrap",
              }}
              title="Compare before/after (Hold \\ to peek)"
              aria-label="Toggle before and after split view"
            >
              <SplitSquareVertical size={13} aria-hidden="true" />
              <span style={{ display: "none" }}>Compare</span>
            </button>

            {/* Zoom */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "2px",
              }}
            >
              {[
                { onClick: handleZoomOut, icon: ZoomOut, label: "Zoom Out" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.onClick}
                  title={btn.label}
                  aria-label={btn.label}
                  style={{
                    padding: "5px 6px",
                    borderRadius: "6px",
                    border: "none",
                    background: "transparent",
                    color: "var(--muted)",
                    cursor: "pointer",
                    transition: "color .15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
                >
                  <btn.icon size={12} />
                </button>
              ))}
              <button
                type="button"
                onClick={handleZoomFit}
                title="Fit to view (0)"
                style={{
                  padding: "3px 6px",
                  border: "none",
                  background: "transparent",
                  color: "var(--muted)",
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "color .15s",
                  minWidth: "36px",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                aria-label="Zoom in"
                style={{
                  padding: "5px 6px",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  color: "var(--muted)",
                  cursor: "pointer",
                  transition: "color .15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
              >
                <ZoomIn size={12} />
              </button>
            </div>

            <div style={{ width: "1px", height: "16px", background: "var(--line)", flexShrink: 0 }} />

            {/* New Image */}
            <button
              type="button"
              onClick={onOpenNew}
              title="Open Image (O)"
              aria-label="Open New Image"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "var(--surface-2)",
                color: "var(--muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--line-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
              }}
            >
              <ImagePlus size={13} aria-hidden="true" />
              <span style={{ display: "none" }}>New</span>
            </button>

            {/* Export (primary green) */}
            <button
              type="button"
              onClick={onOpenExport}
              title="Export Full Image (E)"
              aria-label="Export Image"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "9px",
                border: "none",
                background: "var(--green)",
                color: "var(--green-ink)",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 14px rgba(63,237,30,.3)",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 22px rgba(63,237,30,.5)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 14px rgba(63,237,30,.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <Download size={13} aria-hidden="true" />
              Export
            </button>
          </>
        )}

        {/* Help */}
        <button
          type="button"
          onClick={() => setShortcutSheetOpen(true)}
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
          style={{
            padding: "7px",
            borderRadius: "8px",
            border: "1px solid transparent",
            background: "transparent",
            color: "var(--dim)",
            cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
            (e.currentTarget as HTMLElement).style.color = "var(--muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--dim)";
          }}
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
}
