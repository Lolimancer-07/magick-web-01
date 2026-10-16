"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, AlertCircle, Sparkles, Shield, Zap } from "lucide-react";
import { engine } from "@/engine/engineClient";
import { useEditorStore } from "@/store/editorStore";
import ClayCard from "@/components/ui/ClayCard";
import Button from "@/components/ui/Button";
import IconTile from "@/components/ui/IconTile";
import Pill from "@/components/ui/Pill";

interface DropzoneProps {
  onImageLoaded: () => void;
  onLoadSample?: () => void;
}

const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function Dropzone({ onImageLoaded, onLoadSample }: DropzoneProps) {
  const { setFile, setBeforeUrl, setPreviewUrl } = useEditorStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      if (file.size > MAX_SIZE_BYTES) {
        setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select an image under 50 MB.`);
        return;
      }

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
        setErrorMessage(`Could not process this image: ${msg}`);
      }
    },
    [setFile, setBeforeUrl, setPreviewUrl, onImageLoaded]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const first = fileRejections[0];
        if (first.errors.some((e) => e.code === "file-too-large")) {
          setErrorMessage("File exceeds 50 MB limit. Please choose a smaller image.");
        } else if (first.errors.some((e) => e.code === "file-invalid-type")) {
          setErrorMessage("Unsupported file type. Please upload an image (PNG, JPEG, WebP, GIF, BMP, etc.).");
        } else {
          setErrorMessage(first.errors[0]?.message || "Failed to accept file.");
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: MAX_SIZE_BYTES,
    noClick: false,
    noKeyboard: false,
  });

  // Built-in synthetic sample generator (draws a vibrant test canvas with gradients & shapes)
  const handleGenerateSample = useCallback(() => {
    if (onLoadSample) {
      onLoadSample();
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, "#a4cad7");
    grad.addColorStop(0.5, "#eab1aa");
    grad.addColorStop(1, "#d6d5e7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Chunky playful clay shapes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(400, 400, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2abc60";
    ctx.beginPath();
    ctx.roundRect(550, 250, 400, 300, 40);
    ctx.fill();

    ctx.fillStyle = "#2e3645";
    ctx.font = "bold 56px Fredoka, sans-serif";
    ctx.fillText("Magick Studio", 260, 420);
    ctx.font = "500 28px Nunito, sans-serif";
    ctx.fillText("Sample Canvas Demo · 1200 × 800 px", 260, 470);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], "sample-canvas.png", { type: "image/png" });
        await processFile(file);
      }
    }, "image/png");
  }, [onLoadSample, processFile]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <ClayCard
        variant="white"
        className={`p-8 md:p-12 text-center transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-ink ${
          isDragActive ? "scale-[1.02] border-green" : ""
        }`}
        {...getRootProps()}
        tabIndex={0}
        role="region"
        aria-label="Image dropzone"
      >
        <input {...getInputProps()} />

        <div className="flex justify-center mb-6">
          <IconTile color="salmon" size="lg" className="shadow-[3px_3px_0_var(--ink)]">
            <Upload size={28} className="text-ink" aria-hidden="true" />
          </IconTile>
        </div>

        <h2 className="text-2xl md:text-3xl font-display text-ink mb-3">
          {isDragActive ? "Drop your image here!" : "Drag & Drop Image Here"}
        </h2>

        <p className="text-muted text-base md:text-lg mb-6 max-w-md mx-auto">
          Drop any photo or graphic here, or click anywhere to browse from your computer.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            Choose Image File
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateSample();
            }}
          >
            <Sparkles size={18} className="inline mr-2 text-ink" aria-hidden="true" />
            Try Sample Image
          </Button>
        </div>

        {errorMessage && (
          <div
            className="mb-6 p-4 rounded-xl bg-salmon/20 border-2 border-ink text-ink flex items-center justify-center gap-2 text-sm font-medium"
            role="alert"
          >
            <AlertCircle size={20} className="shrink-0 text-ink" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="pt-6 border-t-2 border-gray/80 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
          <Pill color="mint">
            <Shield size={14} className="inline mr-1 text-ink" aria-hidden="true" />
            100% Private Local WASM
          </Pill>
          <Pill color="lavender">
            <Zap size={14} className="inline mr-1 text-ink" aria-hidden="true" />
            Up to 50 MB
          </Pill>
          <Pill color="blue">PNG · JPEG · WebP · GIF</Pill>
        </div>
      </ClayCard>
    </div>
  );
}
