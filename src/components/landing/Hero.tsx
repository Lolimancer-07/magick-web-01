"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Sliders, CheckCircle2, Sparkles, Layers } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"original" | "edited" | "split">("edited");

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        maxWidth: "1240px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Background glow & faint grid */}
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid-bg" aria-hidden="true" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "56px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-two-column"
      >
        {/* ── Left Column: Headline & Action ── */}
        <div style={{ maxWidth: "580px" }}>
          {/* Badge */}
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(63,237,30,0.12)",
                border: "1px solid rgba(63,237,30,0.3)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--green)",
                  boxShadow: "0 0 8px var(--green)",
                }}
              />
              Runs 100% in your browser
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.9rem, 5.5vw, 4.2rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "24px",
            }}
          >
            Edit Images with{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #3089c5, #3fed1e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Precision
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.65,
              color: "var(--muted)",
              marginBottom: "36px",
              maxWidth: "500px",
            }}
          >
            The world’s most trusted image manipulation engine now runs directly inside your
            browser via WebAssembly. Zero cloud uploads, 100% private, instant feedback.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              marginBottom: "36px",
            }}
          >
            <Link
              href="/editor"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                borderRadius: "12px",
                background: "var(--green)",
                color: "var(--green-ink)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 0 24px rgba(63,237,30,0.35)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 0 32px rgba(63,237,30,0.55)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 0 24px rgba(63,237,30,0.35)";
              }}
            >
              Start Editing →
            </Link>

            <a
              href="#tools"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                borderRadius: "12px",
                background: "var(--surface)",
                border: "1px solid var(--line-strong)",
                color: "var(--ink)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--surface)";
              }}
            >
              Browse Tools
            </a>
          </div>

          {/* Trust items */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "center",
              color: "var(--muted)",
              fontSize: "0.86rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={16} color="var(--green)" />
              <span>Private: nothing is uploaded</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Zap size={16} color="#3089c5" />
              <span>Works offline in the app</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Chart & Preview Card with Floating Chips ── */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>

            {/* Floating Chip 1 (Top Left): Blur */}
            <div
              className="floating-chip hero-float-chip"
              style={{
                position: "absolute",
                top: "-18px",
                left: "-18px",
                zIndex: 10,
                padding: "10px 16px",
                borderRadius: "12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line-strong)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "var(--tile)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sliders size={15} color="#3089c5" />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink)" }}>
                  Blur σ 2.0
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--green)" }}>
                  Δ +24% smooth
                </div>
              </div>
            </div>

            {/* Floating Chip 2 (Bottom Right): Sharpen */}
            <div
              className="floating-chip hero-float-chip"
              style={{
                position: "absolute",
                bottom: "-18px",
                right: "-18px",
                zIndex: 10,
                padding: "10px 16px",
                borderRadius: "12px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line-strong)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                animationDelay: "1.5s",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "var(--tile)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={15} color="#3089c5" />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink)" }}>
                  Sharpen +1.5
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--green)" }}>
                  Δ +18% micro-contrast
                </div>
              </div>
            </div>

            {/* Main Preview Chart Card */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Live Tone Curve & Pipeline
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                    24-Bit HDRI
                  </div>
                </div>

                {/* Range Tabs */}
                <div
                  style={{
                    display: "flex",
                    background: "var(--surface-2)",
                    padding: "3px",
                    borderRadius: "8px",
                    gap: "2px",
                  }}
                >
                  {(["original", "edited", "split"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        textTransform: "capitalize",
                        backgroundColor: activeTab === tab ? "var(--blue)" : "transparent",
                        color: activeTab === tab ? "#ffffff" : "var(--muted)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Green Area Chart / Histogram SVG */}
              <div
                style={{
                  height: "150px",
                  width: "100%",
                  marginBottom: "20px",
                  position: "relative",
                  background: "rgba(15, 19, 32, 0.6)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  padding: "8px",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <svg
                  viewBox="0 0 400 150"
                  preserveAspectRatio="none"
                  style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3fed1e" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#3fed1e" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  <line x1="0" y1="37" x2="400" y2="37" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="112" x2="400" y2="112" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                  {/* Area fill */}
                  <path
                    d="M 0,140 Q 40,110 80,120 T 160,80 T 240,40 T 320,60 T 400,20 L 400,150 L 0,150 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Line curve */}
                  <path
                    d="M 0,140 Q 40,110 80,120 T 160,80 T 240,40 T 320,60 T 400,20"
                    fill="none"
                    stroke="#3fed1e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Active highlight point */}
                  <circle cx="240" cy="40" r="5" fill="#3fed1e" />
                  <circle cx="240" cy="40" r="10" fill="#3fed1e" opacity="0.3" />
                </svg>
              </div>

              {/* Status / mini preview details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "var(--surface-2)",
                  border: "1px solid var(--line)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>
                    Active Filter
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--ink)" }}>
                    Sigmoidal Contrast (5.0, 50%)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>
                    Color Space
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--green)" }}>
                    sRGB D65 Standard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 60px 16px 70px;
        }
        @media (min-width: 600px) {
          .hero-section {
            padding: 80px 24px 100px;
          }
        }
        @media (min-width: 960px) {
          .hero-two-column {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
}
