"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import ActionBar from "../ActionBar";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { deleteJpegExif, deletePngMetadata, deleteWebpMetadata, DeleteExifMode } from "@/utils/losslessExif";
import { downloadBlob, createZip } from "@/utils/zipWriter";
import { ShieldAlert, ShieldCheck, MapPin, EyeOff, Layers, CheckCircle2 } from "lucide-react";

export default function DeleteExifScreen() {
  const router = useRouter();
  const { currentImage, batchImages } = useMobileImageStore();

  const [mode, setMode] = useState<DeleteExifMode>("all");
  const [preserveOrientation, setPreserveOrientation] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const imagesToProcess = batchImages.length > 0 ? batchImages : currentImage ? [currentImage] : [];

  const handleSave = async () => {
    if (imagesToProcess.length === 0) return;
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const outputs: { name: string; data: Uint8Array }[] = [];

      for (const item of imagesToProcess) {
        const buf = await item.file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let cleaned: Uint8Array;

        const mime = item.type || "image/jpeg";
        if (mime.includes("png")) {
          cleaned = deletePngMetadata(bytes);
        } else if (mime.includes("webp")) {
          cleaned = deleteWebpMetadata(bytes);
        } else {
          // Default JPEG
          cleaned = deleteJpegExif(bytes, mode, preserveOrientation);
        }

        const base = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
        const ext = item.name.split(".").pop() || "jpg";
        outputs.push({
          name: `${base}-clean.${ext}`,
          data: cleaned,
        });
      }

      if (outputs.length > 1) {
        const zip = createZip(outputs);
        downloadBlob(zip, `metadata-stripped-${Date.now()}.zip`);
        setStatusMsg(`Successfully stripped metadata from ${outputs.length} images! Zip downloaded.`);
      } else if (outputs.length === 1) {
        const blob = new Blob([outputs[0].data as BlobPart], { type: imagesToProcess[0].type });
        downloadBlob(blob, outputs[0].name);
        setStatusMsg("Successfully stripped metadata losslessly! Downloaded.");
      }
    } catch (err: any) {
      console.error("Delete EXIF error:", err);
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
      <TopBar title="Delete EXIF & Metadata" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Lossless Notice */}
        <div
          style={{
            margin: "0 16px 12px",
            padding: "12px 14px",
            borderRadius: "16px",
            backgroundColor: "rgba(63, 237, 30, 0.12)",
            border: "1px solid rgba(63, 237, 30, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--green, #3fed1e)",
            fontSize: "13px",
          }}
        >
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>Lossless Processing:</strong> Strips metadata segments from JPEG APP markers, PNG chunks, and WebP RIFF without re-encoding pixel scanlines.
          </span>
        </div>

        {/* Scope selector */}
        <SettingsCard title="Removal Scope">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Segmented
              options={[
                { value: "all", label: "All Metadata" },
                { value: "onlyGps", label: "Only GPS" },
                { value: "onlyExifKeepIcc", label: "EXIF (Keep ICC)" },
              ]}
              value={mode}
              onChange={(m) => setMode(m as any)}
            />

            <div style={{ fontSize: "13px", color: "var(--muted, #8a93b8)", lineHeight: 1.5 }}>
              {mode === "all" && "Strips EXIF, XMP, IPTC, and color profiles. Maximum privacy."}
              {mode === "onlyGps" && "Leaves camera settings and date intact while erasing latitude, longitude, and elevation."}
              {mode === "onlyExifKeepIcc" && "Strips camera and device tags but keeps the ICC Color Profile so color vibrancy is preserved."}
            </div>
          </div>
        </SettingsCard>

        {/* Orientation Preservation */}
        <SettingsCard title="Orientation Preservation">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>Preserve Rotation Tag</div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                Prevents portrait photos from flipping sideways when EXIF is stripped
              </div>
            </div>
            <input
              type="checkbox"
              checked={preserveOrientation}
              onChange={(e) => setPreserveOrientation(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "var(--green, #3fed1e)" }}
            />
          </label>
        </SettingsCard>

        {/* File Count */}
        <SettingsCard title="Selected Files">
          <div style={{ fontSize: "14px", color: "var(--ink, #f2f4fb)" }}>
            <strong>{imagesToProcess.length}</strong> {imagesToProcess.length === 1 ? "file" : "files"} ready to process.
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
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel={imagesToProcess.length > 1 ? `Delete EXIF (${imagesToProcess.length})` : "Delete EXIF Losslessly"}
      />
    </div>
  );
}
