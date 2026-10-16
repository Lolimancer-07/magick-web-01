"use client";

import { useState, useId } from "react";
import { X, Download, FileDown, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { engine } from "@/engine/engineClient";
import { useEditorStore } from "@/store/editorStore";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "png" | "jpeg" | "webp";

export default function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const { steps, fileName, originalDimensions, addToast } = useEditorStore();

  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(90);
  const [resizePercent, setResizePercent] = useState(100);
  const [customName, setCustomName] = useState(
    fileName ? fileName.replace(/\.[^/.]+$/, "") : "magick-export"
  );
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  // Estimated dimensions based on resizePercent
  const targetW = originalDimensions
    ? Math.max(1, Math.round((originalDimensions.w * resizePercent) / 100))
    : 0;
  const targetH = originalDimensions
    ? Math.max(1, Math.round((originalDimensions.h * resizePercent) / 100))
    : 0;

  // Rough estimation of output size
  const estimatedKb = Math.round(
    (targetW * targetH * (format === "png" ? 3 : (quality / 100) * 0.8)) / 1024
  );

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(15);
    setError(null);
    setDownloadUrl(null);

    try {
      const progressTimer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 15 : p));
      }, 150);

      // Append optional resize step if resizePercent !== 100
      const exportSteps = [...steps];
      if (resizePercent !== 100) {
        exportSteps.push({
          uid: "export-resize",
          opId: "resize",
          params: { percent: resizePercent },
          enabled: true,
        });
      }

      const result = await engine.render(exportSteps, {
        preview: false, // Full-resolution export render
        format,
        quality: format === "png" ? undefined : quality,
      });

      clearInterval(progressTimer);
      setProgress(100);

      const blob = new Blob([result.bytes], { type: result.mime });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customName}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addToast(`Exported ${customName}.${format} (${result.width}×${result.height})`, "success");
    } catch (err: unknown) {
      console.error("Export error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAgain = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${customName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-ink shadow-[6px_6px_0_var(--ink)] p-6 text-ink">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-[#cfc9c3] bg-[#ebe8e5] hover:bg-white text-ink transition-colors cursor-pointer"
          aria-label="Close export dialog"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#91ec91] border-2 border-ink flex items-center justify-center text-ink shadow-[2px_2px_0_var(--ink)]">
            <Download size={20} />
          </div>
          <div>
            <h3 id="export-title" className="font-display font-bold text-lg text-ink">
              Export Image
            </h3>
            <p className="text-xs text-[#5b6377]">
              {targetW > 0 ? `${targetW} × ${targetH} px · Est. ~${estimatedKb} KB` : "Full resolution render"}
            </p>
          </div>
        </div>

        {/* File Name Field */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-ink mb-1">
            File Name
          </label>
          <div className="flex items-center rounded-xl border border-[#cfc9c3] bg-[#f4f2f0] overflow-hidden focus-within:border-ink">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 h-8 px-3 text-xs bg-transparent text-ink focus:outline-none font-medium"
            />
            <span className="px-2.5 text-xs font-mono text-[#5b6377] bg-[#ebe8e5] h-8 flex items-center border-l border-[#cfc9c3]">
              .{format}
            </span>
          </div>
        </div>

        {/* Format Cards */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-ink mb-1.5">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "png", label: "PNG", hint: "Lossless crisp" },
              { id: "jpeg", label: "JPEG", hint: "Smallest photo" },
              { id: "webp", label: "WebP", hint: "Modern web" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id as ExportFormat)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  format === f.id
                    ? "bg-[#2abc60]/10 border-ink shadow-sm"
                    : "bg-[#f4f2f0] border-[#cfc9c3] hover:bg-[#ebe8e5]"
                }`}
              >
                <p className="font-display font-bold text-xs text-ink uppercase">{f.label}</p>
                <p className="text-[10px] text-[#5b6377]">{f.hint}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (Lossy only) */}
        {format !== "png" && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs font-semibold text-ink mb-1">
              <span>Compression Quality</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#ebe8e5]">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#cfc9c3] rounded-lg appearance-none cursor-pointer accent-[#2abc60]"
            />
          </div>
        )}

        {/* Optional Resize on Export */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-xs font-semibold text-ink mb-1">
            <span>Resize Scale</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#ebe8e5]">
              {resizePercent}% ({targetW}×{targetH})
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={resizePercent}
            onChange={(e) => setResizePercent(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-[#cfc9c3] rounded-lg appearance-none cursor-pointer accent-[#2abc60]"
          />
        </div>

        {/* Progress bar */}
        {isExporting && (
          <div className="mb-4 space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-ink">
              <span>Rendering at full resolution...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#ebe8e5] overflow-hidden border border-[#cfc9c3]">
              <div
                className="h-full bg-[#2abc60] transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cfc9c3]">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5b6377] hover:text-ink hover:bg-[#ebe8e5] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {downloadUrl && (
            <button
              type="button"
              onClick={handleDownloadAgain}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-ink text-xs font-semibold text-ink bg-white hover:bg-[#ebe8e5] transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Download Again</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-ink font-display font-bold text-xs text-ink bg-[#2abc60] hover:brightness-105 active:translate-y-0.5 shadow-[2px_2px_0_var(--ink)] transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown size={15} />
            <span>{isExporting ? "Rendering..." : "Export File"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
