"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface QualitySliderProps {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export default function QualitySlider({
  id = "quality-slider",
  value,
  onChange,
  min = 1,
  max = 100,
}: QualitySliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [typedValue, setTypedValue] = useState(String(value));

  const handleBlurOrEnter = () => {
    setIsEditing(false);
    const parsed = parseInt(typedValue, 10);
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    } else {
      setTypedValue(String(value));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "var(--m-surface-2, #222a46)",
        borderRadius: "var(--m-radius-input, 16px)",
        padding: "10px 14px",
        border: "1px solid var(--line, rgba(255,255,255,0.08))",
      }}
    >
      {/* HQ Icon Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--green, #3fed1e)",
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "0.04em",
          padding: "4px 8px",
          borderRadius: "8px",
          backgroundColor: "rgba(63, 237, 30, 0.12)",
          flexShrink: 0,
        }}
      >
        <Sparkles size={14} />
        <span>HQ</span>
      </div>

      {/* Slider Track */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{
          flex: 1,
          accentColor: "var(--green, #3fed1e)",
          height: "6px",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      />

      {/* Value Pill (Tappable to type) */}
      {isEditing ? (
        <input
          type="number"
          inputMode="numeric"
          autoFocus
          value={typedValue}
          onChange={(e) => setTypedValue(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={(e) => e.key === "Enter" && handleBlurOrEnter()}
          style={{
            width: "60px",
            height: "32px",
            borderRadius: "var(--m-radius-chip, 999px)",
            backgroundColor: "var(--m-surface-3, #2a3252)",
            border: "1px solid var(--green, #3fed1e)",
            color: "var(--ink, #f2f4fb)",
            fontSize: "13px",
            fontWeight: 700,
            textAlign: "center",
            outline: "none",
            fontFamily: "var(--font-mono, monospace)",
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setTypedValue(String(value));
            setIsEditing(true);
          }}
          title="Tap to type quality number"
          style={{
            minWidth: "60px",
            height: "32px",
            borderRadius: "var(--m-radius-chip, 999px)",
            backgroundColor: "var(--m-surface-3, #2a3252)",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            color: "var(--ink, #f2f4fb)",
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "var(--font-mono, monospace)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {value} %
        </button>
      )}
    </div>
  );
}
