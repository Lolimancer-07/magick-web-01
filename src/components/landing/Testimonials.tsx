"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Digital Illustrator",
    initial: "A",
    tint: "var(--tile-green)",
    border: "rgba(48,209,88,.20)",
    accent: "#6ee7a0",
    quote: "Magick Studio has completely replaced heavy desktop editors for my daily image prep. The non-destructive pipeline is super intuitive and fast.",
  },
  {
    name: "Elena Rostova",
    role: "Photographer & Retoucher",
    initial: "E",
    tint: "var(--tile-blue)",
    border: "rgba(10,132,255,.20)",
    accent: "#6db5ff",
    quote: "Having 100% private, local processing in the browser is a game changer for confidential client photos. Zero uploads, zero risk.",
  },
  {
    name: "Marcus Vance",
    role: "Game Texture Artist",
    initial: "M",
    tint: "var(--tile-purple)",
    border: "rgba(191,90,242,.20)",
    accent: "#d0a5f7",
    quote: "The instant preview response and offline Linux desktop packaging make this an essential tool in my creative asset pipeline.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="creators"
      className="scroll-mt-20 px-4 py-20 md:px-6 md:pb-24 md:pt-24"
      style={{ backgroundColor: "var(--bg)" }}
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
              Creator Stories
            </span>
          </div>
          <h2
            className="font-display mb-3.5 text-[clamp(2rem,4vw,3rem)] font-bold"
            style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}
          >
            Loved by Creators
          </h2>
          <p
            className="mx-auto max-w-[400px] text-base leading-[1.7]"
            style={{ color: "var(--muted)" }}
          >
            Professionals use Magick Studio daily for image editing workflows.
          </p>
        </div>

        {/* Testimonials grid */}
        <div
          className="testimonials-grid grid gap-5"
          style={{ gridTemplateColumns: "1fr" }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-3xl p-7 transition-all duration-200"
              style={{
                background: "var(--surface)",
                border: `1px solid var(--line)`,
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "var(--shadow-md)";
                el.style.borderColor = t.border;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "var(--shadow-sm)";
                el.style.borderColor = "var(--line)";
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--gold)" stroke="none" aria-hidden="true" />
                ))}
              </div>

              {/* Quote */}
              <p
                className="flex-1 text-[0.92rem] leading-[1.75]"
                style={{ color: "var(--muted)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="font-display flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold"
                  style={{
                    background: t.tint,
                    border: `1px solid ${t.border}`,
                    color: t.accent,
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-display text-[0.9rem] font-bold" style={{ color: "var(--ink)" }}>
                    {t.name}
                  </div>
                  <div className="text-[0.78rem] font-medium" style={{ color: "var(--muted)" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
