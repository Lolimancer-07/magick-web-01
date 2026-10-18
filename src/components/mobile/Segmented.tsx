"use client";

import React from "react";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string;
  disabled?: boolean;
}

interface SegmentedProps<T extends string = string> {
  id?: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
}

export default function Segmented<T extends string = string>({
  id,
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div
      id={id}
      role="radiogroup"
      style={{
        display: "flex",
        backgroundColor: "var(--m-surface-2, #222a46)",
        borderRadius: "var(--m-radius-chip, 999px)",
        padding: "4px",
        gap: "4px",
        border: "1px solid var(--line, rgba(255,255,255,0.06))",
        width: "100%",
      }}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              minHeight: "40px",
              borderRadius: "var(--m-radius-chip, 999px)",
              backgroundColor: isSelected ? "var(--green, #3fed1e)" : "transparent",
              color: isSelected
                ? "var(--green-ink, #07110a)"
                : opt.disabled
                ? "var(--dim, #4e5880)"
                : "var(--ink, #f2f4fb)",
              border: "none",
              fontSize: "13px",
              fontWeight: isSelected ? 700 : 500,
              cursor: opt.disabled ? "not-allowed" : "pointer",
              transition: "all 0.18s cubic-bezier(0.2, 0, 0, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "0 8px",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                style={{
                  fontSize: "10px",
                  padding: "1px 5px",
                  borderRadius: "999px",
                  backgroundColor: isSelected ? "rgba(0,0,0,0.2)" : "var(--m-surface-3, #2a3252)",
                  color: isSelected ? "var(--green-ink, #07110a)" : "var(--muted, #8a93b8)",
                }}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
