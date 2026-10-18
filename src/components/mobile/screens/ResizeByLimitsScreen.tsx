"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import NumberField from "../NumberField";
import QualitySlider from "../QualitySlider";
import ChipGroup from "../ChipGroup";
import ActionBar from "../ActionBar";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import { downloadBlob, createZip } from "@/utils/zipWriter";
import { Minimize2 } from "lucide-react";

export default function ResizeByLimitsScreen() {
  const router = useRouter();
  const { currentImage, batchImages } = useMobileImageStore();

  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [keepAspect, setKeepAspect] = useState(true);
  const [onlyShrink, setOnlyShrink] = useState(true); // -resize WxH>
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState("webp");
  const [isSaving, setIsSaving] = useState(false);

  const isBatch = batchImages.length > 1;

  const handleSave = async () => {
    if (!currentImage) return;
    setIsSaving(true);
    try {
      if (isBatch) {
        const outputs: { name: string; data: Uint8Array }[] = [];
        for (const item of batchImages) {
          await engine.load(item.file);
          const res = await engine.render([], { preview: false, format, quality });
          const base = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
          outputs.push({ name: `${base}-limited.${format}`, data: new Uint8Array(res.bytes) });
        }
        const zip = createZip(outputs);
        downloadBlob(zip, `magick-limits-${Date.now()}.zip`);
      } else {
        await engine.load(currentImage.file);
        const res = await engine.render([], { preview: false, format, quality });
        const blob = new Blob([res.bytes], { type: `image/${format}` });
        downloadBlob(blob, `limited-${currentImage.name}.${format}`);
      }
    } catch (err) {
      console.error("Resize limits error:", err);
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
      <TopBar title="Resize by Limits (-resize >)" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Maximum Dimensions */}
        <SettingsCard title="Bounding Box Limits">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <NumberField label="Max Width" value={maxWidth} min={1} max={99999} onChange={setMaxWidth} unit="px" />
              <NumberField label="Max Height" value={maxHeight} min={1} max={99999} onChange={setMaxHeight} unit="px" />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "6px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                color: "var(--green, #3fed1e)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                width: "fit-content",
              }}
            >
              <span>Command:</span>
              <code>{`-resize ${maxWidth}x${maxHeight}${onlyShrink ? ">" : ""}`}</code>
            </div>
          </div>
        </SettingsCard>

        {/* Toggles */}
        <SettingsCard title="Sizing Behavior">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>Only Shrink If Larger (&gt;)</div>
                <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                  Do not upscale if original image is smaller than bounding box
                </div>
              </div>
              <input
                type="checkbox"
                checked={onlyShrink}
                onChange={(e) => setOnlyShrink(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--green, #3fed1e)" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>Keep Aspect Ratio</div>
                <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                  Fit proportionally inside bounds without stretching
                </div>
              </div>
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={(e) => setKeepAspect(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--green, #3fed1e)" }}
              />
            </label>
          </div>
        </SettingsCard>

        {/* Format & Quality */}
        <SettingsCard title="Export Quality & Format">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <QualitySlider value={quality} onChange={setQuality} />
            <ChipGroup
              items={[
                { id: "webp", label: "WEBP" },
                { id: "jpg", label: "JPG" },
                { id: "png", label: "PNG" },
                { id: "avif", label: "AVIF" },
              ]}
              selected={format}
              onSelect={setFormat}
              layout="scroll"
            />
          </div>
        </SettingsCard>
      </main>

      <ActionBar
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel={isBatch ? `Apply Limits to All (${batchImages.length})` : "Apply & Save"}
      />
    </div>
  );
}
