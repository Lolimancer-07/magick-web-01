"use client";

import { useState } from "react";
import Link from "next/link";
import { Wand2, Menu, X } from "lucide-react";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        backgroundColor: "rgba(20, 25, 48, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1b4052, #3089c5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(48,137,197,0.3)",
            }}
          >
            <Wand2 size={18} color="#f2f4fb" aria-hidden="true" />
          </div>
          <span
            className="font-display"
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Magick Studio
          </span>
        </Link>

        {/* Center Desktop Links */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "28px",
          }}
          className="desktop-nav-links"
        >
          {[
            { label: "Features", href: "#features" },
            { label: "Tools", href: "#tools" },
            { label: "Formats", href: "#formats" },
            { label: "Download", href: "#download" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--muted)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <a
            href="#download"
            className="desktop-nav-download"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "var(--muted)",
              textDecoration: "none",
              display: "none",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            Download
          </a>

          <Link
            href="/editor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "9px 20px",
              borderRadius: "10px",
              background: "var(--green)",
              color: "var(--green-ink)",
              fontFamily: "var(--font-display)",
              fontSize: "0.88rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 0 16px rgba(63,237,30,0.3)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 0 24px rgba(63,237,30,0.5)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 0 16px rgba(63,237,30,0.3)";
            }}
          >
            Open Editor
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--ink)",
              cursor: "pointer",
              padding: "6px",
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: "16px 24px 24px",
            borderTop: "1px solid var(--line)",
            backgroundColor: "var(--bg-nav)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {[
            { label: "Features", href: "#features" },
            { label: "Tools", href: "#tools" },
            { label: "Formats", href: "#formats" },
            { label: "Download", href: "#download" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--ink)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .desktop-nav-download {
            display: inline-block !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
