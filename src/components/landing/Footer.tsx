import Link from "next/link";
import { Wand2 } from "lucide-react";
import IconTile from "@/components/ui/IconTile";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--beige)",
        borderTop: "2px solid var(--ink)",
        padding: "80px 24px 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
            marginBottom: "56px",
          }}
          className="footer-top-grid"
        >
          {/* Brand & Socials Column */}
          <div style={{ maxWidth: "380px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <IconTile color="salmon" size="sm">
                <Wand2 width={18} height={18} aria-hidden="true" />
              </IconTile>
              <span
                className="font-display"
                style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--ink)" }}
              >
                Magick<span style={{ color: "var(--green-d)" }}>Studio</span>
              </span>
            </div>

            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px", fontWeight: 600 }}>
              A friendly, private, non-destructive image editor powered by ImageMagick WebAssembly.
              Zero cloud uploads.
            </p>

            {/* Social Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <a
                href="https://github.com/Lolimancer-07/magick-web-01"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <IconTile color="mint" size="sm">
                  <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>GH</span>
                </IconTile>
              </a>
              <a href="#" aria-label="X Profile">
                <IconTile color="blue" size="sm">
                  <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>X</span>
                </IconTile>
              </a>
              <a href="#" aria-label="YouTube Channel">
                <IconTile color="salmon" size="sm">
                  <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>YT</span>
                </IconTile>
              </a>
            </div>
          </div>

          {/* 3 Link Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {/* Column 1: Product */}
            <div>
              <h4
                className="font-display"
                style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: "16px" }}
              >
                Product
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem", fontWeight: 600, color: "var(--muted)" }}>
                <li><Link href="/editor" style={{ color: "var(--muted)" }}>Editor Studio</Link></li>
                <li><a href="#tools" style={{ color: "var(--muted)" }}>Tool Catalog</a></li>
                <li><a href="#download" style={{ color: "var(--muted)" }}>Download Linux App</a></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h4
                className="font-display"
                style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: "16px" }}
              >
                Company
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem", fontWeight: 600, color: "var(--muted)" }}>
                <li><a href="#" style={{ color: "var(--muted)" }}>About</a></li>
                <li><a href="#" style={{ color: "var(--muted)" }}>Blog</a></li>
                <li><a href="#creators" style={{ color: "var(--muted)" }}>Creators</a></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4
                className="font-display"
                style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: "16px" }}
              >
                Support
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem", fontWeight: 600, color: "var(--muted)" }}>
                <li><a href="#" style={{ color: "var(--muted)" }}>Help Center</a></li>
                <li><a href="https://github.com/Lolimancer-07/magick-web-01" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>GitHub Issues</a></li>
                <li><a href="#" style={{ color: "var(--muted)" }}>Privacy Pledge</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1.5px", backgroundColor: "rgba(46, 54, 69, 0.15)", marginBottom: "28px" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "0.9rem",
            color: "var(--muted)",
            fontWeight: 600,
          }}
        >
          <div>© {new Date().getFullYear()} Magick Studio. Powered by ImageMagick WASM.</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#" style={{ color: "var(--muted)" }}>Privacy Policy</a>
            <a href="#" style={{ color: "var(--muted)" }}>Terms of Service</a>
            <a href="#" style={{ color: "var(--muted)" }}>Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
