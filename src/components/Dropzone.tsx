"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { engine } from "@/engine/engineClient";
import { useEditorStore } from "@/store/editorStore";

interface DropzoneProps {
  onImageLoaded: () => void;
  onLoadSample?: () => void;
}

export default function Dropzone({ onImageLoaded, onLoadSample }: DropzoneProps) {
  const { setFile, setBeforeUrl, setPreviewUrl } = useEditorStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) {
        alert("File too large. Please use images under 50 MB.");
        return;
      }

      try {
        // Show original as before-image
        const originalUrl = URL.createObjectURL(file);
        setBeforeUrl(originalUrl);
        setPreviewUrl(null);

        const { width, height } = await engine.load(file);
        setFile(file.name, { w: width, h: height });
        onImageLoaded();
      } catch (err: unknown) {
        console.error("Failed to load image:", err);
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Failed to load image: ${msg}`);
      }
    },
    [setFile, setBeforeUrl, setPreviewUrl, onImageLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "drag-over" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone-inner">
        <div className="dropzone-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h2 className="dropzone-title">
          {isDragActive ? "Drop your image here" : "Upload an Image"}
        </h2>
        <p className="dropzone-subtitle">
          Drag &amp; drop or <span className="link-accent">browse files</span>
        </p>

        {onLoadSample && (
          <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn-sample-demo"
              onClick={onLoadSample}
            >
              <span className="btn-sample-icon">✨</span> Try with Demo Image
            </button>
          </div>
        )}

        <p className="dropzone-hint">
          PNG, JPEG, WebP, GIF, TIFF, BMP — up to 50 MB
        </p>
        <div className="dropzone-badges">
          <span className="badge">🔒 Privacy First</span>
          <span className="badge">⚡ Client-Side</span>
          <span className="badge">🎨 19+ Ops</span>
        </div>
      </div>
    </div>
  );
}
