"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, Loader2, AlertCircle, Shield, Zap, FileCheck2, Sparkles } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { engine } from "@/engine/engineClient";

const MAX_SIZE_BYTES = 50 * 1024 * 1024;

interface DropzoneProps {
  onImageLoaded: () => void;
}

export default function Dropzone({ onImageLoaded }: DropzoneProps) {
  const { setFile, setBeforeUrl, setPreviewUrl } = useEditorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingFileName, setLoadingFileName] = useState("");

  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      if (file.size > MAX_SIZE_BYTES) {
        setErrorMessage(`File too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max 50 MB.`);
        return;
      }
      setIsLoading(true);
      setLoadingFileName(file.name);
      try {
        const originalUrl = URL.createObjectURL(file);
        setBeforeUrl(originalUrl);
        setPreviewUrl(null);
        const { width, height } = await engine.load(file);
        setFile(file.name, { w: width, h: height });
        onImageLoaded();
      } catch (err: unknown) {
        console.error("Failed to load image:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(`Could not process image: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    },
    [setFile, setBeforeUrl, setPreviewUrl, onImageLoaded]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) { processFile(file); break; }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFile]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const first = fileRejections[0];
        if (first.errors.some((e) => e.code === "file-too-large")) {
          setErrorMessage("File exceeds 50 MB limit.");
        } else if (first.errors.some((e) => e.code === "file-invalid-type")) {
          setErrorMessage("Unsupported file type. Use PNG, JPEG, WebP, GIF, SVG, BMP or TIFF.");
        } else {
          setErrorMessage(first.errors[0]?.message || "Failed to load image.");
        }
        return;
      }
      if (acceptedFiles[0]) processFile(acceptedFiles[0]);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif", ".avif", ".svg", ".ico"],
    },
    multiple: false,
    maxSize: MAX_SIZE_BYTES,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div style={{ width: "100%", maxWidth: "580px", margin: "0 auto", padding: "0 16px" }}>
      <div
        {...getRootProps()}
        tabIndex={0}
        role="region"
        aria-label="Image dropzone"
        style={{
          position: "relative",
          borderRadius: "20px",
          padding: "32px 18px",
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
          transition: "all .2s ease",
          background: isDragActive
            ? "rgba(63,237,30,.06)"
            : "var(--surface)",
          border: isDragActive
            ? "2px dashed rgba(63,237,30,.6)"
            : "1px dashed rgba(255,255,255,.12)",
          boxShadow: isDragActive
            ? "0 0 40px rgba(63,237,30,.15), inset 0 0 40px rgba(63,237,30,.05)"
            : "0 8px 32px rgba(0,0,0,.4)",
          transform: isDragActive ? "scale(1.01)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!isDragActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.2)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.12)";
          }
        }}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "rgba(63,237,30,.1)",
                border: "1px solid rgba(63,237,30,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--green)",
              }}
            >
              <Loader2 size={28} className="animate-spin" />
            </div>
            <div>
              <p className="font-display" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>
                Decoding in WASM…
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-mono)", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "0 auto" }}>
                {loadingFileName}
              </p>
            </div>
            <div
              style={{
                width: "180px",
                height: "4px",
                borderRadius: "9999px",
                background: "var(--surface-2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "60%",
                  height: "100%",
                  background: "linear-gradient(90deg, var(--green), #7fff6a)",
                  borderRadius: "9999px",
                  animation: "shimmer 1.5s linear infinite",
                  backgroundSize: "200% auto",
                }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "22px",
                  background: isDragActive ? "rgba(63,237,30,.15)" : "var(--surface-2)",
                  border: isDragActive ? "1px solid rgba(63,237,30,.35)" : "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isDragActive ? "var(--green)" : "var(--muted)",
                  transition: "all .2s",
                  transform: isDragActive ? "scale(1.08) rotate(-3deg)" : "scale(1)",
                  boxShadow: isDragActive ? "0 0 24px rgba(63,237,30,.2)" : "0 4px 16px rgba(0,0,0,.3)",
                }}
              >
                {isDragActive ? (
                  <Sparkles size={34} aria-hidden="true" />
                ) : (
                  <Upload size={32} aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Heading */}
            <h2
              className="font-display"
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "10px",
                letterSpacing: "-0.02em",
              }}
            >
              {isDragActive ? "Release to start editing!" : "Drop your image here"}
            </h2>

            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "24px", lineHeight: 1.6 }}>
              <span className="hidden sm:inline">
                Drag & drop, browse, or paste with{" "}
                <kbd
                  style={{
                    padding: "2px 7px",
                    borderRadius: "5px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line-2)",
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  Ctrl + V
                </kbd>
              </span>
              <span className="sm:hidden">Tap below to choose an image from your device</span>
            </p>

            {/* Browse button */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); open(); }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--green)",
                  color: "var(--green-ink)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(63,237,30,.3)",
                  transition: "all .18s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 0 32px rgba(63,237,30,.5)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 0 20px rgba(63,237,30,.3)";
                }}
              >
                <Upload size={16} aria-hidden="true" />
                Browse Image File
              </button>
            </div>

            {/* Error */}
            {errorMessage && (
              <div
                role="alert"
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
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
            <div
              style={{
                paddingTop: "20px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {[
                { icon: Shield, text: "100% Private" },
                { icon: Zap, text: "Up to 50 MB" },
                { icon: FileCheck2, text: "PNG · JPG · WebP · GIF · SVG" },
              ].map((p) => (
                <span
                  key={p.text}
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
                  <p.icon size={12} style={{ color: "var(--green)" }} aria-hidden="true" />
                  {p.text}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
