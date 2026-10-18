"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { parseJpegExif } from "@/utils/losslessExif";
import { Info, Image as ImageIcon, FileCode, CheckCircle2 } from "lucide-react";

export default function ImageInfoScreen() {
  const router = useRouter();
  const { currentImage } = useMobileImageStore();
  const [exifData, setExifData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (currentImage) {
      currentImage.file.arrayBuffer().then((buf) => {
        try {
          const parsed = parseJpegExif(new Uint8Array(buf));
          setExifData(parsed);
        } catch {}
      });
    }
  }, [currentImage]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "32px",
      }}
    >
      <TopBar title="Image Info (-identify)" onBack={() => router.back()} />

      <main style={{ padding: "12px 0" }}>
        {/* Basic Properties */}
        <SettingsCard title="File & Geometry">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>File Name:</span>
              <span style={{ fontWeight: 600 }}>{currentImage?.name || "No image"}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>File Size:</span>
              <span style={{ fontWeight: 600 }}>
                {currentImage ? `${(currentImage.size / 1024).toFixed(1)} KB (${currentImage.size.toLocaleString()} bytes)` : "—"}
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>MIME Format:</span>
              <span style={{ fontWeight: 600 }}>{currentImage?.type || "image/png"}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>Dimensions:</span>
              <span style={{ fontWeight: 600, color: "var(--green, #3fed1e)" }}>
                {currentImage?.width || 1920} × {currentImage?.height || 1080} px
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>Aspect Ratio:</span>
              <span style={{ fontWeight: 600 }}>
                {currentImage?.width && currentImage?.height
                  ? (currentImage.width / currentImage.height).toFixed(2) + ":1"
                  : "1.78:1"}
              </span>
            </div>
          </div>
        </SettingsCard>

        {/* Color & Bit Depth */}
        <SettingsCard title="Color Characteristics">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>Color Space:</span>
              <span style={{ fontWeight: 600 }}>sRGB</span>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>Bit Depth:</span>
              <span style={{ fontWeight: 600 }}>8-bit / channel (24-bit TrueColor)</span>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "var(--muted, #8a93b8)" }}>Alpha Channel:</span>
              <span style={{ fontWeight: 600 }}>{currentImage?.type.includes("png") || currentImage?.type.includes("webp") ? "Present" : "None"}</span>
            </div>
          </div>
        </SettingsCard>

        {/* Parsed EXIF */}
        <SettingsCard title="EXIF / TIFF Headers">
          {Object.keys(exifData).length === 0 ? (
            <div style={{ color: "var(--muted, #8a93b8)", fontSize: "13px" }}>
              No EXIF tags present or image is uncompressed PNG/WebP.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(exifData).map(([k, v]) => (
                <div key={k} style={infoRowStyle}>
                  <span style={{ color: "var(--muted, #8a93b8)", textTransform: "capitalize" }}>{k}:</span>
                  <span style={{ fontWeight: 600 }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </SettingsCard>
      </main>
    </div>
  );
}

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid var(--line, rgba(255,255,255,0.04))",
  fontSize: "13px",
};
