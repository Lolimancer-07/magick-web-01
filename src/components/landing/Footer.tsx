"use client";

import Link from "next/link";
import { Wand2, Code2, Heart } from "lucide-react";

const LINKS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Open Editor", href: "/app/" },
    { label: "Features", href: "/#features" },
  ],
  Resources: [
    { label: "GitHub", href: "https://github.com/rishi-raj-jain/magick-web" },
    { label: "ImageMagick", href: "https://imagemagick.org" },
    { label: "Coverage Map", href: "/docs/COVERAGE" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="px-4 pb-7 pt-12 md:px-6"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Top grid */}
        <div
          className="footer-top-grid mb-12 grid gap-12"
          style={{ gridTemplateColumns: "1fr" }}
        >
          {/* Brand column */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg, #0a84ff, #bf5af2)",
                  boxShadow: "0 2px 10px rgba(10,132,255,0.3)",
                }}
              >
                <Wand2 size={15} aria-hidden="true" />
              </div>
              <span className="font-display text-[1.05rem] font-bold" style={{ color: "var(--ink)" }}>
                Magick
                <span
                  style={{
                    background: "linear-gradient(90deg, #64d2ff, #0a84ff 55%, #bf5af2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Studio
                </span>
              </span>
            </Link>
            <p
              className="mb-5 max-w-[280px] text-[0.85rem] leading-[1.7]"
              style={{ color: "var(--muted)" }}
            >
              Full ImageMagick power, 100% private, right in your browser. No uploads, ever.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: Code2, href: "https://github.com", label: "GitHub" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--muted)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "var(--tile-blue)";
                    el.style.borderColor = "rgba(10,132,255,.28)";
                    el.style.color = "var(--blue)";
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
          <div className="footer-links-grid grid gap-6">
            {Object.entries(LINKS).map(([section, items]) => (
              <div key={section}>
                <div
                  className="font-display mb-3.5 text-[0.75rem] font-bold uppercase"
                  style={{ color: "var(--dim)", letterSpacing: "0.07em" }}
                >
                  {section}
                </div>
                <ul className="flex list-none flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[0.88rem] font-medium transition-colors duration-150"
                        style={{ color: "var(--muted)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
                      >
                        {item.label}
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
          className="flex flex-wrap items-center justify-between gap-3 border-t pt-6"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="text-[0.82rem]" style={{ color: "var(--dim)" }}>
            © {new Date().getFullYear()} Magick Studio. Open source &amp; free.
          </p>
          <p className="flex items-center gap-1.5 text-[0.82rem]" style={{ color: "var(--dim)" }}>
            Made with <Heart size={13} fill="var(--pink)" stroke="none" aria-hidden="true" /> for Linux &amp; the open web.
          </p>
        </div>
      </div>
      <style jsx>{`
        .footer-links-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) {
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
