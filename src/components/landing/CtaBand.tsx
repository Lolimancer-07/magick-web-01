"use client";

import Link from "next/link";
import { Check, ArrowRight, Download } from "lucide-react";

export default function CtaBand() {
  return (
    <section
      id="download"
      style={{
        maxWidth: "1240px",
        margin: "0 auto 100px",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "64px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        {/* Subtle background glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(63,237,30,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "16px",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Start Editing in{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #3089c5, #3fed1e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Seconds
            </span>
          </h2>

          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--muted)",
              lineHeight: 1.65,
              marginBottom: "36px",
            }}
          >
            Experience the complete ImageMagick engine directly inside your browser.
            No account creation, no cloud sync lag, and completely free.
          </p>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <Link
              href="/editor"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                borderRadius: "12px",
                background: "var(--green)",
                color: "var(--green-ink)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 0 24px rgba(63,237,30,0.35)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 0 32px rgba(63,237,30,0.55)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 0 24px rgba(63,237,30,0.35)";
              }}
            >
              Open Editor →
            </Link>

            <a
              href="https://github.com/ImageMagick/ImageMagick"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                background: "var(--surface-2)",
                border: "1px solid var(--line-strong)",
                color: "var(--ink)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-2)";
              }}
            >
              <Download size={17} />
              Download App
            </a>
          </div>

          {/* Two checkmark lines */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              justifyContent: "center",
              fontSize: "0.88rem",
              color: "var(--muted)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Check size={16} color="var(--green)" />
              <span>No sign-up required</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Check size={16} color="var(--green)" />
              <span>Free and private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
