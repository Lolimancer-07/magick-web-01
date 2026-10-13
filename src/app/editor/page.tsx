"use client";

import { useEffect, useCallback, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/store/editorStore";
import { engine } from "@/engine/engineClient";
import { OP_MAP } from "@/ops/definitions";
import Dropzone from "@/components/Dropzone";
import Canvas from "@/components/Canvas";
import OperationPicker from "@/components/OperationPicker";
import HistoryPanel from "@/components/HistoryPanel";
import ExportDialog from "@/components/ExportDialog";

const DEBOUNCE_MS = 40;

function EditorContent() {
  const searchParams = useSearchParams();
  const {
    steps,
    fileName,
    originalDimensions,
    beforeAfterMode,
    setFile,
    setBeforeUrl,
    setPreviewUrl,
    setPreviewLoading,
    setPreviewError,
    setBeforeAfterMode,
    addStep,
    undo,
    redo,
    past,
    future,
    reset,
  } = useEditorStore();

  const [hasImage, setHasImage] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [zoom, setZoom] = useState(1);
  const latestRenderRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialProcessedRef = useRef(false);

  // Render pipeline whenever steps change
  const triggerRender = useCallback(() => {
    if (!hasImage) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const renderId = ++latestRenderRef.current;
      setPreviewLoading(true);
      setPreviewError(null);
      try {
        const result = await engine.render(steps, { preview: true });
        if (renderId !== latestRenderRef.current) return; // Stale result
        const blob = new Blob([result.bytes], { type: result.mime });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err: unknown) {
        if (renderId !== latestRenderRef.current) return;
        // Silently ignore renders that were cancelled by a newer request
        const msg = err instanceof Error ? err.message : String(err);
        if (msg === "cancelled") return;
        setPreviewError(msg || "Render failed");
      } finally {
        if (renderId === latestRenderRef.current) setPreviewLoading(false);
      }
    }, DEBOUNCE_MS);
  }, [hasImage, steps, setPreviewUrl, setPreviewLoading, setPreviewError]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // Load sample demo image with optional operation to auto-apply
  const loadSampleImage = useCallback(
    async (initialOpId?: string) => {
      try {
        setPreviewLoading(true);
        setPreviewError(null);
        const res = await fetch("/sample.jpg");
        if (!res.ok) throw new Error("Could not fetch sample.jpg");
        const blob = await res.blob();
        const file = new File([blob], "sample-landscape.jpg", { type: "image/jpeg" });
        const originalUrl = URL.createObjectURL(file);
        setBeforeUrl(originalUrl);
        setPreviewUrl(null);

        const { width, height } = await engine.load(file);
        setFile("sample-landscape.jpg", { w: width, h: height });
        setHasImage(true);

        if (initialOpId && OP_MAP[initialOpId]) {
          const op = OP_MAP[initialOpId];
          const defaults: Record<string, number | string | boolean> = {};
          for (const p of op.params) defaults[p.id] = p.default;
          addStep(op.id, defaults);
        }
      } catch (err: unknown) {
        console.error("Failed to load demo image:", err);
        setPreviewError(err instanceof Error ? err.message : "Failed to load demo image");
      } finally {
        setPreviewLoading(false);
      }
    },
    [setBeforeUrl, setPreviewUrl, setFile, addStep, setPreviewLoading, setPreviewError]
  );

  // Check query params on mount (e.g. ?op=blur or ?demo=true)
  useEffect(() => {
    if (initialProcessedRef.current) return;
    initialProcessedRef.current = true;

    const opParam = searchParams.get("op");
    const demoParam = searchParams.get("demo");

    if (opParam || demoParam) {
      loadSampleImage(opParam || undefined);
    }
  }, [searchParams, loadSampleImage]);

  const handleImageLoaded = useCallback(() => {
    setHasImage(true);
  }, []);

  const handleNewImage = () => {
    reset();
    setHasImage(false);
  };

  return (
    <div className="editor-root">
      {/* Top bar */}
      <header className="editor-topbar">
        <div className="topbar-left">
          <a href="/" className="topbar-logo">
            <span className="logo-icon">✦</span>
            <span className="logo-text">Magick<span className="logo-accent">Web</span></span>
          </a>
          {fileName && (
            <div className="topbar-file">
              <span className="file-name">{fileName}</span>
              {originalDimensions && (
                <span className="file-dims">
                  {originalDimensions.w} × {originalDimensions.h}px
                </span>
              )}
            </div>
          )}
        </div>

        <div className="topbar-center">
          {hasImage && (
            <div className="topbar-actions">
              <button
                className={`topbar-btn ${beforeAfterMode ? "active" : ""}`}
                onClick={() => setBeforeAfterMode(!beforeAfterMode)}
                title="Before / After comparison"
              >
                ⇄ Compare
              </button>
              <button className="topbar-btn" onClick={handleNewImage} title="Open new image">
                ✦ New Image
              </button>
            </div>
          )}
        </div>

        <div className="topbar-right">
          <div className="undo-redo">
            <button className="icon-btn" onClick={undo} disabled={past.length === 0} title="Undo (Ctrl+Z)">↩</button>
            <button className="icon-btn" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)">↪</button>
          </div>
          {hasImage && (
            <button
              className="btn-export"
              onClick={() => setShowExport(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
          )}
        </div>
      </header>

      {/* Main layout */}
      <div className="editor-body">
        {!hasImage ? (
          /* Landing / upload view */
          <div className="editor-upload-view">
            <div className="upload-hero">
              <h1 className="upload-title">
                Professional Image Editing,<br />
                <span className="gradient-text">Right in Your Browser</span>
              </h1>
              <p className="upload-subtitle">
                Powered by ImageMagick WebAssembly. Your images never leave your device.
              </p>
            </div>
            <Dropzone
              onImageLoaded={handleImageLoaded}
              onLoadSample={() => loadSampleImage()}
            />
            <div className="upload-features">
              <div className="feature-chip">🎨 17+ operations</div>
              <div className="feature-chip">↩ Undo / Redo</div>
              <div className="feature-chip">⚡ Real-time preview</div>
              <div className="feature-chip">📦 Export PNG/JPEG/WebP</div>
              <div className="feature-chip">🔒 100% private</div>
            </div>
          </div>
        ) : (
          /* Editor layout: left panel | canvas | right panel */
          <div className="editor-panels">
            {/* Left: Operations */}
            <aside className="panel-left">
              <OperationPicker />
            </aside>

            {/* Center: Canvas */}
            <main className="panel-canvas">
              <Canvas onZoomChange={setZoom} />
              <div className="canvas-zoom-label">{Math.round(zoom * 100)}%</div>
            </main>

            {/* Right: Pipeline */}
            <aside className="panel-right">
              <HistoryPanel />
              <div className="panel-privacy-note">
                🔒 Images are processed in your browser and never uploaded.
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Export dialog */}
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="editor-root">
          <div className="canvas-loading" style={{ height: "100vh" }}>
            <div className="spinner" />
            <p>Loading editor…</p>
          </div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
