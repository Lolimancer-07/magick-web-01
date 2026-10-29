"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Sliders, CheckCircle2, Sparkles, Layers } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"original" | "edited" | "split">("edited");

  return (
    <section
      className="hero-section relative mx-auto max-w-[1240px] overflow-hidden px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20"
    >
      {/* Background glow & faint grid */}
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid-bg" aria-hidden="true" />

      <div
        className="hero-two-column relative z-[1] grid grid-cols-1 items-center gap-12 md:gap-14"
      >
        {/* ── Left Column: Headline & Action ── */}
        <div className="max-w-[580px]">
          {/* Badge */}
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold"
              style={{
                background: "rgba(48,209,88,0.10)",
                border: "1px solid rgba(48,209,88,0.26)",
                color: "var(--ink)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)" }}
              />
              Runs 100% in your browser
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display mb-6 text-[clamp(2.1rem,5.5vw,4.2rem)] font-bold"
            style={{ lineHeight: 1.06, letterSpacing: "-0.035em", color: "var(--ink)" }}
          >
            Edit Images with{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #64d2ff, #0a84ff 45%, #bf5af2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Precision
            </span>
          </h1>

          <p
            className="mb-9 max-w-[500px] text-[1.08rem] leading-[1.65]"
            style={{ color: "var(--muted)" }}
          >
            The world&rsquo;s most trusted image engine now runs directly inside your
            browser via WebAssembly. Zero cloud uploads, 100% private, instant feedback.
          </p>

          {/* Buttons */}
          <div className="mb-9 flex flex-wrap items-center gap-4">
            <Link
              href="/app/"
              id="hero-open-editor-btn"
              className="btn-clay btn-green text-base"
              style={{ padding: "14px 30px", fontSize: "1rem" }}
            >
              Open Studio
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* Trust items */}
          <div className="flex flex-wrap items-center gap-6 text-[0.86rem]" style={{ color: "var(--muted)" }}>
            <div className="flex items-center gap-2">
              <Shield size={16} color="var(--green)" aria-hidden="true" />
              <span>Nothing is uploaded — 100% private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} color="var(--teal)" aria-hidden="true" />
              <span>No sign-up, free, open source</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Histogram Card with Floating Chips ── */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-[480px]">
            {/* Floating Chip 1 (Top Left): Blur */}
            <div
              className="floating-chip hero-float-chip absolute left-[-18px] top-[-18px] z-10 flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
              style={{
                backgroundColor: "color-mix(in srgb, var(--surface) 88%, transparent)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--line-2)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--tile-blue)" }}
              >
                <Sliders size={15} color="var(--blue)" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[0.8rem] font-bold" style={{ color: "var(--ink)" }}>
                  Blur σ 2.0
                </div>
                <div className="text-[0.72rem] font-semibold" style={{ color: "var(--green)" }}>
                  Δ +24% smooth
                </div>
              </div>
            </div>

            {/* Floating Chip 2 (Bottom Right): Sharpen */}
            <div
              className="floating-chip hero-float-chip absolute bottom-[-18px] right-[-18px] z-10 flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
              style={{
                backgroundColor: "color-mix(in srgb, var(--surface) 88%, transparent)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--line-2)",
                boxShadow: "var(--shadow-md)",
                animationDelay: "1.5s",
              }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--tile-purple)" }}
              >
                <Sparkles size={15} color="var(--violet)" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[0.8rem] font-bold" style={{ color: "var(--ink)" }}>
                  Sharpen +1.5
                </div>
                <div className="text-[0.72rem] font-semibold" style={{ color: "var(--green)" }}>
                  Δ +18% micro-contrast
                </div>
              </div>
            </div>

            {/* Main Preview Card */}
            <div
              className="rounded-3xl p-6"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div
                    className="text-[0.75rem] font-semibold uppercase"
                    style={{ color: "var(--muted)", letterSpacing: "0.04em" }}
                  >
                    Live Tone &amp; Pipeline
                  </div>
                  <div className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
                    Live Histogram
                  </div>
                </div>

                {/* Apple-style segmented control */}
                <div
                  className="flex gap-0.5 rounded-xl p-[3px]"
                  style={{ background: "var(--surface-3)", padding: "3px" }}
                >
                  {(["original", "edited", "split"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className="rounded-lg px-2.5 py-1 text-[0.75rem] font-semibold capitalize transition-all duration-150"
                      style={{
                        backgroundColor: activeTab === tab ? "var(--blue)" : "transparent",
                        color: activeTab === tab ? "#ffffff" : "var(--muted)",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Histogram SVG */}
              <div
                className="relative mb-5 flex h-[150px] w-full items-end overflow-hidden rounded-2xl p-2"
                style={{ background: "rgba(8, 8, 10, 0.55)" }}
              >
                <svg
                  viewBox="0 0 400 150"
                  preserveAspectRatio="none"
                  className="h-full w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#64d2ff" stopOpacity="0.4" />
                      <stop offset="55%" stopColor="#0a84ff" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0a84ff" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#64d2ff" />
                      <stop offset="55%" stopColor="#0a84ff" />
                      <stop offset="100%" stopColor="#bf5af2" />
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

                  {/* Gradient line curve */}
                  <path
                    d="M 0,140 Q 40,110 80,120 T 160,80 T 240,40 T 320,60 T 400,20"
                    fill="none"
                    stroke="url(#chartLine)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Active highlight point */}
                  <circle cx="240" cy="40" r="5" fill="#bf5af2" />
                  <circle cx="240" cy="40" r="10" fill="#bf5af2" opacity="0.3" />
                </svg>
              </div>

              {/* Status / mini preview details */}
              <div
                className="grid grid-cols-1 gap-3 rounded-2xl sm:grid-cols-2"
                style={{
                  backgroundColor: "var(--surface-2)",
                  border: "1px solid var(--line)",
                  padding: "12px",
                }}
              >
                <div>
                  <div className="text-[0.7rem] uppercase" style={{ color: "var(--muted)", letterSpacing: "0.04em" }}>
                    Active Filter
                  </div>
                  <div className="text-[0.88rem] font-bold" style={{ color: "var(--ink)" }}>
                    Sigmoidal Contrast (5.0, 50%)
                  </div>
                </div>
                <div>
                  <div className="text-[0.7rem] uppercase" style={{ color: "var(--muted)", letterSpacing: "0.04em" }}>
                    Color Space
                  </div>
                  <div className="text-[0.88rem] font-bold" style={{ color: "var(--green)" }}>
                    sRGB D65 Standard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
