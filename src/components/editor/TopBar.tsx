"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Wand2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  SplitSquareVertical,
  Download,
  ImagePlus,
  HelpCircle,
  Menu,
  Search,
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

interface TopBarProps {
  onOpenExport: () => void;
  onOpenNew: () => void;
  onOpenCommandPalette?: () => void;
  onToggleLibrary?: () => void;
  onToggleInspector?: () => void;
  libraryOpen?: boolean;
  inspectorOpen?: boolean;
}

export default function TopBar({
  onOpenExport,
  onOpenNew,
  onOpenCommandPalette,
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

  const handleZoomIn = () => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.15, +(z - 0.25).toFixed(2)));
  const handleZoomFit = () => setZoom(1);

  return (
    <header
      style={{
        height: "var(--topbar-h)",
        padding: "0 14px",
        background: "var(--bg-nav)",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 30,
        position: "relative",
      }}
    >
      {/* ── Left Section ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
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
            title={libraryOpen ? "Hide Tool Library" : "Show Tool Library"}
            aria-label="Toggle Tool Library"
          >
            <Menu size={16} />
          </button>
        )}

        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: "var(--muted)",
            fontSize: "0.82rem",
            fontWeight: 500,
            textDecoration: "none",
            padding: "5px 8px",
            borderRadius: "6px",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--ink)";
            (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--muted)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
          title="Back to Landing Page"
        >
          <ArrowLeft size={14} />
          <span style={{ display: "none" }} className="topbar-desktop-label">Home</span>
        </Link>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #1b4052, #3089c5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Wand2 size={13} color="#f2f4fb" />
          </div>
          <span
            className="font-display"
            style={{
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Magick Studio
          </span>
        </div>

        {/* Divider */}
        {fileName && (
          <div
            style={{
              width: "1px",
              height: "16px",
              background: "var(--line)",
              margin: "0 4px",
            }}
          />
        )}

        {/* File name and dimensions badge */}
        {fileName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--ink)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "160px",
              }}
              title={fileName}
            >
              {fileName}
            </span>

            {originalDimensions && (
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--muted)",
                  background: "var(--surface-2)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                }}
              >
                {originalDimensions.w}×{originalDimensions.h}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Center Section: Command Palette & Tools ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Command Palette Button */}
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "8px",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              color: "var(--muted)",
              fontSize: "0.78rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--line-strong)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
              (e.currentTarget as HTMLElement).style.color = "var(--muted)";
            }}
            title="Search all tools (Ctrl+K)"
          >
            <Search size={13} />
            <span style={{ display: "none" }} className="topbar-desktop-label">Quick Search</span>
            <kbd
              style={{
                fontSize: "0.68rem",
                padding: "1px 5px",
                borderRadius: "3px",
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--line)",
                color: "var(--muted)",
              }}
            >
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Undo / Redo */}
        {fileName && (
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title={`Undo (${canUndo ? "Ctrl+Z" : "empty"})`}
              aria-label="Undo"
              style={{
                padding: "6px 8px",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                color: canUndo ? "var(--ink)" : "var(--dim)",
                cursor: canUndo ? "pointer" : "not-allowed",
              }}
            >
              <Undo2 size={15} />
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title={`Redo (${canRedo ? "Ctrl+Y" : "empty"})`}
              aria-label="Redo"
              style={{
                padding: "6px 8px",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                color: canRedo ? "var(--ink)" : "var(--dim)",
                cursor: canRedo ? "pointer" : "not-allowed",
              }}
            >
              <Redo2 size={15} />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        {fileName && (
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "2px",
              background: "var(--surface-2)",
              padding: "2px",
              borderRadius: "7px",
            }}
            className="topbar-desktop-tools"
          >
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
              style={{
                padding: "4px 6px",
                borderRadius: "5px",
                border: "none",
                background: "transparent",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              <ZoomOut size={13} />
            </button>
            <button
              type="button"
              onClick={handleZoomFit}
              title="Reset Zoom to 100%"
              aria-label="Reset Zoom"
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "none",
                background: "transparent",
                color: "var(--ink)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                cursor: "pointer",
                minWidth: "42px",
              }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              style={{
                padding: "4px 6px",
                borderRadius: "5px",
                border: "none",
                background: "transparent",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              <ZoomIn size={13} />
            </button>
          </div>
        )}

        {/* Compare Toggle */}
        {fileName && (
          <button
            type="button"
            onClick={() => setBeforeAfterMode(!beforeAfterMode)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 9px",
              borderRadius: "7px",
              border: `1px solid ${beforeAfterMode ? "var(--green)" : "var(--line)"}`,
              background: beforeAfterMode ? "rgba(63,237,30,.15)" : "transparent",
              color: beforeAfterMode ? "var(--green)" : "var(--muted)",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Toggle Split View Compare (C)"
            aria-label="Compare View"
          >
            <SplitSquareVertical size={13} />
            <span style={{ display: "none" }} className="topbar-desktop-label">Compare</span>
          </button>
        )}
      </div>

      {/* ── Right Section ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {fileName && (
          <>
            {/* New Image */}
            <button
              type="button"
              onClick={onOpenNew}
              title="Open New Image"
              aria-label="New Image"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "0.78rem",
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
              <ImagePlus size={13} />
              <span style={{ display: "none" }} className="topbar-desktop-label">New</span>
            </button>

            {/* Export Button (Single Green Primary Button) */}
            <button
              type="button"
              onClick={onOpenExport}
              title="Export Image (Ctrl+E)"
              aria-label="Export Image"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "10px",
                border: "none",
                background: "var(--green)",
                color: "var(--green-ink)",
                fontSize: "0.82rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 16px rgba(63,237,30,.35)",
                transition: "all .15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(63,237,30,.55)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(63,237,30,.35)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <Download size={14} />
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
            padding: "6px",
            borderRadius: "7px",
            border: "1px solid transparent",
            background: "transparent",
            color: "var(--dim)",
            cursor: "pointer",
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

      <style jsx>{`
        @media (min-width: 768px) {
          .topbar-desktop-label {
            display: inline !important;
          }
          .topbar-desktop-tools {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
