"use client";

import {
  Eye,
  Layers,
  Wand2,
  FileImage,
  SlidersHorizontal,
  Terminal,
  ShieldCheck,
  Lock,
  WifiOff,
  Code2,
} from "lucide-react";
import { COVERAGE_STATS } from "@/ops/stats";

const FEATURES_3x2 = [
  {
    icon: Eye,
    title: "Live Previews",
    desc: "Inspect adjustments instantaneously with real-time preview rendering directly in your browser.",
    tint: "var(--tile-blue)",
    color: "var(--blue)",
  },
  {
    icon: Layers,
    title: "Non-Destructive Pipeline",
    desc: "Reorder, disable, or fine-tune any operator step without ever degrading raw pixel data.",
    tint: "var(--tile-purple)",
    color: "var(--violet)",
  },
  {
    icon: Wand2,
    title: "Full ImageMagick Toolset",
    desc: `Over ${COVERAGE_STATS.ui} browser-native tools with an additional ${COVERAGE_STATS.nativeOnly} desktop operators for professional mastering.`,
    tint: "var(--tile-green)",
    color: "var(--green)",
  },
  {
    icon: FileImage,
    title: `${COVERAGE_STATS.formatsCount}+ Formats Supported`,
    desc: "Import and export JPEG, PNG, WebP, AVIF, TIFF, SVG, HDR, and specialty scientific raster formats.",
    tint: "var(--tile-rose)",
    color: "var(--pink)",
  },
  {
    icon: SlidersHorizontal,
    title: "Presets & Batch Processing",
    desc: "Export reusable JSON pipelines or shell commands, applying them across image libraries instantly.",
    tint: "var(--tile-amber)",
    color: "var(--orange)",
  },
  {
    icon: Terminal,
    title: "Native Linux Desktop App",
    desc: "Run fully offline with dedicated system resources and raw file access via the desktop build.",
    tint: "var(--tile-teal)",
    color: "var(--teal)",
  },
];

const SECURITY_ITEMS = [
  {
    icon: Lock,
    title: "Local Processing",
    desc: "Execution runs inside client WebAssembly memory. Zero bytes ever leave your device.",
  },
  {
    icon: ShieldCheck,
    title: "No Uploads",
    desc: "No third-party cloud servers, no analytics ingestion, and no image telemetry.",
  },
  {
    icon: WifiOff,
    title: "Offline-Capable",
    desc: "Service worker and WebAssembly runtime work completely disconnected from the internet.",
  },
  {
    icon: Code2,
    title: "Open Tooling",
    desc: "Built on battle-tested open source ImageMagick with transparent coverage manifests.",
  },
];

