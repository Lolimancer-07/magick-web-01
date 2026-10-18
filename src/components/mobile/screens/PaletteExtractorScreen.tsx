"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { Copy, Check, Pipette } from "lucide-react";

interface ColorSwatch {
  hex: string;
  rgb: string;
  percent: number;
}

export default function PaletteExtractorScreen() {
  const router = useRouter();
  const { currentImage } = useMobileImageStore();
  const [swatches, setSwatches] = useState<ColorSwatch[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!currentImage) return;

    // Extract dominant palette using HTML5 Canvas pixel sampling
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const imgData = ctx.getImageData(0, 0, 100, 100).data;

      // Color quantization / bucket sampling
      const colorCounts = new Map<string, { r: number; g: number; b: number; count: number }>();
      const totalPixels = 100 * 100;

      for (let i = 0; i < imgData.length; i += 16) { // sample step
        const r = Math.round(imgData[i] / 32) * 32;
        const g = Math.round(imgData[i + 1] / 32) * 32;
        const b = Math.round(imgData[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        const item = colorCounts.get(key) || { r, g, b, count: 0 };
        item.count++;
        colorCounts.set(key, item);
      }

      const sorted = Array.from(colorCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const totalCount = sorted.reduce((sum, c) => sum + c.count, 0) || 1;

      const results: ColorSwatch[] = sorted.map((c) => {
        const hex =
          "#" +
          [c.r, c.g, c.b]
            .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
            .join("");
        return {
          hex,
          rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
          percent: Math.round((c.count / totalCount) * 100),
        };
      });

      setSwatches(results);
    };
    img.src = currentImage.url;
  }, [currentImage]);

  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "32px",
      }}
    >
      <TopBar title="Palette Extractor (-colors)" onBack={() => router.back()} />

      <main style={{ padding: "12px 0" }}>
        {/* Color Palette Bar */}
        <SettingsCard title="Dominant Palette">
          {swatches.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted, #8a93b8)", padding: "16px 0" }}>
              Analyzing color clusters...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Horizontal Palette Strip */}
              <div
                style={{
                  height: "48px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  border: "1px solid var(--line-2, rgba(255,255,255,0.14))",
                }}
              >
                {swatches.map((s) => (
                  <div
                    key={s.hex}
                    style={{
                      flex: s.percent,
                      backgroundColor: s.hex,
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onClick={() => copyHex(s.hex)}
                    title={`${s.hex} (${s.percent}%)`}
                  />
                ))}
              </div>

              {/* Swatch List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {swatches.map((s) => (
                  <div
                    key={s.hex}
                    onClick={() => copyHex(s.hex)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "14px",
                      backgroundColor: "var(--m-surface-2, #222a46)",
                      border: "1px solid var(--line, rgba(255,255,255,0.06))",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: s.hex,
                          border: "1px solid var(--line-2, rgba(255,255,255,0.2))",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                          {s.hex.toUpperCase()}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>{s.rgb}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "var(--green, #3fed1e)", fontWeight: 600 }}>
                        {s.percent}%
                      </span>
                      {copiedHex === s.hex ? (
                        <Check size={16} style={{ color: "var(--green, #3fed1e)" }} />
                      ) : (
                        <Copy size={16} style={{ color: "var(--muted, #8a93b8)" }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SettingsCard>
      </main>
    </div>
  );
}
