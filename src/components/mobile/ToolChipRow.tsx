"use client";

import React from "react";
import { Crop, Activity, Wand2, Pencil, Eraser } from "lucide-react";

export type ToolChipId = "crop" | "curves" | "enhance" | "draw" | "eraser";

interface ToolChipRowProps {
  activeTool: ToolChipId | null;
  onSelectTool: (tool: ToolChipId) => void;
}

const TOOL_CHIPS: { id: ToolChipId; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "crop", label: "Crop", icon: Crop },
  { id: "curves", label: "Curves", icon: Activity },
  { id: "enhance", label: "Enhance", icon: Wand2 },
  { id: "draw", label: "Draw", icon: Pencil },
  { id: "eraser", label: "Eraser", icon: Eraser },
];

export default function ToolChipRow({ activeTool, onSelectTool }: ToolChipRowProps) {
  return (
    <div
      id="tool-chip-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        overflowX: "auto",
        padding: "0 var(--m-pad, 16px) 16px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {TOOL_CHIPS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            id={`tool-chip-${id}`}
            onClick={() => onSelectTool(id)}
            style={{
              flexShrink: 0,
              height: "40px",
              padding: "0 16px",
              borderRadius: "var(--m-radius-chip, 999px)",
              backgroundColor: isActive ? "var(--green, #3fed1e)" : "var(--m-surface-2, #222a46)",
              color: isActive ? "var(--green-ink, #07110a)" : "var(--ink, #f2f4fb)",
              border: `1px solid ${isActive ? "var(--green, #3fed1e)" : "var(--line, rgba(255,255,255,0.08))"}`,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.16s ease",
              whiteSpace: "nowrap",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
