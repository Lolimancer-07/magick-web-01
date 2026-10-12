import Link from "next/link";
import LandingOperations from "@/components/LandingOperations";

const FEATURES = [
  { icon: "⚡", title: "Real-Time Preview", desc: "See changes instantly as you adjust sliders and parameters." },
  { icon: "🔒", title: "100% Private", desc: "All processing happens in your browser. Images never leave your device." },
  { icon: "🎨", title: "17+ Operations", desc: "Blur, sharpen, resize, rotate, color adjustments, effects, and more." },
  { icon: "↩", title: "Undo / Redo", desc: "Full history with unlimited undo and redo." },
  { icon: "⇄", title: "Before / After", desc: "Interactive slider to compare original vs. edited." },
  { icon: "📦", title: "Export Anywhere", desc: "Download as PNG, JPEG, or WebP with quality control." },
];

export default function HomePage() {
  return (
    <div className="landing-root">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Magick<span className="logo-accent">Web</span></span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#ops" className="nav-link">Operations</a>
          <Link href="/editor" className="nav-cta">Open Editor →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✦ Powered by ImageMagick WebAssembly</div>
        <h1 className="hero-title">
          Professional Image Editing<br />
          <span className="gradient-text">in Your Browser</span>
        </h1>
        <p className="hero-subtitle">
          Apply ImageMagick operations in real time. No upload, no server, no cost.
          Your images stay private on your device.
        </p>
        <div className="hero-ctas">
          <Link href="/editor" className="btn-hero-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Launch Editor — It&apos;s Free
          </Link>
          <Link href="/editor?demo=true" className="btn-hero-secondary">
            ✨ Try with Demo Image
          </Link>
        </div>
        <p className="hero-privacy">🔒 Images processed locally • No sign-up required • Open source</p>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-subtitle">A complete image editing pipeline, powered entirely by WebAssembly.</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clickable Operations list */}
      <LandingOperations />

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to edit?</h2>
        <p className="cta-sub">No account needed. Just open the editor and drop your image.</p>
        <Link href="/editor" className="btn-hero-primary">Open Editor →</Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="logo-icon">✦</span> MagickWeb
        </div>
        <p className="footer-copy">Built on ImageMagick WebAssembly • Images never leave your device</p>
      </footer>
    </div>
  );
}
