"use client";

import { useState } from "react";
import Link from "next/link";
import { Wand2, Menu, X, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import IconTile from "@/components/ui/IconTile";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: "20px",
        zIndex: 100,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      <nav
        className="clay-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderRadius: "20px",
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconTile color="salmon" size="sm">
            <Wand2 width={18} height={18} aria-hidden="true" />
          </IconTile>
          <span
            className="font-display"
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Magick<span style={{ color: "var(--green-d)" }}>Studio</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "28px",
          }}
          className="desktop-nav-links"
        >
          <a
            href="#tools"
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)" }}
          >
            Tools
          </a>
          <a
            href="#features"
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)" }}
          >
            Features
          </a>
          <a
            href="#creators"
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)" }}
          >
            Creators
          </a>
          <a
            href="#download"
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)" }}
          >
            Download
          </a>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="#download"
            style={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "var(--ink)",
              display: "none",
            }}
            className="desktop-nav-download"
          >
            Download
          </a>
          <Button variant="primary" size="sm" href="/editor">
            Start Free
          </Button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "2px solid var(--ink)",
              backgroundColor: "var(--white)",
            }}
            aria-label="Toggle navigation menu"
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? (
              <X width={20} height={20} aria-hidden="true" />
            ) : (
              <Menu width={20} height={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="clay-card"
          style={{
            marginTop: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <a
            href="#tools"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}
          >
            Tools
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}
          >
            Features
          </a>
          <a
            href="#creators"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}
          >
            Creators
          </a>
          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}
          >
            Download
          </a>
        </div>
      )}
    </header>
  );
}
