"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Upload,
  Camera,
  Clipboard,
  Shield,
  Zap,
  FileCheck2,
  AlertCircle,
  Wand2,
  Search,
} from "lucide-react";
import { useAppStore, triggerHaptic } from "@/store/appStore";
import { useLayoutMode } from "@/hooks/useLayoutMode";
import { COVERAGE_STATS } from "@/ops/stats";

// ─── Max file size (50 MB) ────────────────────────────────────────────────────
const MAX_BYTES = 50 * 1024 * 1024;

// ─── Accepted MIME types (broad, so Android gallery shows everything) ─────────
const ACCEPT = "image/*";

export default function UnifiedEmptyState() {
  const mode = useLayoutMode();
  const searchParams = useSearchParams();
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pasteBlocked, setPasteBlocked] = useState(false);

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef    = useRef<HTMLDivElement>(null);

  const {
    setFile,
    setCurrentImage,
    setPreviewUrl,
    setCommandPaletteOpen,
  } = useAppStore();

  // ── Pre-selected tool from deep link ──────────────────────────────────────
  const deepLinkTool =
    searchParams.get("tool") ?? searchParams.get("op") ?? null;

  // ── Process a File ────────────────────────────────────────────────────────
  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);

      // Size guard
      if (file.size > MAX_BYTES) {
        setErrorMessage(
          `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 50 MB.`
        );
        return;
      }

      // Low-memory warning: warn but don't block
      const mem = (navigator as any).deviceMemory as number | undefined;
      if (mem !== undefined && mem <= 2 && file.size > 10 * 1024 * 1024) {
        setErrorMessage(
          "Large image on a low-memory device — processing may be slow."
        );
        // non-blocking — continue
      }

      setIsLoading(true);
      setLoadingFileName(file.name);

      try {
        // Decode to determine real dimensions (handles EXIF orientation)
        const bitmap = await createImageBitmap(file, {
          imageOrientation: "from-image",
        });
        const w = bitmap.width;
        const h = bitmap.height;
        bitmap.close();

        const entry = setCurrentImage(file, w, h);
        setFile(file.name, { w, h }, { size: file.size, type: file.type });

        const url = entry.url;
        setPreviewUrl(url);
      } catch (err) {
        console.error("[UnifiedEmptyState] Decode error:", err);
        setErrorMessage(
          "Could not decode this file. Make sure it is a supported image format."
        );
      } finally {
        setIsLoading(false);
        setLoadingFileName("");
      }
    },
    [setCurrentImage, setFile, setPreviewUrl]
  );

  // ── File input change ─────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  // ── Browse click (always inside a user gesture — safe on Android) ─────────
  const handleBrowseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic(10);
      fileInputRef.current?.click();
    },
    []
  );

  // ── Take Photo click ──────────────────────────────────────────────────────
  const handleCameraClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic(10);
      cameraInputRef.current?.click();
    },
    []
  );

  // ── Paste (Async Clipboard API — requires user gesture) ──────────────────
  const handlePasteClick = useCallback(async () => {
    triggerHaptic(10);
    try {
      if (!navigator.clipboard?.read) {
        // Fallback: listen for clipboardData on next paste event
        document.execCommand("paste"); // may not work, handled below
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) {
          const blob = await item.getType(type);
          const file = new File([blob], `pasted-image.${type.split("/")[1]}`, {
            type,
          });
          processFile(file);
          return;
        }
      }
      setErrorMessage("No image found in clipboard.");
    } catch {
      setPasteBlocked(true);
      setErrorMessage(
        "Clipboard access was blocked. Try Ctrl+V or paste directly into the drop area."
      );
    }
  }, [processFile]);

  // ── Keyboard paste (desktop) ──────────────────────────────────────────────
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) { processFile(file); break; }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [processFile]);

  // ── External file event (from "Open New" in TopBar) ──────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const file = (e as CustomEvent<{ file: File }>).detail?.file;
      if (file) processFile(file);
    };
    window.addEventListener("magick:open-file", handler);
    return () => window.removeEventListener("magick:open-file", handler);
  }, [processFile]);

  // ── PWA Share Target: check service worker shared-files cache ────────────
  useEffect(() => {
    async function checkSharedFiles() {
      if (!("caches" in window)) return;
      try {
        const cache = await caches.open("magick-shared-files");
        const keys = await cache.keys();
        if (keys.length === 0) return;
        for (const req of keys) {
          const res = await cache.match(req);
          if (res) {
            const blob = await res.blob();
            const name = decodeURIComponent(res.headers.get("X-File-Name") ?? "shared.jpg");
            const file = new File([blob], name, { type: blob.type });
            await cache.delete(req);
            processFile(file);
            return; // process first one; rest discarded for now
          }
        }
      } catch {}
    }
    checkSharedFiles();
  }, [processFile]);

  // ── Drag events on drop area ──────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const onDragLeave = () => setIsDragActive(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const isPhone = mode === "compact";
  const isDesktop = mode === "wide";

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "var(--ed-bg, var(--bg))",
        position: "relative",
        overflow: "hidden",
        // Prevent accidental pull-to-refresh on Android
        overscrollBehavior: "none",
      }}
    >
      {/* Hidden file inputs — always in DOM, triggered by button clicks */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple={false}
        style={{ display: "none" }}
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={ACCEPT}
        capture="environment"
        style={{ display: "none" }}
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(48,209,88,.025) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(48,209,88,.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(48,209,88,.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "460px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
            <div
              style={{
                width: "52px", height: "52px",
                borderRadius: "14px",
                background: "rgba(48,209,88,.12)",
                border: "1px solid rgba(48,209,88,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--green)",
                boxShadow: "0 0 20px rgba(48,209,88,.15)",
              }}
            >
              <Wand2 size={24} aria-hidden="true" />
            </div>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            Open an Image to Begin
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: "320px" }}>
            Full ImageMagick power in your browser. Your images stay on your device — always private.
          </p>

          {/* Deep-link hint */}
          {deepLinkTool && (
            <div
              style={{
                marginTop: "12px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "rgba(48,209,88,.1)",
                border: "1px solid rgba(48,209,88,.25)",
                fontSize: "0.82rem",
                color: "var(--green)",
                fontWeight: 600,
              }}
            >
              ✦ {deepLinkTool.charAt(0).toUpperCase() + deepLinkTool.slice(1)} is ready — open an image to apply it.
            </div>
          )}
        </div>

        {/* ── Drop area card ── */}
        <div
          ref={dropAreaRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          style={{
            width: "100%",
            borderRadius: "20px",
            background: isDragActive ? "rgba(48,209,88,.08)" : "var(--surface)",
            border: isDragActive
              ? "2px dashed rgba(48,209,88,.5)"
              : "1px solid var(--line-strong)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
            transition: "border-color .2s, background .2s",
          }}
        >
          {isLoading ? (
            <LoadingState fileName={loadingFileName} />
          ) : (
            <>
              {/* Upload icon */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    width: "72px", height: "72px",
                    borderRadius: "20px",
                    background: isDragActive ? "rgba(48,209,88,.15)" : "var(--surface-2)",
                    border: isDragActive ? "1px solid rgba(48,209,88,.35)" : "1px solid var(--line)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isDragActive ? "var(--green)" : "var(--muted)",
                    transition: "all .2s",
                    transform: isDragActive ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  <Upload size={32} aria-hidden="true" />
                </div>
              </div>

              <h2
                className="font-display"
                style={{
                  fontSize: "1.35rem", fontWeight: 700,
                  color: "var(--ink)", marginBottom: "8px",
                }}
              >
                {isDragActive ? "Release to open!" : "Drop your image here"}
              </h2>

              <p style={{
                color: "var(--muted)", fontSize: "0.85rem",
                marginBottom: "24px", lineHeight: 1.6, textAlign: "center",
              }}>
                {isDesktop ? (
                  <>
                    Drag &amp; drop, or paste with{" "}
                    <kbd style={{
                      padding: "2px 7px", borderRadius: "5px",
                      background: "var(--surface-2)", border: "1px solid var(--line-2)",
                      fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 700,
                    }}>Ctrl + V</kbd>
                  </>
                ) : (
                  "Tap a button below to choose an image from your device."
                )}
              </p>

              {/* ── Action buttons ── */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                width: "100%",
                marginBottom: "24px",
              }}>
                {/* Browse (primary) */}
                <button
                  type="button"
                  id="empty-state-browse-btn"
                  onClick={handleBrowseClick}
                  style={primaryBtn}
                >
                  <Upload size={16} aria-hidden="true" />
                  Browse Image File
                </button>

                {/* Take Photo (phones only) */}
                {isPhone && (
                  <button
                    type="button"
                    id="empty-state-camera-btn"
                    onClick={handleCameraClick}
                    style={secondaryBtn}
                  >
                    <Camera size={16} aria-hidden="true" />
                    Take Photo
                  </button>
                )}

                {/* Paste */}
                <button
                  type="button"
                  id="empty-state-paste-btn"
                  onClick={handlePasteClick}
                  style={secondaryBtn}
                >
                  <Clipboard size={16} aria-hidden="true" />
                  Paste
                </button>

                {/* Search (phone: no Ctrl+K hint) */}
                {isPhone && (
                  <button
                    type="button"
                    id="empty-state-search-btn"
                    onClick={() => setCommandPaletteOpen(true)}
                    style={secondaryBtn}
                  >
                    <Search size={16} aria-hidden="true" />
                    Search Tools
                  </button>
                )}
              </div>

              {/* Desktop: Ctrl+K hint */}
              {isDesktop && (
                <p style={{ fontSize: "0.78rem", color: "var(--dim)", marginBottom: "20px" }}>
                  Press{" "}
                  <kbd style={{
                    padding: "2px 6px", borderRadius: "4px",
                    background: "var(--surface-2)", border: "1px solid var(--line-2)",
                    fontSize: "0.75rem", fontFamily: "var(--font-mono)",
                  }}>Ctrl+K</kbd>{" "}
                  to search and select a tool before opening an image.
                </p>
              )}

              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "rgba(240,64,64,.1)",
                    border: "1px solid rgba(240,64,64,.25)",
                    color: "#f08080",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                  {errorMessage}
                </div>
              )}

              {/* Trust pills */}
              <div style={{
                paddingTop: "20px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
              }}>
                {[
                  { Icon: Shield, text: "100% Private" },
                  { Icon: Zap,    text: "Up to 50 MB" },
                  {
                    Icon: FileCheck2,
                    text: `${COVERAGE_STATS.formatsCount}+ formats`,
                  },
                ].map(({ Icon, text }) => (
                  <span
                    key={text}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--muted)",
                    }}
                  >
                    <Icon size={12} style={{ color: "var(--green)" }} aria-hidden="true" />
                    {text}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────

function LoadingState({ fileName }: { fileName: string }) {
  return (
    <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div
        style={{
          width: "64px", height: "64px",
          borderRadius: "18px",
          background: "rgba(48,209,88,.1)",
          border: "1px solid rgba(48,209,88,.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--green)",
        }}
      >
        <Wand2 size={28} className="animate-spin" aria-hidden="true" />
      </div>
      <p className="font-display"
        style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
        Decoding in WASM…
      </p>
      {fileName && (
        <p style={{
          fontSize: "0.8rem", color: "var(--muted)",
          fontFamily: "var(--font-mono)",
          maxWidth: "260px", overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
          margin: 0,
        }}>
          {fileName}
        </p>
      )}
      <div style={{
        width: "180px", height: "4px",
        borderRadius: "9999px",
        background: "var(--surface-2)", overflow: "hidden",
      }}>
        <div style={{
          width: "60%", height: "100%",
          background: "linear-gradient(90deg, var(--green), #64d2ff)",
          borderRadius: "9999px",
          animation: "magick-shimmer 1.5s linear infinite",
        }} />
      </div>
    </div>
  );
}

// ─── Button styles ────────────────────────────────────────────────────────────

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "13px 24px",
  borderRadius: "12px",
  border: "none",
  background: "var(--green)",
  color: "var(--green-ink, #000)",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: "pointer",
  boxShadow: "0 0 20px rgba(48,209,88,.3)",
  WebkitTapHighlightColor: "transparent",
  // Minimum 48px touch target height
  minHeight: "48px",
};

const secondaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "13px 18px",
  borderRadius: "12px",
  border: "1px solid var(--line-strong)",
  background: "var(--surface-2)",
  color: "var(--ink)",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: "0.85rem",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  minHeight: "48px",
};
