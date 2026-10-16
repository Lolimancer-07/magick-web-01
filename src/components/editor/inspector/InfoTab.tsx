"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Info, FileImage } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

export default function InfoTab() {
  const { fileName, originalDimensions, fileType, fileSize, steps, addToast } = useEditorStore();
  const [copied, setCopied] = useState(false);

  // Generate ImageMagick CLI command
  const cliCommand = (() => {
    const input = fileName || "input.jpg";
    const opsParts: string[] = [];

    for (const step of steps) {
      if (!step.enabled) continue;
      const p = step.params;
      switch (step.opId) {
        case "resize":
          opsParts.push(`-resize ${p.percent}%`);
          break;
        case "rotate":
          opsParts.push(`-rotate ${p.deg}`);
          break;
        case "flip":
          opsParts.push("-flip");
          break;
        case "flop":
          opsParts.push("-flop");
          break;
        case "blur":
          opsParts.push(`-blur 0x${p.radius ?? 2}`);
          break;
        case "sharpen":
          opsParts.push(`-sharpen 0x${p.radius ?? 2}`);
          break;
        case "grayscale":
          opsParts.push("-colorspace Gray");
          break;
        case "sepia":
          opsParts.push(`-sepia-tone ${p.threshold ?? 80}%`);
          break;
        case "negate":
          opsParts.push("-negate");
          break;
        case "gamma":
          opsParts.push(`-gamma ${p.gamma ?? 1.2}`);
          break;
        case "modulate":
          opsParts.push(`-modulate ${p.brightness ?? 100},${p.saturation ?? 100},${p.hue ?? 100}`);
          break;
        case "noise":
          opsParts.push(`+noise ${p.noiseType ?? "Gaussian"}`);
          break;
        case "oilPaint":
          opsParts.push(`-paint ${p.radius ?? 3}`);
          break;
        case "charcoal":
          opsParts.push(`-charcoal ${p.radius ?? 2}`);
          break;
        default:
          opsParts.push(`-${step.opId}`);
          break;
      }
    }

    const output = fileName ? `output_${fileName}` : "output.png";
    return `magick ${input} ${opsParts.join(" ")} ${output}`.trim();
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    addToast("Copied CLI command to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedSize = fileSize
    ? fileSize > 1024 * 1024
      ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(fileSize / 1024)} KB`
    : "Unknown";

  return (
    <div className="flex-1 p-3 overflow-y-auto space-y-4 text-[var(--ink)] text-xs select-none">
      {/* File Metadata Card */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider text-[var(--muted)]">
          <FileImage size={13} />
          <span>Image Information</span>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">File Name:</span>
            <span className="font-semibold truncate max-w-[170px]" title={fileName || "None"}>
              {fileName || "None"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Dimensions:</span>
            <span>{originalDimensions ? `${originalDimensions.w} × ${originalDimensions.h} px` : "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Format:</span>
            <span className="uppercase">{fileType || "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--muted)]">File Size:</span>
            <span>{formattedSize}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Color Space:</span>
            <span>sRGB (8-bit)</span>
          </div>
        </div>
      </div>

      {/* Magick CLI Command Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider text-[var(--muted)]">
            <Terminal size={13} />
            <span>ImageMagick CLI</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[11px] font-semibold text-[var(--ink)] transition-colors cursor-pointer"
            title="Copy Command"
          >
            {copied ? <Check size={11} className="text-[var(--green)]" /> : <Copy size={11} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[#2e3645] text-emerald-400 p-2.5 font-mono text-[11px] leading-relaxed break-all select-all">
          {cliCommand}
        </div>
        <p className="text-[10px] text-[var(--muted)] leading-normal">
          Run this command locally in terminal using the standard ImageMagick CLI.
        </p>
      </div>
    </div>
  );
}
