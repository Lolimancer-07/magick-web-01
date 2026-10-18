"use client";

import React, { useState } from "react";
import BottomSheet from "../BottomSheet";
import Segmented from "../Segmented";
import ColorSwatches from "../ColorSwatches";
import { Eraser, Pipette, Info, Check } from "lucide-react";

interface EraserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyColorKey: (targetColor: string, fuzzPercent: number) => void;
  onApplyEraseBrush: (brushSize: number, hardness: number) => void;
}

export default function EraserSheet({
  isOpen,
  onClose,
  onApplyColorKey,
  onApplyEraseBrush,
}: EraserSheetProps) {
  const [mode, setMode] = useState<"brush" | "colorkey">("colorkey");
  const [fuzz, setFuzz] = useState(15); // fuzz tolerance %
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(24);
  const [hardness, setHardness] = useState(80);

  const handleApply = () => {
    if (mode === "colorkey") {
      onApplyColorKey(selectedColor, fuzz);
    } else {
      onApplyEraseBrush(brushSize, hardness);
    }
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Eraser & Transparency" snapPoints={[50, 70, 90]} defaultSnap={65}>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Segmented
          options={[
            { value: "colorkey", label: "Color-Key Erase" },
            { value: "brush", label: "Eraser Brush" },
          ]}
          value={mode}
          onChange={(m) => setMode(m as any)}
        />

        {mode === "colorkey" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "13px", color: "var(--muted, #8a93b8)" }}>
              Replace all matching pixels of a specific color with transparent alpha using ImageMagick <code>-transparent</code> with <code>-fuzz</code>.
            </div>

            {/* Target Color Picker */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)", marginBottom: "6px" }}>
                Target Color to Remove
              </div>
              <ColorSwatches value={selectedColor} onChange={setSelectedColor} showTransparent={false} />
            </div>

            {/* Fuzz Tolerance Slider */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "16px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                <span>Color Tolerance (-fuzz)</span>
                <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>{fuzz}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={fuzz}
                onChange={(e) => setFuzz(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Brush Size */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "16px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                <span>Brush Radius</span>
                <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>{brushSize} px</span>
              </div>
              <input
                type="range"
                min={4}
                max={120}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
              />
            </div>

            {/* Hardness */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "16px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                <span>Edge Hardness</span>
                <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>{hardness}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={hardness}
                onChange={(e) => setHardness(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
              />
            </div>
          </div>
        )}

        {/* Clear Notice (Spec 5.11): Subject removal note */}
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "12px",
            backgroundColor: "rgba(48, 137, 197, 0.12)",
            border: "1px solid rgba(48, 137, 197, 0.25)",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            fontSize: "12px",
            color: "var(--blue, #3089c5)",
            lineHeight: 1.4,
          }}
        >
          <Info size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>
            Notice: AI-based neural subject removal is not an ImageMagick operator and is out of scope. Color-key and brush erase work directly on pixel channels.
          </span>
        </div>

        <button
          type="button"
          onClick={handleApply}
          style={{
            height: "48px",
            borderRadius: "var(--m-radius-chip, 999px)",
            backgroundColor: "var(--green, #3fed1e)",
            color: "var(--green-ink, #07110a)",
            fontWeight: 700,
            fontSize: "15px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <Check size={18} />
          <span>Apply Transparency</span>
        </button>
      </div>
    </BottomSheet>
  );
}
