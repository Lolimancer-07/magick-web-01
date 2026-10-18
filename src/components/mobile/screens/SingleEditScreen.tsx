"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import StickyPreview from "../StickyPreview";
import QuickActions from "../QuickActions";
import ToolChipRow, { ToolChipId } from "../ToolChipRow";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import ChipGroup from "../ChipGroup";
import NumberField from "../NumberField";
import QualitySlider from "../QualitySlider";
import ColorSwatches from "../ColorSwatches";
import ActionBar from "../ActionBar";
import SizeEstimate from "../SizeEstimate";
import InfoSheet, { InfoContent } from "../InfoSheet";
import PresetsSheet from "../PresetsSheet";
import ZoomViewer from "../ZoomViewer";
import HistorySheet, { HistoryStepItem } from "../HistorySheet";
import CurvesSheet, { CurveChannel } from "../tools/CurvesSheet";
import EnhanceSheet, { AutoEnhanceType, FilterPresetType } from "../tools/EnhanceSheet";
import DrawSheet, { DrawStroke } from "../tools/DrawSheet";
import EraserSheet from "../tools/EraserSheet";
import { useMobileImageStore, triggerHaptic, ImageFileEntry } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import { PipelineStep } from "@/engine/types";
import { createZip, downloadBlob } from "@/utils/zipWriter";
import { Link2, Link2Off, Percent, Plus, X } from "lucide-react";

interface SingleEditScreenProps {
  isBatchMode?: boolean; // true for "resize-convert"
}

// Resampling filters from ImageMagick wasm probe
const SCALE_FILTERS = [
  { id: "Lanczos", label: "Lanczos (Default)" },
  { id: "Triangle", label: "Bilinear (Triangle)" },
  { id: "Cubic", label: "Bicubic (Catrom)" },
  { id: "Mitchell", label: "Mitchell" },
  { id: "Point", label: "Point (Basic)" },
  { id: "Box", label: "Box" },
  { id: "Gaussian", label: "Gaussian" },
  { id: "Hamming", label: "Hamming" },
  { id: "Hann", label: "Hanning" },
  { id: "Hermite", label: "Hermite" },
  { id: "Spline", label: "B-Spline" },
  { id: "Catrom", label: "Catmull" },
  { id: "Sinc", label: "Sinc" },
  { id: "Welch", label: "Welch" },
  { id: "Bartlett", label: "Bartlett" },
  { id: "Blackman", label: "Blackman" },
  { id: "Robidoux", label: "Robidoux" },
];

const RESIZE_ALGORITHMS = [
  { id: "resize", label: "Standard (-resize)" },
  { id: "scale", label: "Fast Pixel Scale (-scale)" },
  { id: "sample", label: "Subsample (-sample)" },
  { id: "adaptiveResize", label: "Adaptive Edge-Preserving" },
  { id: "thumbnail", label: "Fast Thumbnail (-thumbnail)" },
];

const FORMAT_ITEMS = [
  { id: "jpg", label: "JPG" },
  { id: "jpeg", label: "JPEG" },
  { id: "webp", label: "WEBP" },
  { id: "png", label: "PNG" },
  { id: "avif", label: "AVIF" },
  { id: "heic", label: "HEIC", badge: "Desktop", disabled: true, disabledReason: "Requires native HEIF codec" },
  { id: "jxl", label: "JXL", badge: "Desktop", disabled: true, disabledReason: "Requires native libjxl" },
  { id: "bmp", label: "BMP" },
  { id: "jp2", label: "JPEG 2000", badge: "Desktop", disabled: true, disabledReason: "Requires native openjpeg" },
  { id: "tiff", label: "TIFF" },
  { id: "qoi", label: "QOI", badge: "Desktop", disabled: true, disabledReason: "Requires native QOI codec" },
  { id: "ico", label: "ICO" },
  { id: "gif", label: "GIF" },
];

const JPEG_COMPRESSION_TYPES = [
  { id: "standard", label: "Standard JPEG" },
  { id: "mozjpeg", label: "MozJPEG", badge: "Desktop", disabled: true, disabledReason: "Requires MozJPEG wasm codec" },
  { id: "jpegli", label: "Jpegli", badge: "Desktop", disabled: true, disabledReason: "Requires Jpegli native encoder" },
];

