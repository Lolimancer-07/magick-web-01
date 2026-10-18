"use client";

import React, { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

interface SizeEstimateProps {
  originalBytes?: number;
  estimatedBytes?: number;
  isCalculating?: boolean;
  isFastApproximation?: boolean;
}

export function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SizeEstimate({
  originalBytes = 0,
  estimatedBytes,
  isCalculating = false,
  isFastApproximation = false,
}: SizeEstimateProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine delta color: green when smaller by >2%, red when larger by >2%, neutral otherwise
  let tintColor = "var(--ink, #f2f4fb)";
  if (originalBytes > 0 && estimatedBytes !== undefined && estimatedBytes > 0) {
    const diff = (estimatedBytes - originalBytes) / originalBytes;
    if (diff < -0.02) {
      tintColor = "var(--green, #3fed1e)"; // shrank
    } else if (diff > 0.02) {
      tintColor = "var(--red, #f04040)"; // grew
    } else {
      tintColor = "var(--muted, #8a93b8)"; // roughly identical
    }
  }

  return (
    <div
      id="size-estimate-badge"
      onClick={() => setShowTooltip((s) => !s)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "var(--m-radius-chip, 999px)",
        backgroundColor: "var(--m-surface-2, #222a46)",
        border: "1px solid var(--line, rgba(255,255,255,0.08))",
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "var(--font-mono, monospace)",
        color: "var(--ink, #f2f4fb)",
        cursor: "pointer",
        userSelect: "none",
        minHeight: "32px",
      }}
      title="Click to view exact byte counts"
    >
      <span>{formatBytes(originalBytes)}</span>
      <ArrowRight size={13} style={{ color: "var(--muted, #8a93b8)" }} />

      {isCalculating ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--muted)" }}>
          <Loader2 size={13} className="animate-spin" />
          <span>calc...</span>
        </span>
      ) : (
        <span style={{ color: tintColor, fontWeight: 700 }}>
          {isFastApproximation ? "~" : ""}
          {formatBytes(estimatedBytes ?? originalBytes)}
        </span>
      )}

      {/* Tooltip on tap */}
      {showTooltip && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--m-surface-3, #2a3252)",
            border: "1px solid var(--line-2, rgba(255,255,255,0.14))",
            borderRadius: "10px",
            padding: "8px 12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 100,
            whiteSpace: "nowrap",
            fontSize: "12px",
            color: "var(--ink, #f2f4fb)",
            pointerEvents: "none",
          }}
        >
          <div>Original: {originalBytes.toLocaleString()} bytes</div>
          <div>Estimate: {(estimatedBytes ?? 0).toLocaleString()} bytes</div>
          {originalBytes > 0 && estimatedBytes !== undefined && (
            <div style={{ color: tintColor, marginTop: "2px" }}>
              Delta: {(((estimatedBytes - originalBytes) / originalBytes) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
