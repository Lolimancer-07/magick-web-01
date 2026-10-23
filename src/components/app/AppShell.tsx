"use client";

import { useEffect, useRef, useCallback, Suspense } from "react";
import {
  Sparkles,
  Layers,
  Sliders,
  Download,
  Search,
  X,
} from "lucide-react";

import { useAppStore, selectHasImage } from "@/store/appStore";
import { useLayoutMode } from "@/hooks/useLayoutMode";

// Editor sub-components
import TopBar from "@/components/editor/TopBar";
import StatusBar from "@/components/editor/StatusBar";
import CanvasView from "@/components/editor/canvas/CanvasView";
import ToolLibrary from "@/components/editor/library/ToolLibrary";
import Inspector from "@/components/editor/inspector/Inspector";
import ExportDialog from "@/components/editor/export/ExportDialog";
import CommandPalette from "@/components/editor/CommandPalette";
import ShortcutSheet from "@/components/editor/feedback/ShortcutSheet";
import Toasts from "@/components/editor/feedback/Toasts";
import UnifiedEmptyState from "@/components/app/UnifiedEmptyState";

// ─── Bottom sheet snap heights ────────────────────────────────────────────────

const SHEET_PEEK   = "30vh";
const SHEET_HALF   = "55vh";
const SHEET_FULL   = "92dvh";

// ─── Dock tab config ─────────────────────────────────────────────────────────

const DOCK_TABS = [
  { id: "tools",  label: "Tools",  Icon: Sparkles },
  { id: "edits",  label: "Edits",  Icon: Layers   },
  { id: "adjust", label: "Adjust", Icon: Sliders  },
  { id: "export", label: "Export", Icon: Download  },
] as const;

type DockTab = (typeof DOCK_TABS)[number]["id"];

// ─── AppShell ────────────────────────────────────────────────────────────────

