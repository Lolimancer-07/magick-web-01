"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import ChipGroup from "../ChipGroup";
import QualitySlider from "../QualitySlider";
import ActionBar from "../ActionBar";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import { downloadBlob, createZip } from "@/utils/zipWriter";
import { RefreshCw, CheckCircle2 } from "lucide-react";

const FORMAT_OPTIONS = [
  { id: "webp", label: "WEBP (High Efficiency)" },
  { id: "jpg", label: "JPEG / JPG (Universal)" },
  { id: "png", label: "PNG (Lossless Alpha)" },
  { id: "avif", label: "AVIF (Next-Gen)" },
  { id: "bmp", label: "BMP (Windows Bitmap)" },
  { id: "tiff", label: "TIFF (Archive Print)" },
  { id: "ico", label: "ICO (Favicon)" },
  { id: "gif", label: "GIF (Graphic)" },
];

export default function FormatConversionScreen() {
  const router = useRouter();
  const { currentImage, batchImages } = useMobileImageStore();

  const files = batchImages.length > 0 ? batchImages : currentImage ? [currentImage] : [];

  const [targetFormat, setTargetFormat] = useState("webp");
  const [quality, setQuality] = useState(85);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const outputs: { name: string; data: Uint8Array }[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setStatusMsg(`Transcoding ${i + 1}/${files.length}: ${item.name}...`);
        await engine.load(item.file);
        const res = await engine.render([], {
          preview: false,
          format: targetFormat,
          quality,
        });
        const base = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
        outputs.push({
          name: `${base}.${targetFormat}`,
          data: new Uint8Array(res.bytes),
        });
      }

      if (outputs.length > 1) {
        const zip = createZip(outputs);
        downloadBlob(zip, `converted-${targetFormat}-batch-${Date.now()}.zip`);
        setStatusMsg(`Converted ${outputs.length} images to ${targetFormat.toUpperCase()}! Zip downloaded.`);
      } else if (outputs.length === 1) {
        const blob = new Blob([outputs[0].data as BlobPart], { type: `image/${targetFormat}` });
        downloadBlob(blob, outputs[0].name);
        setStatusMsg(`Converted to ${targetFormat.toUpperCase()}! File downloaded.`);
      }
    } catch (err: any) {
      console.error("Format conversion error:", err);
      setStatusMsg(`Error: ${err.message}`);
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
      <TopBar title="Format Conversion" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Target Format */}
        <SettingsCard title="Target Output Format">
          <ChipGroup
            items={FORMAT_OPTIONS}
            selected={targetFormat}
            onSelect={setTargetFormat}
            layout="wrap"
          />
        </SettingsCard>

        {/* Quality Slider (for lossy formats) */}
        {(targetFormat === "jpg" || targetFormat === "webp" || targetFormat === "avif") && (
          <SettingsCard title="Compression Quality">
            <QualitySlider value={quality} onChange={setQuality} />
          </SettingsCard>
        )}

        {/* Selected Files Count */}
        <SettingsCard title="Files to Transcode">
          <div style={{ fontSize: "14px", color: "var(--ink, #f2f4fb)" }}>
            <strong>{files.length}</strong> {files.length === 1 ? "file" : "files"} selected.
          </div>
        </SettingsCard>

        {statusMsg && (
          <div
            style={{
              margin: "0 16px",
              padding: "12px 16px",
              borderRadius: "14px",
              backgroundColor: "var(--green, #3fed1e)",
              color: "var(--green-ink, #07110a)",
              fontWeight: 700,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{statusMsg}</span>
          </div>
        )}
      </main>

      <ActionBar
        onSave={handleConvert}
        isSaving={isSaving}
        saveLabel={files.length > 1 ? `Convert All (${files.length})` : "Convert & Download"}
      />
    </div>
  );
}
