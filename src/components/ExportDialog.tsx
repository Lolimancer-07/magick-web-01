"use client";

import { useState } from "react";
import { engine } from "@/engine/engineClient";
import { useEditorStore } from "@/store/editorStore";

interface ExportDialogProps {
  onClose: () => void;
}

const FORMATS = [
  { id: "png", label: "PNG", desc: "Lossless, supports transparency", hasQuality: false },
  { id: "jpeg", label: "JPEG", desc: "Best for photos, smaller file size", hasQuality: true },
  { id: "webp", label: "WebP", desc: "Modern format, great compression", hasQuality: true },
];

export default function ExportDialog({ onClose }: ExportDialogProps) {
  const { steps, fileName } = useEditorStore();
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(90);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFormat = FORMATS.find((f) => f.id === format)!;
  const baseName = fileName?.replace(/\.[^.]+$/, "") ?? "image";

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const result = await engine.render(steps, {
        preview: false,
        format,
        quality: selectedFormat.hasQuality ? quality : undefined,
      });

      const blob = new Blob([result.bytes], { type: result.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}-edited.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Export Image</h2>
          <button className="dialog-close" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-body">
          {/* Format selector */}
          <div className="export-formats">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                className={`format-card ${format === f.id ? "selected" : ""}`}
                onClick={() => setFormat(f.id)}
              >
                <span className="format-name">{f.label}</span>
                <span className="format-desc">{f.desc}</span>
              </button>
            ))}
          </div>

          {/* Quality slider */}
          {selectedFormat.hasQuality && (
            <div className="export-quality">
              <label>
                Quality
                <span className="export-quality-val">{quality}%</span>
              </label>
              <input
                type="range"
                className="param-slider"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
              />
              <div className="param-range-labels">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {error && <p className="export-error">⚠️ {error}</p>}

          <div className="export-info">
            <span>📁 Output: {baseName}-edited.{format}</span>
            <span>🔒 Processed locally in your browser</span>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="spinner-sm" />
                Exporting…
              </>
            ) : (
              `Download ${format.toUpperCase()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
