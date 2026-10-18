"use client";

import Link from "next/link";
import { Wand2, Code2, Heart } from "lucide-react";

const LINKS = {
  Product: ["Editor", "Features", "Changelog"],
  Resources: ["Docs", "GitHub", "ImageMagick"],
  Legal: ["Privacy", "Terms", "License"],
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--line)",
        padding: "48px 16px 28px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top grid */}
        <div
          className="footer-top-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9px",
                  background: "rgba(63,237,30,.15)",
                  border: "1px solid rgba(63,237,30,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--green)",
                }}
              >
                <Wand2 size={16} aria-hidden="true" />
              </div>
              <span className="font-display" style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ink)" }}>
                Magick<span style={{ color: "var(--green)" }}>Studio</span>
              </span>
            </Link>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "280px", marginBottom: "20px" }}>
              Full ImageMagick power, 100% private, right in your browser. No uploads, ever.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { icon: Code2, href: "https://github.com", label: "GitHub" },
                
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted)",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(63,237,30,.1)";
                    el.style.borderColor = "rgba(63,237,30,.25)";
                    el.style.color = "var(--green)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "var(--surface-2)";
                    el.style.borderColor = "var(--line)";
                    el.style.color = "var(--muted)";
                  }}
                >
                  <s.icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="footer-links-grid" style={{ display: "grid", gap: "24px" }}>
            {Object.entries(LINKS).map(([section, items]) => (
              <div key={section}>
                <div
                  className="font-display"
                  style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}
                >
                  {section}
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        style={{ fontSize: "0.88rem", color: "var(--muted)", fontWeight: 500, transition: "color .15s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "0.82rem", color: "var(--dim)" }}>
            © {new Date().getFullYear()} Magick Studio. Open source & free.
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--dim)", display: "flex", alignItems: "center", gap: "5px" }}>
            Made with <Heart size={13} fill="var(--red)" stroke="none" aria-hidden="true" /> for Linux & the open web.
          </p>
        </div>
      </div>
      <style jsx>{`
        .footer-links-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 600px) {
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
