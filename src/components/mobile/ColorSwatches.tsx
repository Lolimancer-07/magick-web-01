"use client";

import React, { useRef } from "react";
import { Check, Paintbrush, Pipette } from "lucide-react";

interface ColorSwatchesProps {
  id?: string;
  value: string; // e.g. "transparent", "#000000", "#ffffff", "#1e1e1e", "#e53935"
  onChange: (color: string) => void;
  showTransparent?: boolean;
}

const DEFAULT_SWATCHES = [
  { label: "Transparent", value: "transparent" },
  { label: "Black", value: "#000000" },
  { label: "Dark Gray", value: "#1f2438" },
  { label: "White", value: "#ffffff" },
  { label: "Crimson", value: "#e53935" },
  { label: "Dark Red", value: "#8e0000" },
  { label: "Coral", value: "#ff5722" },
  { label: "Navy", value: "#0f172a" },
  { label: "Deep Forest", value: "#1b4d3e" },
];

export default function ColorSwatches({
  id = "color-swatches",
  value,
  onChange,
  showTransparent = true,
}: ColorSwatchesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const swatches = showTransparent ? DEFAULT_SWATCHES : DEFAULT_SWATCHES.filter((s) => s.value !== "transparent");

  return (
    <div
      id={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        overflowX: "auto",
        padding: "4px 2px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Swatches */}
      {swatches.map((s) => {
        const isSelected = value.toLowerCase() === s.value.toLowerCase();
        const isTrans = s.value === "transparent";

        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            title={s.label}
            aria-label={s.label}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: isTrans ? "#1e2438" : s.value,
              backgroundImage: isTrans
                ? "linear-gradient(45deg, #2a3252 25%, transparent 25%), linear-gradient(-45deg, #2a3252 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a3252 75%), linear-gradient(-45deg, transparent 75%, #2a3252 75%)"
                : undefined,
              backgroundSize: "8px 8px",
              border: isSelected
                ? "3px solid var(--green, #3fed1e)"
                : "2px solid var(--line-2, rgba(255,255,255,0.14))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: isSelected ? "0 0 12px var(--green-glow, rgba(63,237,30,0.3))" : "none",
              transition: "transform 0.15s ease",
              transform: isSelected ? "scale(1.08)" : "scale(1)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {isSelected && (
              <Check
                size={18}
                style={{
                  color: s.value === "#ffffff" ? "#000" : "var(--green, #3fed1e)",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                }}
              />
            )}
          </button>
        );
      })}

      {/* Custom Color Picker Swatch with Paint-roller / Pipette */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Pick custom color"
          aria-label="Pick custom color"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "var(--m-surface-3, #2a3252)",
            border: "2px dashed var(--muted, #8a93b8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--ink, #f2f4fb)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <Paintbrush size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 0,
            height: 0,
          }}
        />
      </div>
    </div>
  );
}
