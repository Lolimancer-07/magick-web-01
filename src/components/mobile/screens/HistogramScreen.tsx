"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { BarChart3 } from "lucide-react";

export default function HistogramScreen() {
  const router = useRouter();
  const { currentImage } = useMobileImageStore();
  const [activeChannel, setActiveChannel] = useState<"rgb" | "red" | "green" | "blue">("rgb");
  const [histData, setHistData] = useState<{ r: number[]; g: number[]; b: number[]; l: number[] }>({
    r: new Array(256).fill(0),
    g: new Array(256).fill(0),
    b: new Array(256).fill(0),
    l: new Array(256).fill(0),
  });

  useEffect(() => {
    if (!currentImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);
      const data = ctx.getImageData(0, 0, 150, 150).data;

      const r = new Array(256).fill(0);
      const g = new Array(256).fill(0);
      const b = new Array(256).fill(0);
      const l = new Array(256).fill(0);

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const lum = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);

        r[red]++;
        g[green]++;
        b[blue]++;
        l[lum]++;
      }

      setHistData({ r, g, b, l });
    };
    img.src = currentImage.url;
  }, [currentImage]);

  const channelColor =
    activeChannel === "red"
      ? "#f04040"
      : activeChannel === "green"
      ? "#3fed1e"
      : activeChannel === "blue"
      ? "#3089c5"
      : "#ffffff";

  const rawBins =
    activeChannel === "red"
      ? histData.r
      : activeChannel === "green"
      ? histData.g
      : activeChannel === "blue"
      ? histData.b
      : histData.l;

  const maxVal = Math.max(...rawBins, 1);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "32px",
      }}
    >
      <TopBar title="Histogram Analysis" onBack={() => router.back()} />

      <main style={{ padding: "12px 0" }}>
        {/* Channel Selector */}
        <SettingsCard title="Histogram Channel">
          <Segmented
            options={[
              { value: "rgb", label: "Luminance" },
              { value: "red", label: "Red" },
              { value: "green", label: "Green" },
              { value: "blue", label: "Blue" },
            ]}
            value={activeChannel}
            onChange={(c) => setActiveChannel(c as any)}
          />
        </SettingsCard>

        {/* 256-Bin Graph */}
        <SettingsCard title={`${activeChannel.toUpperCase()} Distribution (256 Bins)`}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              backgroundColor: "var(--m-surface-2, #222a46)",
              borderRadius: "16px",
              border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
              display: "flex",
              alignItems: "flex-end",
              padding: "4px 8px",
              overflow: "hidden",
            }}
          >
            {rawBins.map((count, bin) => {
              const hPct = (count / maxVal) * 100;
              return (
                <div
                  key={bin}
                  style={{
                    flex: 1,
                    height: `${Math.min(100, Math.max(1, hPct))}%`,
                    backgroundColor: channelColor,
                    opacity: 0.85,
                  }}
                  title={`Level ${bin}: ${count} pixels`}
                />
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "var(--muted, #8a93b8)",
              marginTop: "8px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>0 (Shadows)</span>
            <span>128 (Midtones)</span>
            <span>255 (Highlights)</span>
          </div>
        </SettingsCard>
      </main>
    </div>
  );
}
