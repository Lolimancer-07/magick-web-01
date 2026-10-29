"use client";

import { useState } from "react";
import Link from "next/link";
import { Wand2, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Tools", href: "#tools" },
  { label: "Formats", href: "#formats" },
  { label: "Download", href: "#download" },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--line)] backdrop-saturate-150"
      style={{
        backgroundColor: "var(--bg-nav)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="navbar-container mx-auto flex max-w-[1240px] items-center justify-between px-4 py-3 md:px-6 md:py-3.5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{
              background: "linear-gradient(135deg, #0a84ff, #bf5af2)",
              boxShadow: "0 2px 12px rgba(10,132,255,0.35)",
            }}
          >
            <Wand2 size={17} aria-hidden="true" />
          </div>
          <span
            className="font-display text-[1.1rem] font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Magick Studio
          </span>
        </Link>

        {/* Center Desktop Links */}
        <div className="desktop-nav-links items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.9rem] font-medium text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#download"
            className="desktop-nav-download text-[0.9rem] font-medium text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)]"
          >
            Download
          </a>

          <Link
            href="/app/"
            className="nav-cta-btn inline-flex items-center justify-center rounded-full px-[18px] py-2 text-[0.88rem] font-bold transition-transform duration-150 hover:scale-[1.03] active:scale-95"
            style={{
              background: "var(--green)",
              color: "var(--green-ink)",
              fontFamily: "var(--font-display)",
              boxShadow: "0 2px 14px rgba(48,209,88,0.3)",
            }}
          >
            Open Editor
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-hamburger items-center justify-center p-1.5 text-[var(--ink)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="flex flex-col gap-5 border-t border-[var(--line)] px-6 pb-6 pt-4"
          style={{ backgroundColor: "var(--bg-nav)", backdropFilter: "blur(20px)" }}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[var(--ink)]"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 480px) {
          .nav-cta-btn {
            padding: 7px 13px !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </header>
  );
}
