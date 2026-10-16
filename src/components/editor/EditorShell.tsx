"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { engine } from "@/engine/engineClient";
import TopBar from "./TopBar";
import StatusBar from "./StatusBar";
import EmptyState from "./EmptyState";
import CanvasView from "./canvas/CanvasView";
import ToolLibrary from "./library/ToolLibrary";
import Inspector from "./inspector/Inspector";
import ExportDialog from "./export/ExportDialog";
import CommandPalette from "./CommandPalette";
import Toasts from "./feedback/Toasts";
import ShortcutSheet from "./feedback/ShortcutSheet";
import { Sparkles, Layers, Sliders, X } from "lucide-react";

const DEBOUNCE_MS_SLIDER = 50;
const DEBOUNCE_MS_ADD = 0;

export default function EditorShell() {
  const {
    steps,
    fileName,
    setFile,
    setBeforeUrl,
    setPreviewUrl,
    setPreviewLoading,
    setPreviewError,
    setRenderTimeMs,
    setZoom,
    setPan,
    setPeekOriginal,
    removeStep,
    selectedUid,
    undo,
    redo,
    reset,
    addToast,
  } = useEditorStore();

  const [hasImage, setHasImage] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Mobile bottom sheet state: null | 'tools' | 'edits' | 'info'
  const [mobileSheet, setMobileSheet] = useState<"tools" | "edits" | "info" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestRenderRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStepCountRef = useRef(0);
  const currentBlobUrlRef = useRef<string | null>(null);

  // Sync hasImage with fileName
  useEffect(() => {
    setHasImage(Boolean(fileName));
    if (fileName) {
      document.title = `${fileName} — Magick Studio`;
    } else {
      document.title = "Editor — Magick Studio";
    }
  }, [fileName]);

  // Unsaved-work guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (steps.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [steps.length]);

  // Trigger preview render pipeline when steps change
  const triggerRender = useCallback(() => {
    if (!hasImage) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const isStepAdded = steps.length !== prevStepCountRef.current;
    prevStepCountRef.current = steps.length;
    const delay = isStepAdded ? DEBOUNCE_MS_ADD : DEBOUNCE_MS_SLIDER;

    debounceRef.current = setTimeout(async () => {
      const renderId = ++latestRenderRef.current;
      setPreviewLoading(true);
      setPreviewError(null);

      const t0 = performance.now();
      try {
        const enabledSteps = steps.filter((s) => s.enabled);
        if (enabledSteps.length === 0) {
          if (currentBlobUrlRef.current) {
            URL.revokeObjectURL(currentBlobUrlRef.current);
            currentBlobUrlRef.current = null;
          }
          setPreviewUrl(null);
          setPreviewLoading(false);
          setRenderTimeMs(0);
          return;
        }

        const res = await engine.render(steps, { preview: true });
        if (renderId !== latestRenderRef.current) return;

        if (currentBlobUrlRef.current) {
          URL.revokeObjectURL(currentBlobUrlRef.current);
        }
        const blob = new Blob([res.bytes], { type: res.mime });
        const newUrl = URL.createObjectURL(blob);
        currentBlobUrlRef.current = newUrl;
        setPreviewUrl(newUrl);
        setRenderTimeMs(Math.round(performance.now() - t0));
      } catch (err: unknown) {
        if (renderId !== latestRenderRef.current) return;
        const msg = err instanceof Error ? err.message : String(err);
        setPreviewError(msg);
      } finally {
        if (renderId === latestRenderRef.current) {
          setPreviewLoading(false);
        }
      }
    }, delay);
  }, [hasImage, steps, setPreviewLoading, setPreviewError, setPreviewUrl, setRenderTimeMs]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Handle opening a new image
  const handleOpenNew = () => {
    if (steps.length > 0) {
      const confirmed = window.confirm(
        "Open a new image? Current unsaved edits will be discarded."
      );
      if (!confirmed) return;
    }
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      reset();
      const originalUrl = URL.createObjectURL(file);
      setBeforeUrl(originalUrl);
      setPreviewUrl(null);

      const { width, height } = await engine.load(file);
      setFile(file.name, { w: width, h: height });
      addToast(`Opened ${file.name}`, "success");
    } catch (err: unknown) {
      console.error("Failed to load file:", err);
      addToast("Failed to load image", "error");
    } finally {
      e.target.value = "";
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      // Command palette: Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Export: Ctrl+E / Cmd+E
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (hasImage) setShowExport(true);
        return;
      }

      // Delete selected step: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedUid) {
        e.preventDefault();
        removeStep(selectedUid);
        return;
      }

      // Reset Zoom: 0
      if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
        setPan({ x: 0, y: 0 });
        return;
      }

      // Spacebar hold peek original
      if (e.key === " " && !e.repeat && hasImage) {
        e.preventDefault();
        setPeekOriginal(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setPeekOriginal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    undo,
    redo,
    selectedUid,
    removeStep,
    setZoom,
    setPan,
    setPeekOriginal,
    hasImage,
  ]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      {/* Hidden file input for "New Image" */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />

      {/* ── 1. Top Bar ── */}
      <TopBar
        onOpenExport={() => setShowExport(true)}
        onOpenNew={handleOpenNew}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleLibrary={() => setLibraryOpen((v) => !v)}
        onToggleInspector={() => setInspectorOpen((v) => !v)}
        libraryOpen={libraryOpen}
        inspectorOpen={inspectorOpen}
      />

      {/* ── 2. Main Middle Workspace ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {!hasImage ? (
          <EmptyState onImageLoaded={() => triggerRender()} />
        ) : (
          <>
            {/* Desktop Left: Tool Library (260px) */}
            <aside
              className="desktop-panel"
              style={{
                width: "280px",
                flexShrink: 0,
                height: "100%",
                backgroundColor: "var(--surface)",
                borderRight: "1px solid var(--line)",
                display: libraryOpen ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <ToolLibrary />
            </aside>

            {/* Center: Canvas View Area */}
            <main
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                minWidth: 0,
                backgroundColor: "var(--bg)",
              }}
            >
              <CanvasView />
            </main>

            {/* Desktop Right: Inspector (300px) */}
            <aside
              className="desktop-panel"
              style={{
                width: "320px",
                flexShrink: 0,
                height: "100%",
                backgroundColor: "var(--surface)",
                borderLeft: "1px solid var(--line)",
                display: inspectorOpen ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Inspector />
            </aside>
          </>
        )}
      </div>

      {/* ── 3. Bottom Status Bar ── */}
      {hasImage && <StatusBar />}

      {/* ── Mobile Floating Action Bar ── */}
      {hasImage && (
        <div
          className="mobile-only-bar"
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
            display: "none",
            gap: "8px",
            background: "var(--bg-nav)",
            border: "1px solid var(--line-strong)",
            borderRadius: "9999px",
            padding: "4px 8px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          <button
            type="button"
            onClick={() => setMobileSheet("tools")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              border: "none",
              background: mobileSheet === "tools" ? "var(--surface-2)" : "transparent",
              color: "var(--ink)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Sparkles size={14} color="var(--green)" />
            Tools
          </button>

          <button
            type="button"
            onClick={() => setMobileSheet("edits")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              border: "none",
              background: mobileSheet === "edits" ? "var(--surface-2)" : "transparent",
              color: "var(--ink)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Layers size={14} color="#70b8f0" />
            Pipeline ({steps.length})
          </button>
        </div>
      )}

      {/* ── Mobile Bottom Sheet Drawer ── */}
      {mobileSheet && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSheet(null);
          }}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              borderTop: "1px solid var(--line-strong)",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {mobileSheet === "tools" ? "Tool Library" : "Pipeline Inspector"}
              </span>
              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {mobileSheet === "tools" ? (
                <ToolLibrary onSelectOp={() => setMobileSheet("edits")} />
              ) : (
                <Inspector />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modals & Feedback ── */}
      <ExportDialog isOpen={showExport} onClose={() => setShowExport(false)} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <ShortcutSheet />
      <Toasts />

      <style jsx>{`
        @media (max-width: 900px) {
          .desktop-panel {
            display: none !important;
          }
          .mobile-only-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
