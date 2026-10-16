"use client";

import { ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

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

export default function PipelineTicker() {
  return (
    <section
      style={{
        maxWidth: "1240px",
        margin: "0 auto 60px",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "18px 28px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        }}
      >
        {TICKER_ITEMS.map((item, index) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: index < TICKER_ITEMS.length - 1 ? "16px" : 0,
              borderRight:
                index < TICKER_ITEMS.length - 1
                  ? "1px solid var(--line)"
                  : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "var(--tile)",
                  color: "#3089c5",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {item.step}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                  }}
                >
                  {item.param}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: item.positive ? "var(--green)" : "var(--red)",
                backgroundColor: item.positive
                  ? "rgba(63,237,30,0.1)"
                  : "rgba(255,84,112,0.1)",
                padding: "4px 8px",
                borderRadius: "6px",
              }}
            >
              {item.positive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {item.delta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
