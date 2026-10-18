"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import ActionBar from "../ActionBar";
import { useMobileImageStore, triggerHaptic } from "@/store/mobileImageStore";
import { ExifMetadata, parseJpegExif, editJpegExif } from "@/utils/losslessExif";
import { downloadBlob } from "@/utils/zipWriter";
import { FileCode, MapPin, CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";

export default function EditExifScreen() {
  const router = useRouter();
  const { currentImage } = useMobileImageStore();

  const [meta, setMeta] = useState<ExifMetadata>({
    dateTaken: new Date().toISOString().slice(0, 19).replace("T", " "),
    make: "Apple",
    model: "iPhone 15 Pro",
    lensModel: "24mm f/1.78",
    exposureTime: "1/120",
    fNumber: "f/1.8",
    iso: 100,
    orientation: 1,
    artist: "Magick Artist",
    copyright: "© 2026",
    description: "",
    gpsLatitude: 37.7749,
    gpsLongitude: -122.4194,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    if (currentImage) {
      currentImage.file.arrayBuffer().then((buf) => {
        try {
          const parsed = parseJpegExif(new Uint8Array(buf));
          if (Object.keys(parsed).length > 0) {
            setMeta((prev) => ({ ...prev, ...parsed }));
          }
        } catch {}
      });
    }
  }, [currentImage]);

  const handleRemoveLocation = () => {
    triggerHaptic(15);
    setMeta((prev) => ({ ...prev, gpsLatitude: undefined, gpsLongitude: undefined }));
  };

  const handleSave = async () => {
    if (!currentImage) return;
    triggerHaptic(20);
    setIsSaving(true);
    try {
      const buf = await currentImage.file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      // Lossless rewrite on JPEG
      const outputBytes = editJpegExif(bytes, meta);
      const blob = new Blob([outputBytes as BlobPart], { type: currentImage.type });
      downloadBlob(blob, `lossless-exif-${currentImage.name}`);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (err) {
      console.error("Lossless EXIF save error:", err);
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
      <TopBar title="Edit EXIF (Lossless)" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Notice of zero recompression */}
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
            <strong>Zero Pixel Recompression:</strong> EXIF metadata is edited directly in file header segments. Scan data DCT coefficients remain 100% byte-identical.
          </span>
        </div>

        {/* GPS Location Editor with Clear Location button */}
        <SettingsCard title="GPS Geolocation Metadata">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600 }}>
                <MapPin size={18} style={{ color: "var(--blue, #3089c5)" }} />
                <span>Location Coordinates</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveLocation}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(240, 64, 64, 0.15)",
                  color: "var(--red, #f04040)",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} />
                <span>Remove Location</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={meta.gpsLatitude ?? ""}
                  placeholder="e.g. 37.7749"
                  onChange={(e) => setMeta({ ...meta, gpsLatitude: parseFloat(e.target.value) || undefined })}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={meta.gpsLongitude ?? ""}
                  placeholder="e.g. -122.4194"
                  onChange={(e) => setMeta({ ...meta, gpsLongitude: parseFloat(e.target.value) || undefined })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Camera & Lens Details */}
        <SettingsCard title="Camera & Lens Tags">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>Make</span>
                <input
                  type="text"
                  value={meta.make || ""}
                  onChange={(e) => setMeta({ ...meta, make: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>Model</span>
                <input
                  type="text"
                  value={meta.model || ""}
                  onChange={(e) => setMeta({ ...meta, model: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <span style={labelStyle}>Lens Model</span>
              <input
                type="text"
                value={meta.lensModel || ""}
                onChange={(e) => setMeta({ ...meta, lensModel: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
        </SettingsCard>

        {/* Exposure Details */}
        <SettingsCard title="Exposure Parameters">
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>Shutter</span>
              <input
                type="text"
                value={meta.exposureTime || ""}
                onChange={(e) => setMeta({ ...meta, exposureTime: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>Aperture</span>
              <input
                type="text"
                value={meta.fNumber || ""}
                onChange={(e) => setMeta({ ...meta, fNumber: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>ISO</span>
              <input
                type="number"
                value={meta.iso || ""}
                onChange={(e) => setMeta({ ...meta, iso: parseInt(e.target.value, 10) || undefined })}
                style={inputStyle}
              />
            </div>
          </div>
        </SettingsCard>

        {/* Authorship & Rights */}
        <SettingsCard title="Copyright & Authorship">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <span style={labelStyle}>Artist / Creator</span>
              <input
                type="text"
                value={meta.artist || ""}
                onChange={(e) => setMeta({ ...meta, artist: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <span style={labelStyle}>Copyright Notice</span>
              <input
                type="text"
                value={meta.copyright || ""}
                onChange={(e) => setMeta({ ...meta, copyright: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <span style={labelStyle}>Image Description</span>
              <input
                type="text"
                value={meta.description || ""}
                onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
        </SettingsCard>

        {successNotice && (
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
            <span>EXIF tags saved losslessly! File downloaded.</span>
          </div>
        )}
      </main>

      <ActionBar onSave={handleSave} isSaving={isSaving} saveLabel="Save Lossless" />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--muted, #8a93b8)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  display: "block",
  marginBottom: "4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  backgroundColor: "var(--m-surface-2, #222a46)",
  border: "1px solid var(--line, rgba(255,255,255,0.08))",
  color: "var(--ink, #f2f4fb)",
  padding: "0 12px",
  fontSize: "14px",
  outline: "none",
};
