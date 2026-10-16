"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import Link from "next/link";
import {
  Wand2,
  ArrowLeft,
  Download,
  ImagePlus,
  Sliders,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { engine } from "@/engine/engineClient";
import Dropzone from "./Dropzone";
import Canvas from "./Canvas";
import OperationPicker from "./OperationPicker";
import ParamPanel from "./ParamPanel";
import HistoryPanel from "./HistoryPanel";
import ExportDialog from "./ExportDialog";
import Button from "@/components/ui/Button";
import IconTile from "@/components/ui/IconTile";
import Pill from "@/components/ui/Pill";

const DEBOUNCE_MS_SLIDER = 80; // Debounce per Step 6 specification (~80ms)
const DEBOUNCE_MS_ADD = 0;     // Instant on add

export default function EditorShell() {
  const {
    steps,
    fileName,
    originalDimensions,
    setPreviewUrl,
    setPreviewLoading,
    setPreviewError,
    undo,
    redo,
    reset,
  } = useEditorStore();

  const [hasImage, setHasImage] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  // Mobile / <900px drawer state: null | 'tools' | 'pipeline' | 'params'
  const [mobileDrawer, setMobileDrawer] = useState<"tools" | "pipeline" | "params" | null>(null);

  const latestRenderRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStepCountRef = useRef(0);
  const currentBlobUrlRef = useRef<string | null>(null);

  // Sync hasImage with fileName
  useEffect(() => {
    setHasImage(Boolean(fileName));
  }, [fileName]);

  // Keep selectedUid valid
  useEffect(() => {
    if (steps.length > 0) {
      if (!selectedUid || !steps.some((s) => s.uid === selectedUid)) {
        setSelectedUid(steps[steps.length - 1].uid);
      }
    } else {
      setSelectedUid(null);
    }
  }, [steps, selectedUid]);

  // Render pipeline when steps change
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

      try {
        const result = await engine.render(steps, { preview: true });
        // Discard stale renders older than latest request
        if (renderId !== latestRenderRef.current) return;

        // Revoke previous blob URL to prevent memory leaks
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
  }, [hasImage, steps, setPreviewUrl, setPreviewLoading, setPreviewError]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Keyboard shortcuts: Ctrl+Z, Ctrl+Shift+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey) || (e.key === "Z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="min-h-screen bg-beige flex flex-col font-sans select-none overflow-x-hidden">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 px-4 py-3 bg-white/95 backdrop-blur-md border-b-2 border-ink shadow-[0_2px_0_var(--ink)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Home link, Logo & File Meta */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-ink bg-gray hover:bg-white text-ink font-display text-xs font-bold transition-all shadow-[2px_2px_0_var(--ink)] active:translate-y-0.5 cursor-pointer"
              title="Return to home page"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <IconTile color="salmon" size="sm">
                <Wand2 size={18} className="text-ink" aria-hidden="true" />
              </IconTile>
              <span className="font-display font-bold text-lg text-ink hidden sm:inline">
                Magick<span className="text-green-d">Studio</span>
              </span>
            </div>

            {fileName && (
              <div className="flex items-center gap-2 pl-2 border-l-2 border-ink/20">
                <Pill color="lavender" className="max-w-[160px] sm:max-w-[220px] truncate">
                  {fileName}
                </Pill>
                {originalDimensions && (
                  <span className="hidden md:inline text-xs font-semibold text-muted">
                    {originalDimensions.w} × {originalDimensions.h}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {hasImage ? (
              <>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => {
                    if (confirm("Open another image? Current changes will be reset.")) {
                      reset();
                    }
                  }}
                  title="Open a different image"
                >
                  <ImagePlus size={16} className="inline mr-1 text-ink" aria-hidden="true" />
                  <span className="hidden sm:inline">New Image</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowExport(true)}
                  title="Export full resolution image"
                >
                  <Download size={16} className="inline mr-1 text-ink" aria-hidden="true" />
                  <span>Export</span>
                </Button>
              </>
            ) : (
              <span className="text-xs font-semibold text-muted">Lightweight WASM Editor</span>
            )}
          </div>
        </div>
      </header>

      {/* ── Workspace Body ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {!hasImage ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <Dropzone onImageLoaded={() => setHasImage(true)} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
            {/* Desktop Left Side Panel (Operations catalog) */}
            <aside className="hidden lg:block w-72 shrink-0 p-4 border-r-2 border-ink bg-beige/60 overflow-y-auto">
              <OperationPicker
                onSelectOp={() => {
                  // After adding, focus latest step
                  setTimeout(() => {
                    const st = useEditorStore.getState().steps;
                    if (st.length > 0) setSelectedUid(st[st.length - 1].uid);
                  }, 50);
                }}
              />
            </aside>

            {/* Center Canvas Area */}
            <section className="flex-1 flex flex-col justify-center items-center relative overflow-hidden bg-beige">
              <Canvas onRetry={triggerRender} />

              {/* Mobile Drawer Toggle Bar (< 900px / < lg) */}
              <div className="lg:hidden w-full px-4 py-2 bg-white/95 border-t-2 border-ink flex items-center justify-around gap-2 z-20">
                <button
                  type="button"
                  onClick={() => setMobileDrawer(mobileDrawer === "tools" ? null : "tools")}
                  className={`flex-1 py-2 px-3 rounded-xl border-2 border-ink font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mobileDrawer === "tools" ? "bg-mint shadow-[2px_2px_0_var(--ink)]" : "bg-gray"
                  }`}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Tools</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileDrawer(mobileDrawer === "pipeline" ? null : "pipeline")}
                  className={`flex-1 py-2 px-3 rounded-xl border-2 border-ink font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mobileDrawer === "pipeline" ? "bg-mint shadow-[2px_2px_0_var(--ink)]" : "bg-gray"
                  }`}
                >
                  <Layers size={16} aria-hidden="true" />
                  <span>Pipeline ({steps.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileDrawer(mobileDrawer === "params" ? null : "params")}
                  className={`flex-1 py-2 px-3 rounded-xl border-2 border-ink font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mobileDrawer === "params" ? "bg-mint shadow-[2px_2px_0_var(--ink)]" : "bg-gray"
                  }`}
                >
                  <Sliders size={16} aria-hidden="true" />
                  <span>Tune</span>
                </button>
              </div>
            </section>

            {/* Desktop Right Side Panels (History & Params) */}
            <aside className="hidden lg:flex flex-col w-80 shrink-0 p-4 border-l-2 border-ink bg-beige/60 gap-4 overflow-y-auto">
              <HistoryPanel
                selectedUid={selectedUid}
                onSelectStep={(uid) => setSelectedUid(uid)}
              />
              <ParamPanel selectedUid={selectedUid} />
            </aside>

            {/* Mobile Bottom Sheet (< 900px) */}
            {mobileDrawer && (
              <div className="lg:hidden fixed inset-x-0 bottom-0 top-1/3 z-40 bg-white border-t-4 border-ink rounded-t-3xl shadow-[0_-6px_0_rgba(46,54,69,0.15)] flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-gray">
                  <span className="font-display font-bold text-sm text-ink uppercase tracking-wide">
                    {mobileDrawer === "tools" && "Operation Catalog"}
                    {mobileDrawer === "pipeline" && "Edit Pipeline"}
                    {mobileDrawer === "params" && "Tune Parameters"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileDrawer(null)}
                    className="p-1.5 rounded-lg border-2 border-ink bg-gray hover:bg-white text-ink cursor-pointer"
                    aria-label="Close bottom sheet"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {mobileDrawer === "tools" && (
                    <OperationPicker
                      onSelectOp={() => {
                        setMobileDrawer("pipeline");
                      }}
                    />
                  )}
                  {mobileDrawer === "pipeline" && (
                    <HistoryPanel
                      selectedUid={selectedUid}
                      onSelectStep={(uid) => {
                        setSelectedUid(uid);
                        setMobileDrawer("params");
                      }}
                    />
                  )}
                  {mobileDrawer === "params" && (
                    <ParamPanel selectedUid={selectedUid} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Full-resolution Export Dialog */}
      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
