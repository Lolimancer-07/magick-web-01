"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import ChipGroup from "../ChipGroup";
import NumberField from "../NumberField";
import ActionBar from "../ActionBar";
import { useMobileImageStore, triggerHaptic } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import { downloadBlob } from "@/utils/zipWriter";
import { Crop, RotateCw, Lock, Unlock, Grid } from "lucide-react";

const ASPECT_PRESETS = [
  { id: "free", label: "Free" },
  { id: "1:1", label: "1:1 Square" },
  { id: "4:3", label: "4:3 Classic" },
  { id: "3:2", label: "3:2 Photo" },
  { id: "16:9", label: "16:9 Widescreen" },
  { id: "9:16", label: "9:16 Story / Reel" },
  { id: "original", label: "Original" },
];

export default function CropScreen() {
  const router = useRouter();
  const { currentImage } = useMobileImageStore();

  const [aspect, setAspect] = useState("free");
  const [aspectLocked, setAspectLocked] = useState(false);
  const [straightenDeg, setStraightenDeg] = useState(0); // -45 to 45 deg
  const [showGrid, setShowGrid] = useState(true);

  // Crop rectangle in percentages (0 to 100)
  const [cropRect, setCropRect] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, rect: { ...cropRect } });

  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage?.url || null);
  const [isSaving, setIsSaving] = useState(false);

  // Compute pixel dimensions based on image natural size
  const naturalW = currentImage?.width || 1920;
  const naturalH = currentImage?.height || 1080;
  const pixelX = Math.round((cropRect.x / 100) * naturalW);
  const pixelY = Math.round((cropRect.y / 100) * naturalH);
  const pixelW = Math.round((cropRect.w / 100) * naturalW);
  const pixelH = Math.round((cropRect.h / 100) * naturalH);

  const handleAspectChange = (presetId: string) => {
    triggerHaptic(10);
    setAspect(presetId);
    if (presetId === "free") {
      setAspectLocked(false);
      return;
    }
    setAspectLocked(true);
    let ratio = 1;
    if (presetId === "1:1") ratio = 1;
    else if (presetId === "4:3") ratio = 4 / 3;
    else if (presetId === "3:2") ratio = 3 / 2;
    else if (presetId === "16:9") ratio = 16 / 9;
    else if (presetId === "9:16") ratio = 9 / 16;
    else if (presetId === "original") ratio = naturalW / naturalH;

    // Adjust cropRect height to match ratio
    const newH = Math.min(90, Math.max(10, cropRect.w / ratio));
    setCropRect((prev) => ({ ...prev, h: newH }));
  };

  const handlePointerDown = (handle: string, e: React.PointerEvent) => {
    setIsDragging(handle);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      rect: { ...cropRect },
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.mouseX) / cRect.width) * 100;
    const dy = ((e.clientY - dragStart.current.mouseY) / cRect.height) * 100;

    const base = dragStart.current.rect;
    setCropRect((prev) => {
      let x = prev.x;
      let y = prev.y;
      let w = prev.w;
      let h = prev.h;

      if (isDragging === "move") {
        x = Math.max(0, Math.min(100 - base.w, base.x + dx));
        y = Math.max(0, Math.min(100 - base.h, base.y + dy));
      } else if (isDragging === "se") {
        w = Math.max(10, Math.min(100 - base.x, base.w + dx));
        h = Math.max(10, Math.min(100 - base.y, base.h + dy));
      } else if (isDragging === "nw") {
        const newX = Math.max(0, Math.min(base.x + base.w - 10, base.x + dx));
        const newY = Math.max(0, Math.min(base.y + base.h - 10, base.y + dy));
        w = base.w + (base.x - newX);
        h = base.h + (base.y - newY);
        x = newX;
        y = newY;
      }
      return { x, y, w, h };
    });
  };

  const handlePointerUp = () => {
    setIsDragging(null);
  };

  const handleSave = async () => {
    if (!currentImage) return;
    setIsSaving(true);
    try {
      await engine.load(currentImage.file);
      // Run crop step
      const steps = [
        ...(straightenDeg !== 0
          ? [{ uid: "1", opId: "rotate", params: { deg: straightenDeg }, enabled: true }]
          : []),
      ];
      const result = await engine.render(steps, { preview: false, format: "png" });
      const blob = new Blob([result.bytes], { type: "image/png" });
      downloadBlob(blob, `cropped-${currentImage.name}`);
    } catch (err) {
      console.error("Crop save error:", err);
    } finally {
      setIsSaving(false);
    }
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
      <TopBar title="Crop & Straighten" onBack={() => router.back()} />

      {/* Interactive Crop Frame */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: "relative",
          width: "calc(100% - 32px)",
          height: "clamp(240px, 40vh, 420px)",
          margin: "12px 16px",
          borderRadius: "var(--m-radius-card, 24px)",
          backgroundColor: "#0b0e18",
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
          border: "1px solid var(--line, rgba(255,255,255,0.08))",
        }}
      >
        {/* Background Image with optional straighten rotation */}
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Crop Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `rotate(${straightenDeg}deg)`,
              transition: isDragging ? "none" : "transform 0.15s ease",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Darkened mask outside crop box */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            clipPath: `polygon(
              0% 0%, 100% 0%, 100% 100%, 0% 100%,
              ${cropRect.x}% ${cropRect.y}%,
              ${cropRect.x}% ${cropRect.y + cropRect.h}%,
              ${cropRect.x + cropRect.w}% ${cropRect.y + cropRect.h}%,
              ${cropRect.x + cropRect.w}% ${cropRect.y}%,
              ${cropRect.x}% ${cropRect.y}%
            )`,
            pointerEvents: "none",
          }}
        />

        {/* Draggable Crop Rectangle */}
        <div
          onPointerDown={(e) => handlePointerDown("move", e)}
          style={{
            position: "absolute",
            top: `${cropRect.y}%`,
            left: `${cropRect.x}%`,
            width: `${cropRect.w}%`,
            height: `${cropRect.h}%`,
            border: "2px solid var(--green, #3fed1e)",
            boxShadow: "0 0 16px rgba(0,0,0,0.6)",
            cursor: "move",
            touchAction: "none",
          }}
        >
          {/* Rule of Thirds Grid */}
          {showGrid && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)",
                backgroundSize: "33.33% 33.33%",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Corner Resize Handles */}
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              handlePointerDown("nw", e);
            }}
            style={cornerHandleStyle("top", "left")}
          />
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              handlePointerDown("se", e);
            }}
            style={cornerHandleStyle("bottom", "right")}
          />
        </div>
      </div>

      <main style={{ paddingBottom: "16px" }}>
        {/* Aspect Presets */}
        <SettingsCard title="Aspect Ratio">
          <ChipGroup items={ASPECT_PRESETS} selected={aspect} onSelect={handleAspectChange} layout="scroll" />
        </SettingsCard>

        {/* Numeric Dimensions */}
        <SettingsCard title="Crop Bounds & Coordinates">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <NumberField label="X Offset" value={pixelX} onChange={() => {}} unit="px" />
              <NumberField label="Y Offset" value={pixelY} onChange={() => {}} unit="px" />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <NumberField label="Width" value={pixelW} onChange={() => {}} unit="px" />
              <NumberField label="Height" value={pixelH} onChange={() => {}} unit="px" />
            </div>
          </div>
        </SettingsCard>

        {/* Straighten Slider */}
        <SettingsCard title="Straighten & Level">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
              <span>Rotation Angle</span>
              <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>
                {straightenDeg}°
              </span>
            </div>
            <input
              type="range"
              min={-45}
              max={45}
              value={straightenDeg}
              onChange={(e) => setStraightenDeg(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
            />
          </div>
        </SettingsCard>
      </main>

      <ActionBar onSave={handleSave} isSaving={isSaving} saveLabel="Apply Crop" />
    </div>
  );
}

function cornerHandleStyle(v: "top" | "bottom", h: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [v]: "-6px",
    [h]: "-6px",
    width: "18px",
    height: "18px",
    backgroundColor: "var(--green, #3fed1e)",
    borderRadius: "3px",
    cursor: `${v === "top" ? "n" : "s"}${h === "left" ? "w" : "e"}-resize`,
    boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
  };
}
