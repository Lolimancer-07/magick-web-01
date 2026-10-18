"use client";

import React, { useState } from "react";
import BottomSheet from "../BottomSheet";
import Segmented from "../Segmented";
import ColorSwatches from "../ColorSwatches";
import { Pencil, Square, Circle, ArrowUpRight, Type, Undo2, Check } from "lucide-react";

export type DrawToolMode = "pencil" | "line" | "arrow" | "rectangle" | "ellipse" | "text";

export interface DrawStroke {
  id: string;
  mode: DrawToolMode;
  color: string;
  size: number;
  opacity: number;
  text?: string;
  points?: { x: number; y: number }[];
}

interface DrawSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStrokes: (strokes: DrawStroke[]) => void;
}

export default function DrawSheet({
  isOpen,
  onClose,
  onSaveStrokes,
}: DrawSheetProps) {
  const [mode, setMode] = useState<DrawToolMode>("pencil");
  const [color, setColor] = useState("#3fed1e");
  const [strokeSize, setStrokeSize] = useState(6);
  const [textInput, setTextInput] = useState("");
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);

  const handleAddStroke = () => {
    const newStroke: DrawStroke = {
      id: `stroke-${Date.now()}`,
      mode,
      color,
      size: strokeSize,
      opacity: 1.0,
      text: mode === "text" ? textInput : undefined,
    };
    setStrokes((prev) => [...prev, newStroke]);
    if (mode === "text") setTextInput("");
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleDone = () => {
    onSaveStrokes(strokes);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Draw & Markup" snapPoints={[55, 75, 92]} defaultSnap={70}>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Tool Mode selector */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
          {[
            { id: "pencil", label: "Pencil", icon: Pencil },
            { id: "line", label: "Line", icon: ArrowUpRight },
            { id: "rectangle", label: "Box", icon: Square },
            { id: "ellipse", label: "Circle", icon: Circle },
            { id: "text", label: "Text", icon: Type },
          ].map((item) => {
            const isActive = mode === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id as DrawToolMode)}
                style={{
                  flex: 1,
                  minWidth: "64px",
                  height: "44px",
                  borderRadius: "14px",
                  backgroundColor: isActive ? "var(--green, #3fed1e)" : "var(--m-surface-2, #222a46)",
                  color: isActive ? "var(--green-ink, #07110a)" : "var(--ink, #f2f4fb)",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  cursor: "pointer",
                }}
              >
                <Icon size={16} />
                <span style={{ fontSize: "11px", fontWeight: 700 }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Field if Text mode selected */}
        {mode === "text" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Enter text markup..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{
                flex: 1,
                height: "44px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
                borderRadius: "12px",
                padding: "0 12px",
                color: "var(--ink, #f2f4fb)",
                fontSize: "14px",
              }}
            />
            <button
              type="button"
              disabled={!textInput.trim()}
              onClick={handleAddStroke}
              style={{
                padding: "0 16px",
                borderRadius: "12px",
                backgroundColor: "var(--green, #3fed1e)",
                color: "var(--green-ink, #07110a)",
                fontWeight: 700,
                border: "none",
                cursor: !textInput.trim() ? "not-allowed" : "pointer",
                opacity: !textInput.trim() ? 0.5 : 1,
              }}
            >
              Add
            </button>
          </div>
        )}

        {/* Stroke Size Slider */}
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
            <span>Stroke Width</span>
            <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>{strokeSize} px</span>
          </div>
          <input
            type="range"
            min={1}
            max={32}
            value={strokeSize}
            onChange={(e) => setStrokeSize(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
          />
        </div>

        {/* Color Palette Swatches */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)", marginBottom: "6px" }}>
            Stroke Color
          </div>
          <ColorSwatches value={color} onChange={setColor} showTransparent={false} />
        </div>

        {/* Vector Strokes Info & Action */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              disabled={strokes.length === 0}
              onClick={handleUndo}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--m-surface-3, #2a3252)",
                color: strokes.length === 0 ? "var(--dim, #4e5880)" : "var(--ink, #f2f4fb)",
                border: "none",
                cursor: strokes.length === 0 ? "not-allowed" : "pointer",
                fontSize: "13px",
              }}
            >
              <Undo2 size={15} />
              <span>Undo ({strokes.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDone}
            style={{
              padding: "10px 24px",
              borderRadius: "var(--m-radius-chip, 999px)",
              backgroundColor: "var(--green, #3fed1e)",
              color: "var(--green-ink, #07110a)",
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <Check size={16} />
            <span>Apply Markup</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
