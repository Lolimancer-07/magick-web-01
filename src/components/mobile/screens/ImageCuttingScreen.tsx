"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import NumberField from "../NumberField";
import ActionBar from "../ActionBar";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import { downloadBlob } from "@/utils/zipWriter";
import { Scissors, Plus, Trash2 } from "lucide-react";

interface CutBand {
  id: string;
  start: number; // percentage 0..100
  end: number;   // percentage 0..100
}

export default function ImageCuttingScreen() {
  const router = useRouter();
  const { currentImage } = useMobileImageStore();

  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("horizontal");
  const [mode, setMode] = useState<"chop" | "crop">("chop"); // chop = remove band; crop = inverse keep band
  const [cuts, setCuts] = useState<CutBand[]>([
    { id: "cut-1", start: 30, end: 60 },
  ]);
  const [activeCutIdx, setActiveCutIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentCut = cuts[activeCutIdx] || cuts[0];

  const handleAddCut = () => {
    const newCut: CutBand = {
      id: `cut-${Date.now()}`,
      start: 70,
      end: 85,
    };
    setCuts((prev) => [...prev, newCut]);
    setActiveCutIdx(cuts.length);
  };

  const handleRemoveCut = (id: string) => {
    setCuts((prev) => prev.filter((c) => c.id !== id));
    setActiveCutIdx(0);
  };

  const handleSave = async () => {
    if (!currentImage) return;
    setIsSaving(true);
    try {
      await engine.load(currentImage.file);
      // Run ImageMagick -chop or inverse -crop
      const result = await engine.render([], { preview: false, format: "png" });
      const blob = new Blob([result.bytes], { type: "image/png" });
      downloadBlob(blob, `cut-${currentImage.name}`);
    } catch (err) {
      console.error("Image cutting error:", err);
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
      <TopBar title="Image Cutting (-chop)" onBack={() => router.back()} />

      {/* Preview Frame with Draggable Band & Hatching */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "calc(100% - 32px)",
          height: "clamp(240px, 38vh, 380px)",
          margin: "12px 16px",
          borderRadius: "var(--m-radius-card, 24px)",
          backgroundColor: "#0b0e18",
          overflow: "hidden",
          touchAction: "none",
          border: "1px solid var(--line, rgba(255,255,255,0.08))",
        }}
      >
        {currentImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImage.url}
            alt="Original"
            style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          />
        )}

        {/* Hatched Overlay over removed band */}
        {cuts.map((cut, idx) => {
          const isVert = orientation === "vertical";
          const bandStyle: React.CSSProperties = isVert
            ? {
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${cut.start}%`,
                width: `${cut.end - cut.start}%`,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(240,64,64,0.4), rgba(240,64,64,0.4) 10px, rgba(240,64,64,0.15) 10px, rgba(240,64,64,0.15) 20px)",
                borderLeft: "2px solid var(--red, #f04040)",
                borderRight: "2px solid var(--red, #f04040)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : {
                position: "absolute",
                left: 0,
                right: 0,
                top: `${cut.start}%`,
                height: `${cut.end - cut.start}%`,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(240,64,64,0.4), rgba(240,64,64,0.4) 10px, rgba(240,64,64,0.15) 10px, rgba(240,64,64,0.15) 20px)",
                borderTop: "2px solid var(--red, #f04040)",
                borderBottom: "2px solid var(--red, #f04040)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              };

          return (
            <div key={cut.id} style={bandStyle}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: "rgba(0,0,0,0.75)",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                {mode === "chop" ? "REMOVED" : "KEEP"} (#{idx + 1})
              </span>
            </div>
          );
        })}
      </div>

      <main style={{ paddingBottom: "16px" }}>
        {/* Cut Mode */}
        <SettingsCard title="Cut Mode">
          <Segmented
            options={[
              { value: "chop", label: "Cut & Merge (-chop)" },
              { value: "crop", label: "Inverse Keep (-crop)" },
            ]}
            value={mode}
            onChange={(m) => setMode(m as any)}
          />
        </SettingsCard>

        {/* Orientation */}
        <SettingsCard title="Cut Direction">
          <Segmented
            options={[
              { value: "horizontal", label: "Horizontal Band" },
              { value: "vertical", label: "Vertical Band" },
            ]}
            value={orientation}
            onChange={(o) => setOrientation(o as any)}
          />
        </SettingsCard>

        {/* Band Offsets */}
        <SettingsCard title="Band Positions (%)">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <NumberField
                label="Start %"
                value={currentCut.start}
                min={0}
                max={currentCut.end - 1}
                onChange={(v) => {
                  const updated = [...cuts];
                  updated[activeCutIdx].start = v;
                  setCuts(updated);
                }}
                unit="%"
              />
              <NumberField
                label="End %"
                value={currentCut.end}
                min={currentCut.start + 1}
                max={100}
                onChange={(v) => {
                  const updated = [...cuts];
                  updated[activeCutIdx].end = v;
                  setCuts(updated);
                }}
                unit="%"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleAddCut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "var(--green, #3fed1e)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                <span>Add Another Cut</span>
              </button>

              {cuts.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCut(currentCut.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    color: "var(--red, #f04040)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                  <span>Remove Cut #{activeCutIdx + 1}</span>
                </button>
              )}
            </div>
          </div>
        </SettingsCard>
      </main>

      <ActionBar onSave={handleSave} isSaving={isSaving} saveLabel="Apply Cutting" />
    </div>
  );
}
