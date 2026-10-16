"use client";

import Dropzone from "./Dropzone";
import { Wand2 } from "lucide-react";

interface EmptyStateProps {
  onImageLoaded: () => void;
}

export default function EmptyState({ onImageLoaded }: EmptyStateProps) {
  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        padding: "24px 16px",
        background: "var(--ed-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(63,237,30,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(63,237,30,.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(63,237,30,.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Header tagline */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(63,237,30,.12)",
              border: "1px solid rgba(63,237,30,.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green)",
              boxShadow: "0 0 20px rgba(63,237,30,.15)",
            }}
          >
            <Wand2 size={22} aria-hidden="true" />
          </div>
        </div>
        <h1
          className="font-display"
          style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", marginBottom: "8px", letterSpacing: "-0.02em" }}
        >
          Open an Image to Begin
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", maxWidth: "320px", lineHeight: 1.6 }}>
          Full ImageMagick power in your browser. Your images stay on your device — always private.
        </p>
      </div>

      {/* Dropzone */}
      <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <Dropzone onImageLoaded={onImageLoaded} />
      </div>
    </div>
  );
}
