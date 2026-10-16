import { Star } from "lucide-react";
import ClayCard from "@/components/ui/ClayCard";
import IconTile from "@/components/ui/IconTile";
import Pill from "@/components/ui/Pill";

{/* TODO: Replace placeholder testimonials with real creator feedback before production launch */}
const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Digital Illustrator",
    initial: "A",
    color: "mint" as const,
    quote:
      "Magick Studio has completely replaced heavy desktop editors for my daily image prep. The non-destructive pipeline is super intuitive and fast.",
  },
  {
    name: "Elena Rostova",
    role: "Photographer & Retoucher",
    initial: "E",
    color: "salmon" as const,
    quote:
      "Having 100% private, local processing in the browser is a game changer for confidential client photos. Zero uploads, zero risk.",
  },
  {
    name: "Marcus Vance",
    role: "Game Texture Artist",
    initial: "M",
    color: "lavender" as const,
    quote:
      "The instant preview response and offline Linux desktop packaging make this an essential tool in my creative asset pipeline.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="creators"
      style={{
        backgroundColor: "var(--gray)",
        padding: "90px 24px 100px",
        scrollMarginTop: "80px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Pill color="mint">Community Love</Pill>
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
            Loved by Digital Creators
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
            See how artists, photographers, and developers use Magick Studio every day.
          </p>
        </div>

        {/* 3 Clay Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
          }}
          className="testimonials-grid"
        >
          {TESTIMONIALS.map((t) => (
            <ClayCard
              key={t.name}
              style={{
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                {/* 5 Gold Stars */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      width={18}
                      height={18}
                      fill="var(--gold)"
                      color="var(--ink)"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    color: "var(--ink)",
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    fontWeight: 600,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  paddingTop: "16px",
                  borderTop: "1.5px solid rgba(46, 54, 69, 0.1)",
                }}
              >
                <IconTile color={t.color} size="md">
                  <span className="font-display" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {t.initial}
                  </span>
                </IconTile>
                <div>
                  <div
                    className="font-display"
                    style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)" }}
                  >
                    {t.name}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.85rem", fontWeight: 600 }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </ClayCard>
          ))}
        </div>
      </div>
    </section>
  );
}
