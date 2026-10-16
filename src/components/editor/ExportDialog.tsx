"use client";

import { useState } from "react";
import { X, Download, FileDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { engine } from "@/engine/engineClient";
import { useEditorStore } from "@/store/editorStore";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "png" | "jpeg" | "webp";

export default function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const { steps, fileName, originalDimensions } = useEditorStore();

  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(90);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(20);
    setError(null);

    try {
      const progressTimer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 15 : p));
      }, 150);

      const result = await engine.render(steps, {
        preview: false, // Full-resolution export render
        format,
        quality: format === "png" ? undefined : quality,
      });

      clearInterval(progressTimer);
      setProgress(100);

      const blob = new Blob([result.bytes], { type: result.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "magick-export";
      a.href = url;
      a.download = `${baseName}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setProgress(0);
        onClose();
      }, 500);
    } catch (err: unknown) {
      console.error("Export error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Export failed");
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
    >
      <div className="relative w-full max-w-md p-6 bg-[var(--surface)] rounded-3xl border border-[var(--line-2)]/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-[var(--line-2)]/10 bg-slate-100 hover:bg-slate-200 text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors cursor-pointer"
          aria-label="Close export dialog"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-green-d flex items-center justify-center">
            <Download size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 id="export-dialog-title" className="font-display font-bold text-lg text-[var(--ink)]">
              Export Image
            </h3>
            <p className="text-xs text-muted">
              {originalDimensions
                ? `Full resolution · ${originalDimensions.w} × ${originalDimensions.h} px`
                : "Full resolution export"}
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[var(--ink)] mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["png", "jpeg", "webp"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                  format === fmt
                    ? "bg-ink text-white border-[var(--line-2)] shadow-sm"
                    : "bg-slate-50 text-[var(--ink)]/70 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (for lossy formats) */}
        {format !== "png" && (
          <div className="mb-5">
            <div className="flex justify-between items-center text-xs font-semibold text-[var(--ink)] mb-1.5">
              <label htmlFor="export-quality">Quality</label>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-[var(--line-2)]/10 font-mono text-[11px]">
                {quality}%
              </span>
            </div>
            <input
              id="export-quality"
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full accent-green h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Progress Bar when exporting */}
        {isExporting && (
          <div className="mb-5 space-y-2">
            <div className="flex justify-between text-xs font-medium text-[var(--ink)]">
              <span>Encoding in WebAssembly...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-green transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2 text-xs font-medium">
            <AlertTriangle size={15} className="shrink-0 text-red-600" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line-2)]/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-display font-bold text-xs text-white bg-green hover:bg-green-d transition-all shadow-[0_4px_12px_rgba(42,188,96,0.3)] hover:shadow-[0_6px_16px_rgba(42,188,96,0.4)] active:translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            <FileDown size={15} aria-hidden="true" />
            <span>{isExporting ? "Exporting..." : "Download Image"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