export default function Features() {
  return (
    <div id="features">
      {/* ── Built for Serious Editors ── */}
      <section className="mx-auto mb-20 max-w-[1240px] px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2
            className="font-display mb-3.5 text-[clamp(2rem,4vw,3rem)] font-bold"
            style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}
          >
            Built for Serious{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #64d2ff, #0a84ff 45%, #bf5af2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Editors
            </span>
          </h2>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            A high-performance workstation interface designed for pixel-perfect
            precision and non-destructive image workflows.
          </p>
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {FEATURES_3x2.map((f) => (
            <div
              key={f.title}
              className="clay-card clay-card-interactive p-7"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: f.tint, border: "1px solid var(--line)" }}
              >
                <f.icon size={20} color={f.color} aria-hidden="true" />
              </div>

              <h3 className="font-display mb-2 text-[1.08rem] font-bold" style={{ color: "var(--ink)" }}>
                {f.title}
              </h3>

              <p className="text-[0.88rem] leading-[1.65]" style={{ color: "var(--muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Card ── */}
      <section className="mx-auto mb-24 max-w-[1240px] px-4 md:px-6">
        <div
          className="grid rounded-3xl p-8 md:p-9"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {[
            {
              num: `${COVERAGE_STATS.total}`,
              label: "CLI Options",
              sub: "100% accounted in manifest",
              color: "var(--green)",
            },
            {
              num: `${COVERAGE_STATS.ui}`,
              label: "WASM In-Browser Tools",
              sub: "In-browser client execution",
              color: "var(--blue)",
            },
            {
              num: `${COVERAGE_STATS.formatsCount}+`,
              label: "Graphic Formats",
              sub: "Built-in decoding delegates",
              color: "var(--violet)",
            },
            {
              num: "100%",
              label: "Private & Offline",
              sub: "Zero data transferred",
              color: "var(--orange)",
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                textAlign: "left",
                borderRight: idx < 3 ? "1px solid var(--line)" : "none",
                paddingRight: idx < 3 ? "24px" : "0",
              }}
            >
              <div
                className="font-display mb-1.5"
                style={{
                  fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.num}
              </div>
              <div className="mb-0.5 text-[0.95rem] font-bold" style={{ color: "var(--ink)" }}>
                {stat.label}
              </div>
              <div className="text-[0.8rem]" style={{ color: "var(--muted)" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Security & Privacy Section ── */}
      <section className="mx-auto mb-24 max-w-[1240px] px-4 md:px-6">
        <div
          className="security-two-col grid items-center gap-12"
          style={{ gridTemplateColumns: "1fr" }}
        >
          {/* Left: List of 4 items */}
          <div>
            <h2
              className="font-display mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold"
              style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}
            >
              Private by{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #30d158, #64d2ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Design
              </span>
            </h2>
            <p
              className="mb-8 text-[0.98rem] leading-[1.65]"
              style={{ color: "var(--muted)" }}
            >
              Unlike traditional SaaS photo editors, Magick Studio never touches your
              personal photos or confidential corporate assets. Everything executes
              locally on your machine.
            </p>

            <div className="flex flex-col gap-5">
              {SECURITY_ITEMS.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--tile-blue)" }}
                  >
                    <item.icon size={18} color="var(--blue)" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="mb-0.5 text-[0.95rem] font-bold" style={{ color: "var(--ink)" }}>
                      {item.title}
                    </div>
                    <div className="text-[0.85rem] leading-[1.55]" style={{ color: "var(--muted)" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Security Card */}
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-[460px] overflow-hidden rounded-3xl p-8 md:p-9"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Soft colorful glow background */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "240px",
                  height: "240px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(10,132,255,0.22) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-60px",
                  left: "-40px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(191,90,242,0.14) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div
                className="relative z-[1] mb-2 text-[0.76rem] font-bold uppercase"
                style={{ color: "var(--muted)", letterSpacing: "0.05em" }}
              >
                Security Architecture
              </div>
              <div
                className="font-display relative z-[1] mb-6 text-2xl font-bold"
                style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}
              >
                Client Isolation Guarantee
              </div>

              {/* 4 small stat tiles */}
              <div
                className="relative z-[1] grid grid-cols-1 gap-4 sm:grid-cols-2"
                style={{ gap: "16px" }}
              >
                {[
                  { label: "Network Egress", val: "0 Bytes (Local)", color: "var(--green)" },
                  { label: "Engine Runtime", val: "WebAssembly", color: "var(--blue)" },
                  { label: "Telemetry", val: "None / Disabled", color: "var(--green)" },
                  { label: "Local State", val: "IndexedDB", color: "var(--blue)" },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: "var(--surface-2)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <div className="mb-1 text-[0.72rem]" style={{ color: "var(--muted)" }}>
                      {tile.label}
                    </div>
                    <div className="text-[0.95rem] font-bold" style={{ color: tile.color }}>
                      {tile.val}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="relative z-[1] mt-4 border-t text-[0.76rem] leading-[1.5]"
                style={{
                  color: "var(--muted)",
                  borderTop: "1px solid var(--line)",
                  paddingTop: "12px",
                }}
              >
                Verify in DevTools: Open the Network tab while editing — zero image requests leave your device.
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (min-width: 960px) {
            .security-two-col {
              grid-template-columns: 1.1fr 0.9fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
