"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Digital Illustrator",
    initial: "A",
    gradient: "linear-gradient(135deg, rgba(63,237,30,.25), rgba(63,237,30,.05))",
    border: "rgba(63,237,30,.2)",
    quote: "Magick Studio has completely replaced heavy desktop editors for my daily image prep. The non-destructive pipeline is super intuitive and fast.",
  },
  {
    name: "Elena Rostova",
    role: "Photographer & Retoucher",
    initial: "E",
    gradient: "linear-gradient(135deg, rgba(48,137,197,.2), rgba(48,137,197,.05))",
    border: "rgba(48,137,197,.2)",
    quote: "Having 100% private, local processing in the browser is a game changer for confidential client photos. Zero uploads, zero risk.",
  },
  {
    name: "Marcus Vance",
    role: "Game Texture Artist",
    initial: "M",
    gradient: "linear-gradient(135deg, rgba(130,100,220,.2), rgba(130,100,220,.05))",
    border: "rgba(130,100,220,.2)",
    quote: "The instant preview response and offline Linux desktop packaging make this an essential tool in my creative asset pipeline.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="creators"
      style={{
        backgroundColor: "var(--bg)",
        padding: "90px 24px 100px",
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
              Creator Stories
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
            Loved by Creators
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.7 }}>
            Professionals use Magick Studio daily for image editing workflows.
          </p>
        </div>

        {/* Testimonials grid */}
        <div
          className="testimonials-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "28px 24px",
                borderRadius: "16px",
                background: "var(--surface)",
                border: `1px solid ${t.border}`,
                boxShadow: "0 4px 16px rgba(0,0,0,.3)",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 12px 32px rgba(0,0,0,.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 16px rgba(0,0,0,.3)";
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--gold)" stroke="none" aria-hidden="true" />
                ))}
              </div>

              {/* Quote */}
              <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.75, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: t.gradient,
                    border: `1px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                    flexShrink: 0,
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
