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

export default function PipelineTicker() {
  return (
    <section
      className="ticker-section"
      style={{
        maxWidth: "1240px",
        margin: "0 auto 50px",
      }}
    >
      <div
        className="ticker-card"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
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
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                fontSize: "0.8rem",
                fontWeight: 700,
                color: item.positive ? "var(--green)" : "var(--red)",
                backgroundColor: item.positive
                  ? "rgba(63,237,30,0.1)"
                  : "rgba(255,84,112,0.1)",
                padding: "3px 7px",
                borderRadius: "6px",
                flexShrink: 0,
              }}
            >
              {item.positive ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              {item.delta}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-section {
          padding: 0 16px;
        }
        .ticker-card {
          padding: 14px 16px;
        }
        @media (min-width: 600px) {
          .ticker-section {
            padding: 0 24px;
          }
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
