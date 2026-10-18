"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import NumberField from "../NumberField";
import ColorSwatches from "../ColorSwatches";
import ActionBar from "../ActionBar";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import { downloadBlob } from "@/utils/zipWriter";
import { LayoutGrid, Plus } from "lucide-react";

export default function CollageScreen() {
  const router = useRouter();
  const { batchImages, currentImage, addBatchImages } = useMobileImageStore();
  const files = batchImages.length > 0 ? batchImages : currentImage ? [currentImage] : [];

  const [layout, setLayout] = useState<"horizontal" | "vertical" | "grid">("horizontal");
  const [spacing, setSpacing] = useState(10);
  const [bgColor, setBgColor] = useState("#000000");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (files.length === 0) return;
    setIsSaving(true);
    try {
      await engine.load(files[0].file);
      const res = await engine.render([], { preview: false, format: "png" });
      const blob = new Blob([res.bytes], { type: "image/png" });
      downloadBlob(blob, `collage-${Date.now()}.png`);
    } catch (err) {
      console.error("Collage export error:", err);
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
      <TopBar title="Collage & Stitch (-append)" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Layout Style */}
        <SettingsCard title="Stitch Arrangement">
          <Segmented
            options={[
              { value: "horizontal", label: "Horizontal (+append)" },
              { value: "vertical", label: "Vertical (-append)" },
              { value: "grid", label: "Grid (-smush)" },
            ]}
            value={layout}
            onChange={(l) => setLayout(l as any)}
          />
        </SettingsCard>

        {/* Spacing & Background */}
        <SettingsCard title="Border & Spacing">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <NumberField label="Gap Spacing" value={spacing} min={0} max={64} onChange={setSpacing} unit="px" />
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)", marginBottom: "6px" }}>
                Border Fill Color
              </div>
              <ColorSwatches value={bgColor} onChange={setBgColor} showTransparent />
            </div>
          </div>
        </SettingsCard>

        {/* Selected Images */}
        <SettingsCard title={`Images (${files.length})`}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
            {files.map((img) => (
              <div
                key={img.id}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </SettingsCard>
      </main>

      <ActionBar onSave={handleSave} isSaving={isSaving} saveLabel="Stitch & Export" />
    </div>
  );
}
