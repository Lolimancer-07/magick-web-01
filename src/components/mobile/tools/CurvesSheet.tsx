"use client";

import React, { useState, useRef, useEffect } from "react";
import BottomSheet from "../BottomSheet";
import Segmented from "../Segmented";
import { RotateCcw, Check } from "lucide-react";

export type CurveChannel = "rgb" | "red" | "green" | "blue";

export interface CurvePoint {
  x: number; // 0 to 255
  y: number; // 0 to 255
}

interface CurvesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCurve: (channel: CurveChannel, lutData: Uint8Array) => void;
  histogramData?: number[]; // 256 values
}

export default function CurvesSheet({
  isOpen,
  onClose,
  onApplyCurve,
  histogramData,
}: CurvesSheetProps) {
  const [channel, setChannel] = useState<CurveChannel>("rgb");
  const [curves, setCurves] = useState<Record<CurveChannel, CurvePoint[]>>({
    rgb: [
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ],
    red: [
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ],
    green: [
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ],
    blue: [
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ],
  });

  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentPoints = curves[channel];

  const handleReset = () => {
    setCurves((prev) => ({
      ...prev,
      [channel]: [
        { x: 0, y: 0 },
        { x: 255, y: 255 },
      ],
    }));
  };

  const channelColor =
    channel === "red"
      ? "#f04040"
      : channel === "green"
      ? "#3fed1e"
      : channel === "blue"
      ? "#3089c5"
      : "#ffffff";

  // Build SVG path string from points using monotonic cubic interpolation
  const pathD = buildCurvePath(currentPoints);

  // Generate 256x1 LUT byte array
  const generateLut = (points: CurvePoint[]): Uint8Array => {
    const lut = new Uint8Array(256);
    // Linear / piecewise interpolation between control points
    const sorted = [...points].sort((a, b) => a.x - b.x);
    for (let x = 0; x < 256; x++) {
      let y = x;
      for (let i = 0; i < sorted.length - 1; i++) {
        const p1 = sorted[i];
        const p2 = sorted[i + 1];
        if (x >= p1.x && x <= p2.x) {
          const t = p2.x === p1.x ? 0 : (x - p1.x) / (p2.x - p1.x);
          y = Math.round(p1.y + t * (p2.y - p1.y));
          break;
        }
      }
      lut[x] = Math.max(0, Math.min(255, y));
    }
    return lut;
  };

  const handleApply = () => {
    const lut = generateLut(currentPoints);
    onApplyCurve(channel, lut);
    onClose();
  };

  const handleSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(255, Math.round(((e.clientX - rect.left) / rect.width) * 255)));
    const y = Math.max(0, Math.min(255, Math.round((1 - (e.clientY - rect.top) / rect.height) * 255)));

    // Check if clicked close to an existing point
    const threshold = 18;
    const foundIdx = currentPoints.findIndex(
      (p) => Math.hypot(p.x - x, p.y - y) < threshold
    );

    if (foundIdx !== -1) {
      setActivePointIndex(foundIdx);
    } else {
      // Add new control point (max 8 points)
      if (currentPoints.length < 8) {
        const next = [...currentPoints, { x, y }].sort((a, b) => a.x - b.x);
        setCurves((prev) => ({ ...prev, [channel]: next }));
        setActivePointIndex(next.findIndex((p) => p.x === x && p.y === y));
      }
    }
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activePointIndex === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let x = Math.max(0, Math.min(255, Math.round(((e.clientX - rect.left) / rect.width) * 255)));
    const y = Math.max(0, Math.min(255, Math.round((1 - (e.clientY - rect.top) / rect.height) * 255)));

    // First and last point constrained in X
    if (activePointIndex === 0) x = 0;
    if (activePointIndex === currentPoints.length - 1) x = 255;

    const updated = [...currentPoints];
    updated[activePointIndex] = { x, y };
    setCurves((prev) => ({ ...prev, [channel]: updated }));
  };

  const handleSvgPointerUp = () => {
    setActivePointIndex(null);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Tone Curves" snapPoints={[55, 75, 92]} defaultSnap={70}>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Segmented
            options={[
              { value: "rgb", label: "RGB" },
              { value: "red", label: "Red" },
              { value: "green", label: "Green" },
              { value: "blue", label: "Blue" },
            ]}
            value={channel}
            onChange={(c) => setChannel(c as CurveChannel)}
          />
        </div>

        {/* 256x256 Interactive Curve Canvas */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "340px",
            aspectRatio: "1",
            margin: "0 auto",
            backgroundColor: "var(--m-surface-2, #222a46)",
            borderRadius: "16px",
            border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
            overflow: "hidden",
            touchAction: "none",
          }}
        >
          {/* Histogram background if available */}
          {histogramData && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                opacity: 0.18,
                pointerEvents: "none",
              }}
            >
              {histogramData.map((val, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.min(100, (val / 255) * 100)}%`,
                    backgroundColor: channelColor,
                  }}
                />
              ))}
            </div>
          )}

          {/* Grid lines (4x4) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "25% 25%",
              pointerEvents: "none",
            }}
          />

          {/* SVG Curve & Interactive Handles */}
          <svg
            ref={svgRef}
            viewBox="0 0 255 255"
            onPointerDown={handleSvgPointerDown}
            onPointerMove={handleSvgPointerMove}
            onPointerUp={handleSvgPointerUp}
            onPointerLeave={handleSvgPointerUp}
            style={{ width: "100%", height: "100%", cursor: "crosshair" }}
          >
            {/* Diagonal reference line */}
            <line x1="0" y1="255" x2="255" y2="0" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" strokeWidth="1" />

            {/* Interpolated Curve Path */}
            <path d={pathD} fill="none" stroke={channelColor} strokeWidth="2.5" />

            {/* Control Point Circles */}
            {currentPoints.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={255 - p.y}
                r={activePointIndex === idx ? 8 : 6}
                fill={channelColor}
                stroke="#0f1320"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "14px",
              backgroundColor: "var(--m-surface-3, #2a3252)",
              color: "var(--ink, #f2f4fb)",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Channel</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 24px",
              borderRadius: "14px",
              backgroundColor: "var(--green, #3fed1e)",
              color: "var(--green-ink, #07110a)",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            <Check size={16} />
            <span>Apply Curve</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function buildCurvePath(points: CurvePoint[]): string {
  if (points.length === 0) return "";
  const sorted = [...points].sort((a, b) => a.x - b.x);
  let d = `M ${sorted[0].x} ${255 - sorted[0].y}`;
  for (let i = 1; i < sorted.length; i++) {
    const p0 = sorted[i - 1];
    const p1 = sorted[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${255 - p0.y}, ${cx} ${255 - p1.y}, ${p1.x} ${255 - p1.y}`;
  }
  return d;
}
