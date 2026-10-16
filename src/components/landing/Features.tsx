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
    desc: "Inspect adjustments instantaneously with real-time hardware-accelerated preview rendering.",
  },
  {
    icon: Layers,
    title: "Non-Destructive Pipeline",
    desc: "Reorder, disable, or fine-tune any operator step without ever degrading raw pixel data.",
  },
  {
    icon: Wand2,
    title: "Full ImageMagick Toolset",
    desc: `Over ${COVERAGE_STATS.ui} browser-native tools with an additional ${COVERAGE_STATS.nativeOnly} desktop operators for professional mastering.`,
  },
  {
    icon: FileImage,
    title: `${COVERAGE_STATS.formatsCount}+ Formats Supported`,
    desc: "Import and export JPEG, PNG, WebP, AVIF, TIFF, SVG, HDR, and specialty scientific raster formats.",
  },
  {
    icon: SlidersHorizontal,
    title: "Presets & Batch Processing",
    desc: "Export reusable JSON pipelines or shell commands, applying them across image libraries instantly.",
  },
  {
    icon: Terminal,
    title: "Native Linux Desktop App",
    desc: "Run fully offline with multi-threaded FFTW, OpenMP, and raw hardware access via the desktop build.",
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
      {/* ── Built for Serious Editors (3x2 Grid) ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "14px",
              letterSpacing: "-0.02em",
            }}
          >
            Built for Serious{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #3089c5, #3fed1e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Editors
            </span>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--muted)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A high-performance workstation interface designed for pixel-perfect
            precision and non-destructive image workflows.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {FEATURES_3x2.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "28px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.borderColor = "var(--line-strong)";
                el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "var(--line)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "var(--tile)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <f.icon size={20} color="#3089c5" />
              </div>

              <h3
                className="font-display"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "8px",
                }}
              >
                {f.title}
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--muted)",
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Card ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto 90px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "36px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {[
            {
              num: `${COVERAGE_STATS.total}`,
              label: "CLI Options",
              sub: "100% accounted in manifest",
            },
            {
              num: `${COVERAGE_STATS.ui}`,
              label: "WASM In-Browser Tools",
              sub: "Zero latency client execution",
            },
            {
              num: `${COVERAGE_STATS.formatsCount}+`,
              label: "Graphic Formats",
              sub: "Built-in decoding delegates",
            },
            {
              num: "100%",
              label: "Private & Offline",
              sub: "Zero data transferred",
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                textAlign: "left",
                borderRight:
                  idx < 3 ? "1px solid var(--line)" : "none",
                paddingRight: idx < 3 ? "24px" : "0",
              }}
            >
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
                  fontWeight: 800,
                  color: "var(--green)",
                  lineHeight: 1.1,
                  marginBottom: "6px",
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "2px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Security & Privacy Section ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto 100px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
            alignItems: "center",
          }}
          className="security-two-col"
        >
          {/* Left: List of 4 items */}
          <div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Private by{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #3089c5, #3fed1e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Design
              </span>
            </h2>
            <p
              style={{
                fontSize: "0.98rem",
                color: "var(--muted)",
                lineHeight: 1.65,
                marginBottom: "32px",
              }}
            >
              Unlike traditional SaaS photo editors, Magick Studio never touches your
              personal photos or confidential corporate assets. Everything executes
              locally on your machine.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {SECURITY_ITEMS.map((item) => (
                <div
                  key={item.title}
                  style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: "var(--tile)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={18} color="#3089c5" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                        marginBottom: "3px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                        lineHeight: 1.55,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Security Card with 4 stat tiles and glowing circle */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "460px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "20px",
                padding: "36px 32px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                overflow: "hidden",
              }}
            >
              {/* Soft glowing circle background */}
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
                    "radial-gradient(circle, rgba(48,137,197,0.25) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Security Architecture
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "var(--ink)",
                  marginBottom: "24px",
                }}
              >
                Client Isolation Guarantee
              </div>

              {/* 4 small stat tiles */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {[
                  { label: "Network Activity", val: "0.0 KB/s", color: "var(--green)" },
                  { label: "Memory Isolation", val: "Sandbox", color: "#3089c5" },
                  { label: "Telemetry", val: "Disabled", color: "var(--green)" },
                  { label: "App Persistence", val: "IndexedDB", color: "#3089c5" },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    style={{
                      backgroundColor: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--muted)",
                        marginBottom: "4px",
                      }}
                    >
                      {tile.label}
                    </div>
                    <div
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: tile.color,
                      }}
                    >
                      {tile.val}
                    </div>
                  </div>
                ))}
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
