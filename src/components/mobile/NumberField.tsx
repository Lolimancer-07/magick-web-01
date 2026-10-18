"use client";

import React, { useRef } from "react";
import { Plus, Minus } from "lucide-react";

interface NumberFieldProps {
  id?: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export default function NumberField({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = 99999,
  step = 1,
  unit,
  disabled = false,
}: NumberFieldProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  const changeBy = (delta: number) => {
    onChange(clamp(value + delta));
  };

  const startHold = (delta: number) => {
    changeBy(delta);
    let speed = 200;
    const loop = () => {
      timerRef.current = setTimeout(() => {
        changeBy(delta * (speed < 100 ? 5 : 1));
        speed = Math.max(40, speed * 0.85);
        loop();
      }, speed);
    };
    loop();
  };

  const stopHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--m-surface-2, #222a46)",
        borderRadius: "var(--m-radius-input, 16px)",
        border: "1px solid var(--line, rgba(255,255,255,0.08))",
        padding: "4px 8px",
        gap: "6px",
        flex: 1,
        minWidth: 0,
        height: "56px",
      }}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onMouseDown={() => startHold(-step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(-step)}
        onTouchEnd={stopHold}
        aria-label={`Decrease ${label}`}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "var(--m-surface-3, #2a3252)",
          border: "none",
          color: "var(--ink, #f2f4fb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled || value <= min ? "not-allowed" : "pointer",
          opacity: disabled || value <= min ? 0.4 : 1,
          flexShrink: 0,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <Minus size={15} />
      </button>

      <div style={{ flex: 1, minWidth: 0, textAlign: "center", display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "11px",
            color: "var(--muted, #8a93b8)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            value={isNaN(value) ? "" : value}
            disabled={disabled}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChange(isNaN(val) ? min : clamp(val));
            }}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "var(--font-mono, monospace)",
              textAlign: "center",
              padding: 0,
              outline: "none",
            }}
          />
          {unit && (
            <span style={{ fontSize: "12px", color: "var(--muted, #8a93b8)", fontWeight: 500 }}>
              {unit}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={disabled || value >= max}
        onMouseDown={() => startHold(step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(step)}
        onTouchEnd={stopHold}
        aria-label={`Increase ${label}`}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "var(--m-surface-3, #2a3252)",
          border: "none",
          color: "var(--ink, #f2f4fb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled || value >= max ? "not-allowed" : "pointer",
          opacity: disabled || value >= max ? 0.4 : 1,
          flexShrink: 0,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