export default function AppShell() {
  const mode = useLayoutMode();

  const {
    fileName, currentImage,
    mobileSheet, setMobileSheet,
    showExport, setShowExport,
    commandPaletteOpen, setCommandPaletteOpen,
    libraryOpen, setLibraryOpen,
    inspectorOpen, setInspectorOpen,
    undo, redo,
    selectedUid, removeStep,
    setZoom, setPan, setPeekOriginal,
    steps,
    reset,
    addToast,
  } = useAppStore();

  const hasImage = selectHasImage(useAppStore.getState());
  // Re-render on image state changes
  const _fileName = useAppStore((s) => s.fileName);
  const _currentImage = useAppStore((s) => s.currentImage);
  const _hasImage = _fileName !== null || _currentImage !== null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handle "Open new image" from top bar ──────────────────────────────────
  const handleOpenNew = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Handled by UnifiedEmptyState / Dropzone logic — pass to global handler
      window.dispatchEvent(new CustomEvent("magick:open-file", { detail: { file } }));
      e.target.value = "";
    },
    []
  );

  // ── Keyboard shortcuts (desktop) ─────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault(); undo();
      }
      if ((e.key === "y" && (e.ctrlKey || e.metaKey)) ||
          (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
        e.preventDefault(); redo();
      }
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); setCommandPaletteOpen(true);
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedUid) { removeStep(selectedUid); }
      }
      if (e.key === "0" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); setZoom(1); setPan({ x: 0, y: 0 });
      }
      if (e.key === " ") { e.preventDefault(); setPeekOriginal(true); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") setPeekOriginal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [undo, redo, selectedUid, removeStep, setZoom, setPan,
      setPeekOriginal, setCommandPaletteOpen]);

  // ── System back closes topmost sheet ─────────────────────────────────────
  useEffect(() => {
    const onPop = () => {
      if (mobileSheet) { setMobileSheet(null); history.pushState(null, "", ""); }
      else if (showExport) { setShowExport(false); history.pushState(null, "", ""); }
    };
    if (mobileSheet || showExport) {
      history.pushState(null, "", "");
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [mobileSheet, showExport, setMobileSheet, setShowExport]);

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!_hasImage) {
    // ── Empty state: unified file-open experience ─────────────────────────
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <UnifiedEmptyState />
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
        <Toasts />
      </>
    );
  }

  // ── Wide layout (≥1024) ──────────────────────────────────────────────────
  if (mode === "wide") {
    return (
      <div style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
      }}>
        <input ref={fileInputRef} type="file" accept="image/*"
          style={{ display: "none" }} onChange={handleFileInputChange} />

        <TopBar
          onOpenExport={() => setShowExport(true)}
          onOpenNew={handleOpenNew}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleLibrary={() => setLibraryOpen(!libraryOpen)}
          onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
          libraryOpen={libraryOpen}
          inspectorOpen={inspectorOpen}
        />

        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          {/* Left: Tool Library */}
          {libraryOpen && (
            <aside style={{
              width: "280px", flexShrink: 0,
              backgroundColor: "var(--surface)",
              borderRight: "1px solid var(--line)",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}>
              <ToolLibrary />
            </aside>
          )}

          {/* Center: Canvas */}
          <main style={{
            flex: 1, display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
            minWidth: 0, backgroundColor: "var(--bg)",
          }}>
            <CanvasView />
          </main>

          {/* Right: Inspector */}
          {inspectorOpen && (
            <aside style={{
              width: "320px", flexShrink: 0,
              backgroundColor: "var(--surface)",
              borderLeft: "1px solid var(--line)",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}>
              <Inspector />
            </aside>
          )}
        </div>

        <StatusBar />

        <ExportDialog isOpen={showExport} onClose={() => setShowExport(false)} />
        <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        <ShortcutSheet />
        <Toasts />
      </div>
    );
  }

  // ── Medium layout (768-1023) ─────────────────────────────────────────────
  if (mode === "medium") {
    return (
      <div style={{
        width: "100vw", height: "100dvh",
        display: "flex", flexDirection: "column",
        overflow: "hidden", backgroundColor: "var(--bg)", color: "var(--ink)",
      }}>
        <input ref={fileInputRef} type="file" accept="image/*"
          style={{ display: "none" }} onChange={handleFileInputChange} />

        <TopBar
          onOpenExport={() => setShowExport(true)}
          onOpenNew={handleOpenNew}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleLibrary={() => setLibraryOpen(!libraryOpen)}
          onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
          libraryOpen={libraryOpen}
          inspectorOpen={inspectorOpen}
        />

        <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <CanvasView />

          {/* Library drawer overlay (left) */}
          {libraryOpen && (
            <DrawerOverlay side="left" onClose={() => setLibraryOpen(false)}>
              <ToolLibrary onSelectOp={() => setLibraryOpen(false)} />
            </DrawerOverlay>
          )}

          {/* Inspector drawer overlay (right) */}
          {inspectorOpen && (
            <DrawerOverlay side="right" onClose={() => setInspectorOpen(false)}>
              <Inspector />
            </DrawerOverlay>
          )}
        </main>

        <ExportDialog isOpen={showExport} onClose={() => setShowExport(false)} />
        <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        <ShortcutSheet />
        <Toasts />
      </div>
    );
  }

  // ── Compact layout (phones, <768) ────────────────────────────────────────
  return (
    <div style={{
      width: "100vw",
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "var(--bg)",
      color: "var(--ink)",
      // Safe area
      paddingTop: "env(safe-area-inset-top)",
    }}>
      <input ref={fileInputRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={handleFileInputChange} />

      {/* ── Compact Top Bar (56px) ── */}
      <CompactTopBar
        onOpenNew={handleOpenNew}
        onOpenExport={() => setMobileSheet("export")}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onUndo={undo}
        onRedo={redo}
      />

      {/* ── Canvas area (35-50% height, sticky) ── */}
      <div style={{
        flex: "0 0 auto",
        height: "clamp(200px, 42dvh, 380px)",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--bg)",
      }}>
        <CanvasView compact />
      </div>

      {/* ── Spacer that fills remaining space (sheet sits over it) ── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {/* Sheet content is absolute-positioned */}
      </div>

      {/* ── Bottom Sheet ── */}
      {mobileSheet && (
        <CompactBottomSheet
          sheetId={mobileSheet}
          onClose={() => setMobileSheet(null)}
          onSelectTool={() => setMobileSheet("edits")}
        />
      )}

      {/* ── Dock (64px + safe area) ── */}
      <CompactDock
        active={mobileSheet}
        onSelect={(tab: DockTab) =>
          setMobileSheet(mobileSheet === tab ? null : tab)
        }
      />

      <ExportDialog isOpen={showExport} onClose={() => setShowExport(false)} />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <Toasts />
    </div>
  );
}

// ─── DrawerOverlay (medium layout) ───────────────────────────────────────────

