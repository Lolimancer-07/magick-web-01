"use client";

import Link from "next/link";
import { Sparkles, Crop, Palette, Wand2, Eye, Zap, Layers, ArrowRight } from "lucide-react";

interface ToolCardData {
  title: string;
  category: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  icon: typeof Sparkles;
  iconColor: string;
  iconBg: string;
  meta: [string, string, string];
  opId: string;
}

const CATALOG_ITEMS: ToolCardData[] = [
  {
    title: "Blur & Sharpen",
    category: "Filtering",
    tag: "Popular",
    tagColor: "var(--green)",
    tagBg: "rgba(63,237,30,.12)",
    icon: Sparkles,
    iconColor: "var(--green)",
    iconBg: "rgba(63,237,30,.12)",
    meta: ["4 operations", "Live Preview", "WASM Engine"],
    opId: "blur",
  },
  {
    title: "Crop & Resize",
    category: "Geometry",
    tag: "Essential",
    tagColor: "#70b8f0",
    tagBg: "rgba(48,137,197,.12)",
    icon: Crop,
    iconColor: "#70b8f0",
    iconBg: "rgba(48,137,197,.12)",
    meta: ["6 operations", "Smart Crop", "Custom Size"],
    opId: "resize",
  },
  {
    title: "Color Grading",
    category: "Color",
    tag: "Pro",
    tagColor: "var(--amber)",
    tagBg: "rgba(245,166,35,.1)",
    icon: Palette,
    iconColor: "var(--amber)",
    iconBg: "rgba(245,166,35,.1)",
    meta: ["8 operations", "HSL / Curves", "Auto Level"],
    opId: "colorize",
  },
  {
    title: "Filters & Effects",
    category: "Effects",
    tag: "Creative",
    tagColor: "#b09ee0",
    tagBg: "rgba(130,100,220,.12)",
    icon: Wand2,
    iconColor: "#b09ee0",
    iconBg: "rgba(130,100,220,.12)",
    meta: ["12+ effects", "Noise Reduce", "Edge Detect"],
    opId: "blur",
  },
  {
    title: "Preview Compare",
    category: "Workflow",
    tag: "New",
    tagColor: "var(--green)",
    tagBg: "rgba(63,237,30,.1)",
    icon: Eye,
    iconColor: "var(--green)",
    iconBg: "rgba(63,237,30,.1)",
    meta: ["Side-by-side", "Before / After", "Zoom Pan"],
    opId: "blur",
  },
  {
    title: "Batch Pipeline",
    category: "Advanced",
    tag: "Pro",
    tagColor: "var(--amber)",
    tagBg: "rgba(245,166,35,.1)",
    icon: Layers,
    iconColor: "var(--amber)",
    iconBg: "rgba(245,166,35,.1)",
    meta: ["Multi-step", "Undo / Redo", "Export All"],
    opId: "blur",
  },
  {
    title: "Format Export",
    category: "Export",
    tag: "Essential",
    tagColor: "#70b8f0",
    tagBg: "rgba(48,137,197,.12)",
    icon: Zap,
    iconColor: "#70b8f0",
    iconBg: "rgba(48,137,197,.12)",
    meta: ["PNG, JPEG, WebP", "Quality Control", "Full Res"],
    opId: "blur",
  },
  {
    title: "Auto Enhance",
    category: "AI Tools",
    tag: "New",
    tagColor: "var(--green)",
    tagBg: "rgba(63,237,30,.1)",
    icon: Sparkles,
    iconColor: "var(--green)",
    iconBg: "rgba(63,237,30,.12)",
    meta: ["1-click enhance", "Auto Normalize", "Smart Fill"],
    opId: "blur",
  },
];

export default function ToolCatalog() {
  return (
    <section
      id="tools"
      style={{
        padding: "90px 24px 100px",
        backgroundColor: "var(--surface)",
        scrollMarginTop: "80px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ marginBottom: "14px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "9999px",
                background: "rgba(63,237,30,.1)",
                border: "1px solid rgba(63,237,30,.25)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--green)",
                letterSpacing: "0.06em",
                fontFamily: "var(--font-display)",
                textTransform: "uppercase",
              }}
            >
              Tool Catalog
            </span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "14px",
              letterSpacing: "-0.02em",
            }}
          >
            Popular Operations
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            150+ ImageMagick operations available, all running privately in your browser.
          </p>
        </div>

        {/* Grid */}
        <div
          className="catalog-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "40px" }}
        >
          {CATALOG_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={`/editor?op=${item.opId}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  boxShadow: "0 2px 8px rgba(0,0,0,.3)",
                  transition: "all .2s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = "0 8px 24px rgba(0,0,0,.4)";
                  el.style.borderColor = "var(--line-2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 8px rgba(0,0,0,.3)";
                  el.style.borderColor = "var(--line)";
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: item.iconBg,
                      border: `1px solid ${item.tagBg.replace(".12", ".25").replace(".1", ".2")}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.iconColor,
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={18} aria-hidden="true" />
                  </div>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: item.tagColor,
                      background: item.tagBg,
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                      flexShrink: 0,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Title + category */}
                <div>
                  <div
                    className="font-display"
                    style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2px" }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--dim)", fontWeight: 500 }}>{item.category}</div>
                </div>

                {/* Meta pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {item.meta.map((m) => (
                    <span
                      key={m}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "5px",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: "var(--dim)",
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/editor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              borderRadius: "12px",
              background: "transparent",
              border: "1px solid var(--line-2)",
              color: "var(--ink)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all .18s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--surface-2)";
              el.style.borderColor = "rgba(255,255,255,.2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "var(--line-2)";
            }}
          >
            View All Operations <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
