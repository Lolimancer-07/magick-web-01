"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, Star, Layers, Sliders, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import IconTile from "@/components/ui/IconTile";
import ClayCard from "@/components/ui/ClayCard";
import ProgressBar from "@/components/ui/ProgressBar";

export default function Hero() {
  const [progress, setProgress] = useState(65);
  const [activeStep, setActiveStep] = useState(3);

  const handleStepAdvance = () => {
    setProgress((p) => (p >= 100 ? 35 : p + 15));
    setActiveStep((s) => (s >= 5 ? 1 : s + 1));
  };

  return (
    <section
      style={{
        padding: "80px 24px 100px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "56px",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left Column */}
        <div>
          {/* Badge */}
          <div style={{ marginBottom: "20px" }}>
            <Pill color="green">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--green-d)",
                  display: "inline-block",
                }}
              />
              <span>New: runs 100% in your browser</span>
            </Pill>
          </div>

          {/* Headline */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--ink)",
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            Edit Any Image, Instantly, <br />
            <span className="highlight-green">Privately!</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: "540px",
              marginBottom: "36px",
              fontWeight: 600,
            }}
          >
            A friendly, non-destructive image editor powered by ImageMagick WebAssembly. Apply 19+ operations
            with zero server uploads and full offline privacy.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "52px",
            }}
          >
            <Button variant="primary" size="lg" href="/editor">
              <span>Start Editing Free</span>
              <ArrowRight width={18} height={18} aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="lg" href="#tools">
              <span>Browse Tools</span>
            </Button>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              gap: "36px",
              flexWrap: "wrap",
            }}
          >
            {[
              { val: "200+", label: "formats supported" },
              { val: "100%", label: "local browser WASM" },
              { val: "0", label: "server uploads" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-display"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.val}
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.95rem", fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Progress Demo Card with Overlapping Floating Chips */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
            {/* Floating Chip 1: Salmon Tile with Target Icon (Top Left) */}
            <div
              className="floating-chip"
              style={{
                position: "absolute",
                top: "-22px",
                left: "-22px",
                zIndex: 10,
              }}
            >
              <IconTile color="salmon" size="md">
                <Target width={22} height={22} aria-hidden="true" />
              </IconTile>
            </div>

            {/* Floating Chip 2: Mint Circle with Star (Top Right) */}
            <div
              className="floating-chip"
              style={{
                position: "absolute",
                top: "-18px",
                right: "-18px",
                zIndex: 10,
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--mint)",
                border: "2px solid var(--ink)",
                boxShadow: "var(--shadow-tile)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Star width={22} height={22} fill="var(--ink)" aria-hidden="true" />
            </div>

            {/* Floating Chip 3: Lavender Tile with Stack Icon (Bottom Right) */}
            <div
              className="floating-chip"
              style={{
                position: "absolute",
                bottom: "-18px",
                right: "-18px",
                zIndex: 10,
              }}
            >
              <IconTile color="lavender" size="md">
                <Layers width={22} height={22} aria-hidden="true" />
              </IconTile>
            </div>

            {/* Main Progress Card */}
            <ClayCard
              style={{
                padding: "36px 32px",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Header with Icon Tile & Metadata */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <IconTile color="mint" size="lg">
                  <Sliders width={26} height={26} aria-hidden="true" />
                </IconTile>
                <div>
                  <h3
                    className="font-display"
                    style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)" }}
                  >
                    Portrait Retouch
                  </h3>
                  <div style={{ color: "var(--muted)", fontSize: "0.95rem", fontWeight: 600 }}>
                    5 steps · {activeStep} enabled
                  </div>
                </div>
              </div>

              {/* Progress Bar & Label */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  <span style={{ color: "var(--ink)" }}>Export progress</span>
                  <span style={{ color: "var(--green-d)" }}>{progress}%</span>
                </div>
                <ProgressBar value={progress} />
              </div>

              {/* Interactive Pipeline Steps Snippet */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "12px",
                  borderRadius: "14px",
                  backgroundColor: "var(--beige)",
                  border: "1.5px solid rgba(46, 54, 69, 0.15)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700 }}>
                  <CheckCircle width={16} height={16} color="var(--green-d)" aria-hidden="true" />
                  <span>Gaussian Blur (sigma: 2.5)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700 }}>
                  <CheckCircle width={16} height={16} color="var(--green-d)" aria-hidden="true" />
                  <span>Color Modulate (Brightness: 110%)</span>
                </div>
              </div>

              {/* Full Width Green Button */}
              <Button
                variant="primary"
                size="md"
                onClick={handleStepAdvance}
                style={{ width: "100%" }}
                aria-label="Advance progress demo"
              >
                Continue Editing
              </Button>
            </ClayCard>
          </div>
        </div>
      </div>
    </section>
  );
}
