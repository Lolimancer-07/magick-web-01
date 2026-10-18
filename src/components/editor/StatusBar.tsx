"use client";

import { useEditorStore } from "@/store/editorStore";
import { Cpu } from "lucide-react";

export default function StatusBar() {
  const {
    fileName,
    originalDimensions,
    fileType,
    fileSize,
    renderTimeMs,
    zoom,
    previewLoading,
    steps,
  } = useEditorStore();

  const formattedSize = fileSize
    ? fileSize > 1024 * 1024
      ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(fileSize / 1024)} KB`
    : null;

  return (
    <footer
      style={{
        height: "var(--statusbar-h)",
        padding: "0 12px",
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.68rem",
        fontFamily: "var(--font-mono)",
        color: "var(--dim)",
        userSelect: "none",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, overflow: "hidden" }}>
        <span className="status-dot" aria-hidden="true" />
        {!fileName ? (
          <span>WASM Engine Ready · ImageMagick v7</span>
        ) : (
          <>
            {originalDimensions && (
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                {originalDimensions.w} × {originalDimensions.h}
              </span>
            )}
            {fileType && (
              <>
                <span style={{ color: "var(--line-2)" }}>·</span>
                <span style={{ textTransform: "uppercase" }}>{fileType}</span>
              </>
            )}
            {formattedSize && (
              <span className="hidden sm:inline-flex items-center gap-2">
                <span style={{ color: "var(--line-2)" }}>·</span>
                <span>{formattedSize}</span>
              </span>
            )}
            <span style={{ color: "var(--line-2)" }}>·</span>
            <span>{steps.length} {steps.length === 1 ? "step" : "steps"}</span>
            {previewLoading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--green)", fontWeight: 600, animation: "neonPulse 1s infinite" }}>
                <Cpu size={11} style={{ animation: "spin 1s linear infinite" }} aria-hidden="true" />
                Rendering…
              </span>
            ) : renderTimeMs !== null ? (
              <>
                <span style={{ color: "var(--line-2)" }}>·</span>
                <span>{renderTimeMs}ms</span>
              </>
            ) : null}
          </>
        )}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{ color: "var(--muted)", fontWeight: 600 }}>{Math.round(zoom * 100)}%</span>
        <span style={{ color: "var(--line-2)" }}>·</span>
        <span>Space+Drag pan · \\ peek · ? shortcuts</span>
      </div>
    </footer>
  );
}
