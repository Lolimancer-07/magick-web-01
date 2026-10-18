"use client";

import React, { useState } from "react";
import BottomSheet from "../BottomSheet";
import Segmented from "../Segmented";
import { Wand2, Sliders, Check } from "lucide-react";

export type AutoEnhanceType =
  | "auto-level"
  | "auto-gamma"
  | "normalize"
  | "white-balance"
  | "sigmoidal-contrast"
  | "sharpen";

export type FilterPresetType =
  | "vivid"
  | "warm"
  | "cool"
  | "bw"
  | "sepia"
  | "fade"
  | "vignette";

interface EnhanceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAuto: (type: AutoEnhanceType) => void;
  onApplyFilter: (preset: FilterPresetType, intensity: number) => void;
}

const AUTO_OPTIONS: { id: AutoEnhanceType; label: string; desc: string; icon: string }[] = [
  { id: "auto-level", label: "Auto Level", desc: "Normalize dynamic range across histogram", icon: "⚖️" },
  { id: "auto-gamma", label: "Auto Gamma", desc: "Balance mid-tone luminance", icon: "☀️" },
  { id: "normalize", label: "Normalize", desc: "Expand contrast to full span", icon: "🌈" },
  { id: "sigmoidal-contrast", label: "Auto Contrast", desc: "Filmic non-linear S-curve contrast", icon: "◐" },
  { id: "sharpen", label: "Sharpen", desc: "Enhance subtle edge details", icon: "◈" },
];

const FILTER_PRESETS: { id: FilterPresetType; label: string; desc: string }[] = [
  { id: "vivid", label: "Vivid", desc: "Saturated rich color boost" },
  { id: "warm", label: "Warm Sun", desc: "Golden hour temperature boost" },
  { id: "cool", label: "Cool Nordic", desc: "Subtle blue tint and crisp tones" },
  { id: "bw", label: "B&W Mono", desc: "High-contrast monochrome" },
  { id: "sepia", label: "Vintage Sepia", desc: "Warm antique photograph tone" },
  { id: "fade", label: "Matte Fade", desc: "Lifted shadows and soft film look" },
  { id: "vignette", label: "Vignette", desc: "Radial darkened lens border" },
];

export default function EnhanceSheet({
  isOpen,
  onClose,
  onApplyAuto,
  onApplyFilter,
}: EnhanceSheetProps) {
  const [tab, setTab] = useState<"auto" | "filters">("auto");
  const [selectedFilter, setSelectedFilter] = useState<FilterPresetType>("vivid");
  const [intensity, setIntensity] = useState(80);

  const handleApplyFilter = () => {
    onApplyFilter(selectedFilter, intensity);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Enhance & Filters" snapPoints={[50, 70, 90]} defaultSnap={65}>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Segmented
          options={[
            { value: "auto", label: "Auto Enhancements" },
            { value: "filters", label: "Filter Presets" },
          ]}
          value={tab}
          onChange={(t) => setTab(t as any)}
        />

        {tab === "auto" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {AUTO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onApplyAuto(opt.id);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  backgroundColor: "var(--m-surface-2, #222a46)",
                  border: "1px solid var(--line, rgba(255,255,255,0.06))",
                  color: "var(--ink, #f2f4fb)",
                  textAlign: "left",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "var(--m-surface-3, #2a3252)",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>{opt.desc}</div>
                </div>
                <Wand2 size={16} style={{ color: "var(--green, #3fed1e)", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Filter grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {FILTER_PRESETS.map((p) => {
                const isSelected = selectedFilter === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedFilter(p.id)}
                    style={{
                      padding: "12px",
                      borderRadius: "14px",
                      backgroundColor: isSelected ? "var(--m-surface-3, #2a3252)" : "var(--m-surface-2, #222a46)",
                      border: `1px solid ${isSelected ? "var(--green, #3fed1e)" : "var(--line, rgba(255,255,255,0.06))"}`,
                      color: "var(--ink, #f2f4fb)",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: isSelected ? 700 : 600 }}>{p.label}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>{p.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Intensity Slider */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px 14px",
                borderRadius: "16px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                border: "1px solid var(--line, rgba(255,255,255,0.06))",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                <span>Intensity</span>
                <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>{intensity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
              />
            </div>

            <button
              type="button"
              onClick={handleApplyFilter}
              style={{
                height: "48px",
                borderRadius: "var(--m-radius-chip, 999px)",
                backgroundColor: "var(--green, #3fed1e)",
                color: "var(--green-ink, #07110a)",
                fontSize: "15px",
                fontWeight: 700,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 16px var(--green-glow)",
              }}
            >
              <Check size={18} />
              <span>Apply {selectedFilter.toUpperCase()}</span>
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