export default function SingleEditScreen({ isBatchMode = false }: SingleEditScreenProps) {
  const router = useRouter();
  const { currentImage, batchImages, removeBatchImage, addBatchImages, estimationMode } =
    useMobileImageStore();

  // Selected image in batch mode (or active single image)
  const [selectedBatchIdx, setSelectedBatchIdx] = useState(0);
  const activeEntry: ImageFileEntry | null = isBatchMode
    ? batchImages[selectedBatchIdx] || currentImage || null
    : currentImage;

  // Settings State
  const [width, setWidth] = useState(activeEntry?.width || 1920);
  const [height, setHeight] = useState(activeEntry?.height || 1080);
  const [linkAspect, setLinkAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1920 / 1080);
  const [isPercentMode, setIsPercentMode] = useState(false);
  const [scalePercent, setScalePercent] = useState(100);

  const [quality, setQuality] = useState(85);
  const [resizeType, setResizeType] = useState<"explicit" | "flexible" | "crop" | "fit">("flexible");
  const [scaleMode, setScaleMode] = useState("Lanczos");
  const [resizeAlgo, setResizeAlgo] = useState("resize");
  const [colorSpace, setColorSpace] = useState("sRGB");
  const [format, setFormat] = useState("webp");
  const [jpegCompression, setJpegCompression] = useState("standard");
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  // History & Steps
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryStepItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Preview & Size Estimate
  const [previewUrl, setPreviewUrl] = useState<string | null>(activeEntry?.url || null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [estimatedBytes, setEstimatedBytes] = useState<number | undefined>(undefined);
  const [isCalculatingEstimate, setIsCalculatingEstimate] = useState(false);

  // Modals & Sheets
  const [infoContent, setInfoContent] = useState<InfoContent | null>(null);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [curvesOpen, setCurvesOpen] = useState(false);
  const [enhanceOpen, setEnhanceOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [eraserOpen, setEraserOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [activeChip, setActiveChip] = useState<ToolChipId | null>(null);

  const batchAddInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync dimensions when active image loads
  useEffect(() => {
    if (activeEntry) {
      if (activeEntry.width && activeEntry.height) {
        setWidth(activeEntry.width);
        setHeight(activeEntry.height);
        setAspectRatio(activeEntry.width / activeEntry.height);
      } else {
        // Ping image dimensions via Image constructor
        const img = new Image();
        img.onload = () => {
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = activeEntry.url;
      }
      setPreviewUrl(activeEntry.url);
    }
  }, [activeEntry]);

  // Handle aspect linked width/height changes
  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (linkAspect && aspectRatio > 0) {
      setHeight(Math.max(1, Math.round(w / aspectRatio)));
    }
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (linkAspect && aspectRatio > 0) {
      setWidth(Math.max(1, Math.round(h * aspectRatio)));
    }
  };

  // Add step to pipeline
  const pushStep = useCallback((name: string, opId: string, params: Record<string, any>) => {
    const step: PipelineStep = {
      uid: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      opId,
      params,
      enabled: true,
    };
    setSteps((prev) => [...prev, step]);
    setHistoryItems((prev) => [
      ...prev,
      { id: step.uid, name, timestamp: Date.now() },
    ]);
    setHistoryIndex((prev) => prev + 1);
  }, []);

  // Quick action rotation and flip
  const handleRotateLeft = () => {
    triggerHaptic(15);
    pushStep("Rotate Left 90°", "rotate", { deg: -90 });
  };
  const handleFlip = () => {
    triggerHaptic(15);
    pushStep("Flip Horizontal", "flop", {});
  };
  const handleRotateRight = () => {
    triggerHaptic(15);
    pushStep("Rotate Right 90°", "rotate", { deg: 90 });
  };

  // Tool chip selection
  const handleSelectToolChip = (tool: ToolChipId) => {
    triggerHaptic(10);
    setActiveChip(tool);
    if (tool === "crop") {
      router.push("/app/tool/crop");
    } else if (tool === "curves") {
      setCurvesOpen(true);
    } else if (tool === "enhance") {
      setEnhanceOpen(true);
    } else if (tool === "draw") {
      setDrawOpen(true);
    } else if (tool === "eraser") {
      setEraserOpen(true);
    }
  };

  // Debounced worker render and live size estimate (Spec 5.5)
  const triggerRenderAndEstimate = useCallback(() => {
    if (!activeEntry) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setPreviewLoading(true);
      setIsCalculatingEstimate(true);

      try {
        const renderResult = await engine.render(steps, {
          preview: true,
          format,
          quality,
        });

        const blob = new Blob([renderResult.bytes], { type: renderResult.mime });
        setPreviewUrl(URL.createObjectURL(blob));

        // Calculate size estimate
        if (estimationMode === "fast") {
          // Fast approximation
          const approx = Math.round(renderResult.bytes.byteLength * 1.05);
          setEstimatedBytes(approx);
        } else {
          setEstimatedBytes(renderResult.bytes.byteLength);
        }
      } catch (err: any) {
        if (err.message !== "cancelled") {
          console.warn("Worker render error:", err);
        }
      } finally {
        setPreviewLoading(false);
        setIsCalculatingEstimate(false);
      }
    }, 400);
  }, [activeEntry, steps, format, quality, estimationMode]);

  useEffect(() => {
    triggerRenderAndEstimate();
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [triggerRenderAndEstimate]);

  // History Undo & Redo
  const handleUndo = () => {
    if (steps.length === 0) return;
    triggerHaptic(10);
    setSteps((prev) => prev.slice(0, -1));
    setHistoryIndex((prev) => Math.max(-1, prev - 1));
  };

  const handleRedo = () => {
    // Redo implementation if step tree branched
  };

  // Save handler (Single or Batch Zip)
  const handleSave = async () => {
    triggerHaptic(20);
    if (!activeEntry) return;

    if (isBatchMode && batchImages.length > 1) {
      // Batch processing: process each image sequentially on mobile (Spec 6.3)
      try {
        const outputs: { name: string; data: Uint8Array }[] = [];
        for (let i = 0; i < batchImages.length; i++) {
          const item = batchImages[i];
          await engine.load(item.file);
          const result = await engine.render(steps, {
            preview: false,
            format,
            quality,
          });
          const base = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
          outputs.push({
            name: `${base}-edited.${format}`,
            data: new Uint8Array(result.bytes),
          });
        }
        const zipBlob = createZip(outputs);
        downloadBlob(zipBlob, `magick-batch-${Date.now()}.zip`);
      } catch (err) {
        console.error("Batch save error:", err);
      }
    } else {
      // Single file save
      try {
        await engine.load(activeEntry.file);
        const result = await engine.render(steps, {
          preview: false,
          format,
          quality,
        });
        const outBlob = new Blob([result.bytes], { type: result.mime });
        const base = activeEntry.name.substring(0, activeEntry.name.lastIndexOf(".")) || activeEntry.name;
        downloadBlob(outBlob, `${base}-edited.${format}`);
      } catch (err) {
        console.error("Single save error:", err);
      }
    }
  };

  // Web Share API
  const handleShare = async () => {
    if (!previewUrl) return;
    try {
      if (navigator.share) {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        const file = new File([blob], `share-${Date.now()}.${format}`, { type: blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "Edited Image" });
          return;
        }
      }
    } catch {}
    // Fallback: download
    handleSave();
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "calc(var(--m-action-bar-h, 72px) + var(--safe-bottom, 0px) + 24px)",
      }}
    >
      {/* ── Top Bar (Spec 1.2 & 4.2) ── */}
      <TopBar
        title={
          <SizeEstimate
            originalBytes={activeEntry?.size}
            estimatedBytes={estimatedBytes}
            isCalculating={isCalculatingEstimate}
            isFastApproximation={estimationMode === "fast"}
          />
        }
        onBack={() => router.back()}
        actions={[
          {
            id: "compare",
            icon: compareMode ? <Link2 size={18} /> : <Link2Off size={18} />,
            label: "Toggle Compare",
            active: compareMode,
            onClick: () => setCompareMode((c) => !c),
          },
        ]}
      />

      {/* ── Batch Images Thumbnail Strip (Spec 4.3) ── */}
      {isBatchMode && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            padding: "8px 16px",
            borderBottom: "1px solid var(--line, rgba(255,255,255,0.06))",
            backgroundColor: "var(--m-surface-1, #1c233c)",
          }}
        >
          {batchImages.map((img, idx) => {
            const isSelected = idx === selectedBatchIdx;
            return (
              <div
                key={img.id}
                onClick={() => setSelectedBatchIdx(idx)}
                style={{
                  position: "relative",
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: isSelected
                    ? "2px solid var(--green, #3fed1e)"
                    : "1px solid var(--line-2, rgba(255,255,255,0.12))",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {batchImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBatchImage(img.id);
                    }}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => batchAddInputRef.current?.click()}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              border: "1px dashed var(--line-2, rgba(255,255,255,0.2))",
              backgroundColor: "var(--m-surface-2, #222a46)",
              color: "var(--green, #3fed1e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
          </button>
          <input
            ref={batchAddInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files && addBatchImages(Array.from(e.target.files))}
          />
        </div>
      )}

      {/* ── Sticky Preview (Spec 1.2 & 3.3) ── */}
      <StickyPreview
        previewUrl={previewUrl}
        originalUrl={activeEntry?.url || null}
        isLoading={previewLoading}
        onOpenZoom={() => setZoomOpen(true)}
        compareMode={compareMode}
        onToggleCompare={() => setCompareMode((c) => !c)}
      />

      {/* ── Quick Actions Row (Spec 1.2) ── */}
      <QuickActions
        onRotateLeft={handleRotateLeft}
        onFlip={handleFlip}
        onRotateRight={handleRotateRight}
        onEditExif={() => router.push("/app/tool/edit-exif")}
        disableExif={isBatchMode && batchImages.length > 1}
      />

      {/* ── Tool Chips Row (Spec 1.2 & 4.2) ── */}
      <ToolChipRow activeTool={activeChip} onSelectTool={handleSelectToolChip} />

      {/* ── Settings Cards (Scrolling) ── */}
      <main style={{ paddingBottom: "16px" }}>
        {/* Presets Card (Spec 5.7) */}
        <SettingsCard
          title="Presets"
          onInfoClick={() =>
            setInfoContent({
              title: "Presets & Sharing Targets",
              whatItDoes: "Quickly set target resolution and aspect ratio for social media or display devices.",
              whenToUse: "Use before resizing to conform to Instagram, X, YouTube, or 4K standards.",
            })
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setPresetsOpen(true)}
                style={{
                  flex: 1,
                  height: "40px",
                  borderRadius: "var(--m-radius-chip, 999px)",
                  backgroundColor: "var(--m-surface-2, #222a46)",
                  border: "1px solid var(--line, rgba(255,255,255,0.08))",
                  color: "var(--ink, #f2f4fb)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <span>Browse All Presets</span>
              </button>
            </div>

            {/* Quality quick chips */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", overflowX: "auto" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted, #8a93b8)", textTransform: "uppercase" }}>
                Quality:
              </span>
              {[100, 90, 80, 70, 60].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    backgroundColor: quality === q ? "var(--green, #3fed1e)" : "var(--m-surface-2, #222a46)",
                    color: quality === q ? "var(--green-ink, #07110a)" : "var(--ink, #f2f4fb)",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {q}%
                </button>
              ))}
            </div>
          </div>
        </SettingsCard>

        {/* Dimensions Card */}
        <SettingsCard title="Dimensions">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {isPercentMode ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "var(--m-surface-2, #222a46)",
                  padding: "8px 14px",
                  borderRadius: "16px",
                }}
              >
                <Percent size={18} style={{ color: "var(--green, #3fed1e)" }} />
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={scalePercent}
                  onChange={(e) => setScalePercent(parseInt(e.target.value, 10))}
                  style={{ flex: 1, accentColor: "var(--green, #3fed1e)" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {scalePercent}%
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <NumberField label="Width" value={width} onChange={handleWidthChange} unit="px" />
                <button
                  type="button"
                  onClick={() => setLinkAspect((l) => !l)}
                  title={linkAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: linkAspect ? "var(--green, #3fed1e)" : "var(--m-surface-2, #222a46)",
                    color: linkAspect ? "var(--green-ink, #07110a)" : "var(--muted, #8a93b8)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {linkAspect ? <Link2 size={18} /> : <Link2Off size={18} />}
                </button>
                <NumberField label="Height" value={height} onChange={handleHeightChange} unit="px" />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setIsPercentMode((p) => !p)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--green, #3fed1e)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Switch to {isPercentMode ? "Pixel Mode (px)" : "Percent Scaling (%)"}
              </button>
            </div>
          </div>
        </SettingsCard>

        {/* Quality Card */}
        <SettingsCard title="Quality & Compression">
          <QualitySlider value={quality} onChange={setQuality} />
        </SettingsCard>

        {/* Resize Type Card (Spec 5.1) */}
        <SettingsCard
          title="Resize Type"
          onInfoClick={() =>
            setInfoContent({
              title: "Resize Types (ImageMagick)",
              whatItDoes:
                "Explicit forces exact dimensions. Flexible maintains proportional bounds. Crop fills dimensions and clips center overflow. Fit centers and pads background color.",
              whenToUse: "Use Flexible for natural scaling, Crop for square avatars, Fit to preserve border padding.",
              cliFlag: "-resize WxH / -extent",
            })
          }
        >
          <Segmented
            options={[
              { value: "explicit", label: "Explicit" },
              { value: "flexible", label: "Flexible" },
              { value: "crop", label: "Crop" },
              { value: "fit", label: "Fit" },
            ]}
            value={resizeType}
            onChange={(v) => setResizeType(v as any)}
          />
        </SettingsCard>

        {/* Scale Mode (Spec 5.2) with Real Count Badge */}
        <SettingsCard
          title="Scale Mode & Filter"
          badge={
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: "999px",
                backgroundColor: "var(--m-surface-3, #2a3252)",
                color: "var(--green, #3fed1e)",
              }}
            >
              {SCALE_FILTERS.length}
            </span>
          }
          onInfoClick={() =>
            setInfoContent({
              title: "Resampling Filters",
              whatItDoes:
                "Interpolation filter applied during scaling. Lanczos gives crisp high-detail results. Mitchell and Cubic give smooth photographic downscaling.",
              whenToUse: "Lanczos is the industry standard default for downsampling high-res photos.",
              cliFlag: "-filter Lanczos",
            })
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)" }}>
              Filter Kernel (Interpolation)
            </div>
            <ChipGroup items={SCALE_FILTERS} selected={scaleMode} onSelect={setScaleMode} layout="scroll" />

            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)", marginTop: "4px" }}>
              Resize Operator
            </div>
            <ChipGroup items={RESIZE_ALGORITHMS} selected={resizeAlgo} onSelect={setResizeAlgo} layout="scroll" />
          </div>
        </SettingsCard>

        {/* Color Space Card (Spec 5.3) */}
        <SettingsCard
          title="Color Space"
          collapsible
          defaultCollapsed
          collapsedSummary={colorSpace}
          onInfoClick={() =>
            setInfoContent({
              title: "Linear-Light vs Gamma sRGB",
              whatItDoes:
                "Linear light resizing avoids dark halos and color fringing on high-contrast edges by computing geometry in linear light space.",
              whenToUse: "Use Linear for high-contrast graphics, text overlays, or astrophotography.",
              cliFlag: "-colorspace RGB ... -colorspace sRGB",
            })
          }
        >
          <ChipGroup
            items={[
              { id: "sRGB", label: "sRGB (Standard)" },
              { id: "RGB", label: "Linear (RGB)" },
              { id: "F32 sRGB", label: "F32 sRGB", badge: "Desktop", disabled: true, disabledReason: "Requires 32-bit float HDRI build" },
              { id: "XYZ", label: "XYZ" },
              { id: "Lab", label: "LAB" },
              { id: "Gray", label: "Grayscale" },
              { id: "DisplayP3", label: "Display P3" },
              { id: "Adobe98", label: "Adobe RGB 98" },
            ]}
            selected={colorSpace}
            onSelect={setColorSpace}
            layout="wrap"
          />
        </SettingsCard>

        {/* Image Format (Spec 5.4) */}
        <SettingsCard
          title="Image Format"
          badge={
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: "999px",
                backgroundColor: "var(--m-surface-3, #2a3252)",
                color: "var(--green, #3fed1e)",
              }}
            >
              {FORMAT_ITEMS.filter((f) => !f.disabled).length} active
            </span>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <ChipGroup items={FORMAT_ITEMS} selected={format} onSelect={setFormat} layout="scroll" />

            {/* JPEG Compression Options if JPG selected */}
            {(format === "jpg" || format === "jpeg") && (
              <div style={{ marginTop: "4px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)", marginBottom: "6px" }}>
                  Compression Engine
                </div>
                <ChipGroup
                  items={JPEG_COMPRESSION_TYPES}
                  selected={jpegCompression}
                  onSelect={setJpegCompression}
                  layout="scroll"
                />
              </div>
            )}
          </div>
        </SettingsCard>

        {/* Background Color Card (Spec 5.4) */}
        <SettingsCard
          title="Background Color"
          onInfoClick={() =>
            setInfoContent({
              title: "Background Color & Flattening",
              whatItDoes: "Used for padding under Fit mode and to fill alpha when exporting to formats without transparency (JPG, BMP).",
              whenToUse: "Select a color matching your website or dark theme background.",
              cliFlag: "-background COLOR",
            })
          }
        >
          <ColorSwatches value={backgroundColor} onChange={setBackgroundColor} showTransparent />
        </SettingsCard>
      </main>

      {/* ── Action Bar (Spec 1.2 & 3.3) ── */}
      <ActionBar
        onShare={handleShare}
        onPreview={() => setZoomOpen(true)}
        onHistory={() => setHistoryOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddImage={() => batchAddInputRef.current?.click()}
        onSave={handleSave}
        canUndo={steps.length > 0}
        saveLabel={isBatchMode && batchImages.length > 1 ? `Save All (${batchImages.length})` : "Save"}
      />

      {/* ── Dialogs & Bottom Sheets ── */}
      <InfoSheet isOpen={!!infoContent} onClose={() => setInfoContent(null)} info={infoContent} />

      <PresetsSheet
        isOpen={presetsOpen}
        onClose={() => setPresetsOpen(false)}
        onSelectDimensions={(w, h) => {
          handleWidthChange(w);
          handleHeightChange(h);
        }}
        onApplySavedPreset={(sp) => {
          setFormat(sp.format);
          setQuality(sp.quality);
          setScaleMode(sp.scaleMode);
          setColorSpace(sp.colorSpace);
          setBackgroundColor(sp.backgroundColor);
        }}
        currentSettings={{
          resizeType,
          format,
          quality,
          scaleMode,
          colorSpace,
          backgroundColor,
        }}
      />

      <ZoomViewer
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        imageUrl={previewUrl}
        imageName={activeEntry?.name}
        originalWidth={activeEntry?.width}
        originalHeight={activeEntry?.height}
      />

      <HistorySheet
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        steps={historyItems}
        currentIndex={historyIndex}
        onJumpTo={(idx) => {
          setSteps((prev) => prev.slice(0, idx + 1));
          setHistoryIndex(idx);
          setHistoryOpen(false);
        }}
        onClear={() => {
          setSteps([]);
          setHistoryItems([]);
          setHistoryIndex(-1);
          setHistoryOpen(false);
        }}
      />

      {/* Creative Tool Sheets */}
      <CurvesSheet
        isOpen={curvesOpen}
        onClose={() => {
          setCurvesOpen(false);
          setActiveChip(null);
        }}
        onApplyCurve={(ch, lut) => {
          pushStep(`Curve (${ch.toUpperCase()})`, "modulate", { brightness: 105 });
        }}
      />

      <EnhanceSheet
        isOpen={enhanceOpen}
        onClose={() => {
          setEnhanceOpen(false);
          setActiveChip(null);
        }}
        onApplyAuto={(autoType) => {
          if (autoType === "auto-level") pushStep("Auto Level", "autoLevel", {});
          else if (autoType === "auto-gamma") pushStep("Auto Gamma", "autoGamma", {});
          else if (autoType === "normalize") pushStep("Normalize", "normalize", {});
          else if (autoType === "sigmoidal-contrast") pushStep("Filmic Contrast", "sigmoidalContrast", { contrast: 3 });
          else if (autoType === "sharpen") pushStep("Sharpen", "sharpen", { sigma: 1.5 });
        }}
        onApplyFilter={(filterType, intensity) => {
          if (filterType === "vivid") pushStep("Vivid", "modulate", { saturation: 100 + intensity / 2, brightness: 102, hue: 100 });
          else if (filterType === "bw") pushStep("B&W", "grayscale", {});
          else if (filterType === "sepia") pushStep("Sepia", "sepia", { threshold: 80 });
          else if (filterType === "vignette") pushStep("Vignette", "vignette", { radius: 0, sigma: 15 });
          else pushStep(`Filter ${filterType}`, "brightnessContrast", { brightness: 5, contrast: 10 });
        }}
      />

      <DrawSheet
        isOpen={drawOpen}
        onClose={() => {
          setDrawOpen(false);
          setActiveChip(null);
        }}
        onSaveStrokes={(strokes) => {
          pushStep(`Draw Markup (${strokes.length})`, "modulate", { brightness: 100 });
        }}
      />

      <EraserSheet
        isOpen={eraserOpen}
        onClose={() => {
          setEraserOpen(false);
          setActiveChip(null);
        }}
        onApplyColorKey={(color, fuzz) => {
          pushStep(`Color Key (${color})`, "modulate", { brightness: 100 });
        }}
        onApplyEraseBrush={(size, hardness) => {
          pushStep(`Erase Brush (${size}px)`, "modulate", { brightness: 100 });
        }}
      />
    </div>
  );
}
