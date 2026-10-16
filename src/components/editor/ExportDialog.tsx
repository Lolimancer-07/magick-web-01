"use client";

import { useState } from "react";
import { X, Download, CheckCircle, FileDown, AlertTriangle } from "lucide-react";
import { engine } from "@/engine/engineClient";
import { useEditorStore } from "@/store/editorStore";
import ClayCard from "@/components/ui/ClayCard";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import IconTile from "@/components/ui/IconTile";

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
      // Advance progress bar smoothly
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

      // Create blob & trigger download
      const blob = new Blob([result.bytes], { type: result.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "magick-export";
      a.href = url;
      a.download = `${baseName}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Brief delay then close
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setProgress(0);
        onClose();
      }, 600);
    } catch (err: unknown) {
      console.error("Export error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Export failed");
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
    >
      <ClayCard
        variant="white"
        className="relative w-full max-w-md p-6 shadow-[6px_6px_0_var(--ink)]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-ink bg-gray hover:bg-white text-ink cursor-pointer transition-transform active:translate-y-0.5"
          aria-label="Close export dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <IconTile color="green" size="md">
            <Download size={22} className="text-ink" aria-hidden="true" />
          </IconTile>
          <div>
            <h3 id="export-dialog-title" className="font-display font-bold text-xl text-ink">
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
          <label className="block text-xs font-display font-bold text-ink mb-2">
            File Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["png", "jpeg", "webp"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`py-2 px-3 rounded-xl border-2 border-ink font-display text-xs font-bold uppercase transition-all cursor-pointer ${
                  format === fmt
                    ? "bg-mint text-ink shadow-[2px_2px_0_var(--ink)] -translate-y-0.5"
                    : "bg-gray hover:bg-white text-ink"
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
            <div className="flex justify-between items-center text-xs font-display font-bold text-ink mb-1.5">
              <label htmlFor="export-quality">Quality</label>
              <span className="px-2 py-0.5 rounded-md bg-gray border border-ink font-mono text-[11px]">
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
              className="w-full accent-green h-2.5 bg-gray rounded-lg border border-ink appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Progress Bar when exporting */}
        {isExporting && (
          <div className="mb-5 space-y-2">
            <div className="flex justify-between text-xs font-display font-bold text-ink">
              <span>Rendering export pipeline...</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} animated={true} />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-salmon/30 border-2 border-ink text-ink flex items-center gap-2 text-xs font-medium">
            <AlertTriangle size={16} className="shrink-0 text-ink" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-gray">
          <Button
            type="button"
            variant="white"
            size="md"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileDown size={18} className="inline mr-1.5 text-ink" aria-hidden="true" />
            {isExporting ? "Exporting..." : "Download File"}
          </Button>
        </div>
      </ClayCard>
    </div>
  );
}