function DrawerOverlay({
  side, onClose, children,
}: {
  side: "left" | "right";
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: side === "left" ? "flex-start" : "flex-end",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "min(320px, 85vw)",
          height: "100%",
          backgroundColor: "var(--surface)",
          borderRight: side === "left" ? "1px solid var(--line)" : "none",
          borderLeft: side === "right" ? "1px solid var(--line)" : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: side === "left"
            ? "4px 0 24px rgba(0,0,0,0.4)"
            : "-4px 0 24px rgba(0,0,0,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── CompactTopBar ───────────────────────────────────────────────────────────

function CompactTopBar({
  onOpenNew,
  onOpenExport,
  onOpenSearch,
  onUndo,
  onRedo,
}: {
  onOpenNew: () => void;
  onOpenExport: () => void;
  onOpenSearch: () => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const { fileName, past, future } = useAppStore();
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return (
    <header
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "12px",
        paddingRight: "12px",
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--line)",
        flexShrink: 0,
        gap: "8px",
        minWidth: 0,
      }}
    >
      {/* File name */}
      <span
        style={{
          flex: 1,
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "var(--ink)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {fileName ?? "Untitled"}
      </span>

      {/* Right actions */}
      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        <IconBtn aria-label="Search tools" onClick={onOpenSearch} title="Search (Ctrl+K)">
          <Search size={18} />
        </IconBtn>
        <IconBtn aria-label="Undo" onClick={onUndo} disabled={!canUndo} title="Undo">
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>↩</span>
        </IconBtn>
        <IconBtn aria-label="Redo" onClick={onRedo} disabled={!canRedo} title="Redo">
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>↪</span>
        </IconBtn>
        <button
          type="button"
          onClick={onOpenExport}
          aria-label="Export image"
          style={{
            height: "40px",
            paddingLeft: "14px",
            paddingRight: "14px",
            borderRadius: "10px",
            border: "none",
            background: "var(--green)",
            color: "var(--green-ink, #000)",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            minWidth: 0,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Export
        </button>
      </div>
    </header>
  );
}

// ─── CompactDock ─────────────────────────────────────────────────────────────

function CompactDock({
  active,
  onSelect,
}: {
  active: DockTab | null;
  onSelect: (tab: DockTab) => void;
}) {
  return (
    <nav
      style={{
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--line)",
        flexShrink: 0,
      }}
      aria-label="App navigation"
    >
      {DOCK_TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => onSelect(id)}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              border: "none",
              background: "transparent",
              color: isActive ? "var(--green)" : "var(--muted)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              // 48×48 minimum touch target
              minWidth: "48px",
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: "0.67rem", fontWeight: 600 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── CompactBottomSheet ──────────────────────────────────────────────────────

function CompactBottomSheet({
  sheetId,
  onClose,
  onSelectTool,
}: {
  sheetId: DockTab;
  onClose: () => void;
  onSelectTool: () => void;
}) {
  const LABELS: Record<DockTab, string> = {
    tools: "Tool Library",
    edits: "Edits & Pipeline",
    adjust: "Adjust",
    export: "Export",
  };

  return (
    <>
      {/* Scrim */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label={LABELS[sheetId]}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "var(--surface)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          borderTop: "1px solid var(--line-strong)",
          maxHeight: SHEET_FULL,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            paddingBottom: "4px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "4px",
              borderRadius: "9999px",
              backgroundColor: "var(--line-strong)",
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px 12px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {LABELS[sheetId]}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: "32px", height: "32px",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--surface-2)",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}>
          {sheetId === "tools" && (
            <ToolLibrary onSelectOp={onSelectTool} compact />
          )}
          {sheetId === "edits" && <Inspector />}
          {sheetId === "adjust" && <Inspector />}
          {sheetId === "export" && (
            <ExportSheetContent onClose={onClose} />
          )}
        </div>
      </div>
    </>
  );
}

// ─── ExportSheetContent (inline in compact mode) ──────────────────────────────

function ExportSheetContent({ onClose }: { onClose: () => void }) {
  const setShowExport = useAppStore((s) => s.setShowExport);
  return (
    <div style={{ padding: "16px" }}>
      <button
        type="button"
        onClick={() => { onClose(); setShowExport(true); }}
        style={{
          width: "100%",
          height: "52px",
          borderRadius: "14px",
          border: "none",
          background: "var(--green)",
          color: "var(--green-ink, #000)",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        Open Export Options
      </button>
    </div>
  );
}

// ─── IconBtn helper ───────────────────────────────────────────────────────────

function IconBtn({
  children,
  onClick,
  disabled,
  title,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        border: "1px solid var(--line)",
        background: "var(--surface-2)",
        color: disabled ? "var(--dim)" : "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        WebkitTapHighlightColor: "transparent",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
