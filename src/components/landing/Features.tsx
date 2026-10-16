import { ShieldCheck, History, Zap, Monitor } from "lucide-react";
import Pill from "@/components/ui/Pill";
import IconTile from "@/components/ui/IconTile";

const FEATURES = [
  {
    title: "Private by Design",
    desc: "Your images never leave your machine. Processing runs 100% inside your sandboxed browser.",
    icon: ShieldCheck,
    color: "mint" as const,
  },
  {
    title: "Non-Destructive Edits",
    desc: "Replay and toggle pipeline steps freely with unlimited undo, redo, and live step tuning.",
    icon: History,
    color: "salmon" as const,
  },
  {
    title: "Live Real-Time Previews",
    desc: "Hardware-accelerated preview rendering in a background Web Worker keeps the interface silky smooth.",
    icon: Zap,
    color: "lavender" as const,
  },
  {
    title: "Native Linux Desktop",
    desc: "Packaged as a lightweight offline Tauri desktop app for Linux with AppImage and Debian support.",
    icon: Monitor,
    color: "blue" as const,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      style={{
        backgroundColor: "var(--beige)",
        padding: "90px 24px 100px",
        scrollMarginTop: "80px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Pill color="salmon">Why Choose Us</Pill>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "14px",
            }}
          >
            A Better Way to Edit
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.15rem",
              maxWidth: "580px",
              margin: "0 auto",
              fontWeight: 600,
            }}
          >
            Engineered from the ground up for privacy, performance, and playful creativity.
          </p>
        </div>

        {/* 4 Cards in a row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
          }}
          className="features-grid"
        >
          {FEATURES.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div key={feat.title} className="flat-card">
                <div style={{ marginBottom: "16px" }}>
                  <IconTile color={feat.color} size="md">
                    <IconComponent width={22} height={22} aria-hidden="true" />
                  </IconTile>
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: "8px",
                  }}
                >
                  {feat.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.5, fontWeight: 600 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
