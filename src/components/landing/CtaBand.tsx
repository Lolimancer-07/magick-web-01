"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function CtaBand() {
  return (
    <section
      id="download"
      className="mx-auto mb-24 max-w-[1240px] scroll-mt-20 px-4 md:px-6"
    >
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-16 text-center"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Colorful aurora glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "18%",
            transform: "translate(-50%, -50%)",
            width: "480px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(10,132,255,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "82%",
            transform: "translate(-50%, -50%)",
            width: "480px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(191,90,242,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "240px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(48,209,88,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative z-[1] mx-auto max-w-[640px]">
          <h2
            className="font-display mb-4"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
            }}
          >
            Start Editing in{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #0a84ff, #bf5af2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Seconds
            </span>
          </h2>

          <p
            className="mb-9 text-[1.05rem] leading-[1.65]"
            style={{ color: "var(--muted)" }}
          >
            Experience the complete ImageMagick engine directly inside your browser.
            No account creation, no cloud sync lag, and completely free.
          </p>

          {/* Action buttons */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app/"
              id="cta-band-open-editor-btn"
              className="btn-clay btn-green text-base"
              style={{ padding: "14px 32px", fontSize: "1rem" }}
            >
              Open Studio
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* Two checkmark lines */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 text-[0.88rem]"
            style={{ color: "var(--muted)" }}
          >
            <div className="flex items-center gap-2">
              <Check size={16} color="var(--green)" aria-hidden="true" />
              <span>No sign-up required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} color="var(--green)" aria-hidden="true" />
              <span>Free and private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
