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
    tagColor: "#6ee7a0",
    tagBg: "rgba(48,209,88,.12)",
    icon: Sparkles,
    iconColor: "#6ee7a0",
    iconBg: "rgba(48,209,88,.12)",
    meta: ["4 operations", "Live Preview", "WASM Engine"],
    opId: "blur",
  },
  {
    title: "Crop & Resize",
    category: "Geometry",
    tag: "Essential",
    tagColor: "#6db5ff",
    tagBg: "rgba(10,132,255,.12)",
    icon: Crop,
    iconColor: "#6db5ff",
    iconBg: "rgba(10,132,255,.12)",
    meta: ["6 operations", "Smart Crop", "Custom Size"],
    opId: "resize",
  },
  {
    title: "Color Grading",
    category: "Color",
    tag: "Pro",
    tagColor: "#ffb84d",
    tagBg: "rgba(255,159,10,.12)",
    icon: Palette,
    iconColor: "#ffb84d",
    iconBg: "rgba(255,159,10,.12)",
    meta: ["8 operations", "HSL / Curves", "Auto Level"],
    opId: "colorize",
  },
  {
    title: "Filters & Effects",
    category: "Effects",
    tag: "Creative",
    tagColor: "#d0a5f7",
    tagBg: "rgba(191,90,242,.12)",
    icon: Wand2,
    iconColor: "#d0a5f7",
    iconBg: "rgba(191,90,242,.12)",
    meta: ["12+ effects", "Noise Reduce", "Edge Detect"],
    opId: "blur",
  },
  {
    title: "Preview Compare",
    category: "Workflow",
    tag: "New",
    tagColor: "#7adcf0",
    tagBg: "rgba(64,200,224,.12)",
    icon: Eye,
    iconColor: "#7adcf0",
    iconBg: "rgba(64,200,224,.12)",
    meta: ["Side-by-side", "Before / After", "Zoom Pan"],
    opId: "blur",
  },
  {
    title: "Batch Pipeline",
    category: "Advanced",
    tag: "Pro",
    tagColor: "#ffb84d",
    tagBg: "rgba(255,159,10,.12)",
    icon: Layers,
    iconColor: "#ffb84d",
    iconBg: "rgba(255,159,10,.12)",
    meta: ["Multi-step", "Undo / Redo", "Export All"],
    opId: "blur",
  },
  {
    title: "Format Export",
    category: "Export",
    tag: "Essential",
    tagColor: "#6db5ff",
    tagBg: "rgba(10,132,255,.12)",
    icon: Zap,
    iconColor: "#6db5ff",
    iconBg: "rgba(10,132,255,.12)",
    meta: ["PNG, JPEG, WebP", "Quality Control", "Full Res"],
    opId: "blur",
  },
  {
    title: "Auto Enhance",
    category: "AI Tools",
    tag: "New",
    tagColor: "#ff8fa6",
    tagBg: "rgba(255,55,95,.12)",
    icon: Sparkles,
    iconColor: "#ff8fa6",
    iconBg: "rgba(255,55,95,.12)",
    meta: ["1-click enhance", "Auto Normalize", "Smart Fill"],
    opId: "blur",
  },
];

export default function ToolCatalog() {
  return (
    <section
      id="tools"
      className="scroll-mt-20 px-4 py-20 md:px-6 md:pb-24 md:pt-24"
      style={{
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-3.5">
            <span
              className="font-display inline-flex items-center gap-1.5 rounded-full px-3.5 py-[5px] text-[0.75rem] font-bold uppercase"
              style={{
                background: "rgba(48,209,88,.10)",
                border: "1px solid rgba(48,209,88,.24)",
                color: "#6ee7a0",
                letterSpacing: "0.05em",
              }}
            >
              Tool Catalog
            </span>
          </div>
          <h2
            className="font-display mb-3.5 text-[clamp(2rem,4vw,3rem)] font-bold"
            style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}
          >
            Popular Operations
          </h2>
          <p
            className="mx-auto max-w-[480px] text-base leading-[1.7]"
            style={{ color: "var(--muted)" }}
          >
            150+ ImageMagick operations available, all running privately in your browser.
          </p>
        </div>

        {/* Grid */}
        <div
          className="catalog-grid mb-10 grid gap-4"
          style={{ gridTemplateColumns: "1fr" }}
        >
          {CATALOG_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={`/app/?op=${item.opId}`}
              className="block"
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex cursor-pointer flex-col gap-3.5 rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = "var(--shadow-md)";
                  el.style.borderColor = "var(--line-2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "var(--shadow-sm)";
                  el.style.borderColor = "var(--line)";
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: item.iconBg,
                      border: `1px solid ${item.tagBg.replace(".12", ".25")}`,
                    }}
                  >
                    <item.icon size={18} color={item.iconColor} aria-hidden="true" />
                  </div>
                  <span
                    className="font-display flex-shrink-0 rounded-lg px-2.5 py-[3px] text-[0.7rem] font-bold"
                    style={{
                      color: item.tagColor,
                      background: item.tagBg,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Title + category */}
                <div>
                  <div
                    className="font-display mb-0.5 text-[0.95rem] font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    {item.title}
                  </div>
                  <div className="text-[0.75rem] font-medium" style={{ color: "var(--dim)" }}>
                    {item.category}
                  </div>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-1.5">
                  {item.meta.map((m) => (
                    <span
                      key={m}
                      className="rounded-lg px-2 py-[2px] text-[0.68rem] font-semibold"
                      style={{
                        color: "var(--muted)",
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
        <div className="text-center">
          <Link
            href="/app/"
            className="btn-clay btn-white"
          >
            View All Operations
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
