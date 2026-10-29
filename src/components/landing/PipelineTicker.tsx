"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const TICKER_ITEMS = [
  {
    step: "01",
    name: "Adaptive Resize",
    param: "Width 1920px (Lanczos)",
    delta: "−75% file weight",
    positive: true,
  },
  {
    step: "02",
    name: "Tone Modulation",
    param: "Brightness 105% · Sat 110%",
    delta: "+18% vibrance",
    positive: true,
  },
  {
    step: "03",
    name: "Unsharp Mask",
    param: "Radius 1.5 · Sigma 1.0",
    delta: "+12% edge acuity",
    positive: true,
  },
];

const STEP_TINTS = [
  { bg: "var(--tile-blue)", color: "var(--blue)" },
  { bg: "var(--tile-teal)", color: "var(--teal)" },
  { bg: "var(--tile-purple)", color: "var(--violet)" },
];

export default function PipelineTicker() {
  return (
    <section
      className="ticker-section mx-auto mb-12 max-w-[1240px] px-4 md:px-6"
    >
      <div
        className="ticker-card grid gap-4 rounded-3xl"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {TICKER_ITEMS.map((item, index) => (
          <div
            key={item.name}
            className={`ticker-item ${index < TICKER_ITEMS.length - 1 ? "ticker-has-next" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="font-mono flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[0.72rem] font-bold"
                style={{
                  backgroundColor: STEP_TINTS[index % STEP_TINTS.length].bg,
                  color: STEP_TINTS[index % STEP_TINTS.length].color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {item.step}
              </div>
              <div className="min-w-0">
                <div
                  className="truncate text-[0.88rem] font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {item.name}
                </div>
                <div className="truncate text-[0.75rem]" style={{ color: "var(--muted)" }}>
                  {item.param}
                </div>
              </div>
            </div>

            <div
              className="flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-[3px] text-[0.8rem] font-bold"
              style={{
                color: item.positive ? "var(--green)" : "var(--red)",
                backgroundColor: item.positive
                  ? "rgba(48,209,88,0.1)"
                  : "rgba(255,69,58,0.1)",
              }}
            >
              {item.positive ? (
                <ArrowUpRight size={13} aria-hidden="true" />
              ) : (
                <ArrowDownRight size={13} aria-hidden="true" />
              )}
              {item.delta}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-card {
          padding: 14px 16px;
        }
        @media (min-width: 600px) {
          .ticker-card {
            padding: 18px 28px;
            gap: 20px;
          }
          .ticker-has-next {
            padding-right: 16px;
            border-right: 1px solid var(--line);
          }
        }
      `}</style>
    </section>
  );
}
