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

  // Unsaved-work guard (Phase 8)
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

    const stepCountChanged = steps.length !== prevStepCountRef.current;
    prevStepCountRef.current = steps.length;
    const delay = stepCountChanged ? DEBOUNCE_MS_ADD : DEBOUNCE_MS_SLIDER;

    debounceRef.current = setTimeout(async () => {
      const renderId = ++latestRenderRef.current;
      setPreviewLoading(true);
      setPreviewError(null);
      const startTime = performance.now();

      try {
        const result = await engine.render(steps, { preview: true });
        if (renderId !== latestRenderRef.current) return;

        const elapsed = Math.round(performance.now() - startTime);
        setRenderTimeMs(elapsed);

        if (currentBlobUrlRef.current && currentBlobUrlRef.current.startsWith("blob:")) {
          URL.revokeObjectURL(currentBlobUrlRef.current);
        }

        const blob = new Blob([result.bytes], { type: result.mime });
        const url = URL.createObjectURL(blob);
        currentBlobUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (errMsg === "cancelled") {
          if (renderId === latestRenderRef.current) setPreviewLoading(false);
          return;
        }
        if (renderId !== latestRenderRef.current) return;
        setPreviewError(errMsg || "Render failed");
      } finally {
        if (renderId === latestRenderRef.current) setPreviewLoading(false);
      }
    }, delay);
  }, [hasImage, steps, setPreviewUrl, setPreviewLoading, setPreviewError, setRenderTimeMs]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Global Keyboard Shortcuts (Phase 6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT";
      if (isInput) return;

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Peek original: Hold '\' key
      if (e.key === "\\") {
        setPeekOriginal(true);
        return;
      }

      // Fit: '0'
      if (e.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        return;
      }

      // 100%: '1'
      if (e.key === "1") {
        setZoom(1);
        return;
      }

      // Zoom + / -
      if (e.key === "=" || e.key === "+") {
        setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)));
        return;
      }
      if (e.key === "-") {
        setZoom((z) => Math.max(0.15, +(z - 0.25).toFixed(2)));
        return;
      }

      // Delete selected step
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedUid) {
          removeStep(selectedUid);
          addToast("Removed step", "info");
        }
        return;
      }

      // Open new image: 'O'
      if (e.key.toLowerCase() === "o" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        fileInputRef.current?.click();
        return;
      }

      // Export: 'E'
      if (e.key.toLowerCase() === "e" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (hasImage) setShowExport(true);
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "\\") {
        setPeekOriginal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [undo, redo, setPeekOriginal, setZoom, setPan, selectedUid, removeStep, addToast, hasImage]);

  // Handle direct file input change (for "New Image" / 'O' shortcut)
  const handleNativeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const originalUrl = URL.createObjectURL(file);
      setBeforeUrl(originalUrl);
      setPreviewUrl(null);
      const { width, height } = await engine.load(file);
      setFile(file.name, { w: width, h: height }, { size: file.size, type: file.type });
      setHasImage(true);
      addToast(`Opened ${file.name}`, "success");
    } catch (err: unknown) {
      console.error(err);
      addToast("Failed to decode image file", "error");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-[var(--ed-bg)] font-sans select-none text-[var(--ink)]">
      {/* Hidden file input for 'O' / New Image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleNativeFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* ── Top Bar (56px) ── */}
      <TopBar
        onOpenExport={() => setShowExport(true)}
        onOpenNew={() => fileInputRef.current?.click()}
        onToggleLibrary={() => setLibraryOpen(!libraryOpen)}
        onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
        libraryOpen={libraryOpen}
        inspectorOpen={inspectorOpen}
      />

      {/* ── Main App Shell Body ── */}
      <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {!hasImage ? (
          <EmptyState onImageLoaded={() => setHasImage(true)} />
        ) : (
          <div className="flex-1 min-h-0 flex flex-col md:flex-row relative overflow-hidden">
            {/* Left Tool Library Panel (280px on desktop, collapsable on 900-1279px) */}
            <aside
              className={`hidden md:flex w-[280px] shrink-0 border-r border-[var(--line)] bg-[var(--surface)] flex-col transition-all duration-150 ${
                !libraryOpen ? "md:hidden xl:flex" : ""
              }`}
            >
              <ToolLibrary />
            </aside>

            {/* Center Canvas Viewport */}
            <section className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[var(--ed-bg)]">
              <CanvasView onRetry={triggerRender} />

              {/* Mobile Bottom Tab Bar (<900px / md) */}
              <div className="md:hidden h-[44px] px-3 bg-[var(--surface)] border-t border-[var(--line)] flex items-center justify-around gap-2 z-20 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileSheet(mobileSheet === "tools" ? null : "tools")}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    mobileSheet === "tools" ? "bg-[var(--green)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Tools</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet(mobileSheet === "edits" ? null : "edits")}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    mobileSheet === "edits" ? "bg-[var(--green)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Layers size={14} />
                  <span>Edits ({steps.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet(mobileSheet === "info" ? null : "info")}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    mobileSheet === "info" ? "bg-[var(--green)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Sliders size={14} />
                  <span>Tune</span>
                </button>
              </div>
            </section>

            {/* Right Inspector Panel (340px) */}
            <aside className="hidden md:flex w-[340px] shrink-0 border-l border-[var(--line)] bg-[var(--surface)] flex-col">
              <Inspector />
            </aside>

            {/* Mobile Bottom Sheet (<900px) */}
            {mobileSheet && (
              <div className="md:hidden fixed inset-x-0 bottom-0 top-[35%] z-40 bg-[var(--surface)] border-t-2 border-[var(--line-2)] rounded-t-3xl shadow-[0_-10px_35px_rgba(0,0,0,0.5)] flex flex-col p-3 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--line)]">
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                    {mobileSheet === "tools" && "Tool Library"}
                    {mobileSheet === "edits" && `Pipeline (${steps.length} steps)`}
                    {mobileSheet === "info" && "Tune & Info"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileSheet(null)}
                    className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--ink)]"
                    aria-label="Close Sheet"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                  {mobileSheet === "tools" && (
                    <ToolLibrary onSelectOp={() => setMobileSheet("edits")} />
                  )}
                  {mobileSheet === "edits" && <Inspector />}
                  {mobileSheet === "info" && <Inspector />}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Status Bar (28px) ── */}
      <StatusBar />

      {/* Full-resolution Export Dialog */}
      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />

      {/* Non-blocking Toasts */}
      <Toasts />

      {/* Keyboard Shortcuts Sheet Modal */}
      <ShortcutSheet />
    </div>
  );
}
