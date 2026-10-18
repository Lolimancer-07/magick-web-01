"use client";

import React from "react";

export interface ChipItem<T extends string = string> {
  id: T;
  label: string;
  badge?: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface ChipGroupProps<T extends string = string> {
  id?: string;
  items: ChipItem<T>[];
  selected: T | T[];
  onSelect: (id: T) => void;
  layout?: "scroll" | "wrap";
  multi?: boolean;
}

export default function ChipGroup<T extends string = string>({
  id,
  items,
  selected,
  onSelect,
  layout = "scroll",
  multi = false,
}: ChipGroupProps<T>) {
  const isSelected = (itemId: T) => {
    if (multi && Array.isArray(selected)) {
      return selected.includes(itemId);
    }
    return selected === itemId;
  };

  const containerStyle: React.CSSProperties =
    layout === "scroll"
      ? {
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }
      : {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        };

  return (
    <div id={id} style={containerStyle}>
      {items.map((item) => {
        const active = isSelected(item.id);
        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onSelect(item.id)}
            title={item.disabled ? item.disabledReason : undefined}
            style={{
              flexShrink: 0,
              minHeight: "40px",
              padding: "0 16px",
              borderRadius: "var(--m-radius-chip, 999px)",
              backgroundColor: active
                ? "var(--green, #3fed1e)"
                : item.disabled
                ? "rgba(34, 42, 70, 0.4)"
                : "var(--m-surface-2, #222a46)",
              color: active
                ? "var(--green-ink, #07110a)"
                : item.disabled
                ? "var(--dim, #4e5880)"
                : "var(--ink, #f2f4fb)",
              border: `1px solid ${
                active
                  ? "var(--green, #3fed1e)"
                  : item.disabled
                  ? "rgba(255,255,255,0.03)"
                  : "var(--line, rgba(255,255,255,0.08))"
              }`,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: active ? 700 : 500,
              cursor: item.disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              userSelect: "none",
              whiteSpace: "nowrap",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: "999px",
                  backgroundColor: active
                    ? "rgba(0,0,0,0.2)"
                    : item.badge === "Desktop" || item.badge === "Server"
                    ? "rgba(48, 137, 197, 0.25)"
                    : "var(--m-surface-3, #2a3252)",
                  color: active
                    ? "var(--green-ink, #07110a)"
                    : item.badge === "Desktop" || item.badge === "Server"
                    ? "var(--blue, #3089c5)"
                    : "var(--muted, #8a93b8)",
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
