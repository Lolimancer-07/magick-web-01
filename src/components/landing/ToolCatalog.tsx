import Link from "next/link";
import { Sparkles, Crop, Palette, Wand2, Eye, Zap, Layers, ArrowRight } from "lucide-react";
import ClayCard from "@/components/ui/ClayCard";
import Pill from "@/components/ui/Pill";
import IconTile from "@/components/ui/IconTile";
import Button from "@/components/ui/Button";

interface ToolCardData {
  title: string;
  category: string;
  author: string;
  tag: string;
  tileColor: "mint" | "salmon" | "lavender" | "gold";
  icon: typeof Sparkles;
  meta: [string, string, string];
  opId: string;
}

const CATALOG_ITEMS: ToolCardData[] = [
  {
    title: "Blur & Sharpen",
    category: "Filtering",
    author: "by Magick Studio",
    tag: "Popular",
    tileColor: "mint",
    icon: Sparkles,
    meta: ["4 operations", "Live Preview", "Real-Time WASM"],
    opId: "blur",
  },
  {
    title: "Resize & Crop",
    category: "Geometry",
    author: "by Magick Studio",
    tag: "Essential",
    tileColor: "salmon",
    icon: Crop,
    meta: ["Scale & Rotate", "Aspect Lock", "Lossless Buffer"],
    opId: "resize",
  },
  {
    title: "Color & Tone",
    category: "Grading",
    author: "by Magick Studio",
    tag: "Pro Grade",
    tileColor: "lavender",
    icon: Palette,
    meta: ["Brightness/Hue", "Gamma Curves", "Sigmoidal Contrast"],
    opId: "modulate",
  },
  {
    title: "Effects & Filters",
    category: "Creative",
    author: "by Magick Studio",
    tag: "Creative",
    tileColor: "gold",
    icon: Wand2,
    meta: ["Sepia & Oil Paint", "Charcoal Sketch", "Noise Diffusion"],
    opId: "sepia",
  },
];

export default function ToolCatalog() {
  return (
    <section
      id="tools"
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
            <Pill color="blue">Popular Tools</Pill>
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
            Tool Catalog
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.15rem",
              maxWidth: "600px",
              margin: "0 auto",
              fontWeight: 600,
            }}
          >
            Explore modular ImageMagick operation groups designed for high-precision, non-destructive editing.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
            marginBottom: "48px",
          }}
          className="catalog-grid"
        >
          {CATALOG_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.title} href={`/editor?op=${item.opId}`}>
                <ClayCard
                  interactive
                  style={{
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div>
                    {/* Top row: Icon tile + title info + tag pill */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <IconTile color={item.tileColor} size="lg">
                          <IconComponent width={26} height={26} aria-hidden="true" />
                        </IconTile>
                        <div>
                          <h3
                            className="font-display"
                            style={{
                              fontSize: "1.35rem",
                              fontWeight: 700,
                              color: "var(--ink)",
                              marginBottom: "2px",
                            }}
                          >
                            {item.title}
                          </h3>
                          <div style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 600 }}>
                            {item.author}
                          </div>
                        </div>
                      </div>

                      <Pill color="mint">{item.tag}</Pill>
                    </div>
                  </div>

                  {/* Meta row with 3 items */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      paddingTop: "18px",
                      borderTop: "1.5px solid rgba(46, 54, 69, 0.1)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--muted)",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Layers width={16} height={16} color="var(--ink)" aria-hidden="true" />
                      <span>{item.meta[0]}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Eye width={16} height={16} color="var(--ink)" aria-hidden="true" />
                      <span>{item.meta[1]}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Zap width={16} height={16} color="var(--ink)" aria-hidden="true" />
                      <span>{item.meta[2]}</span>
                    </div>
                  </div>
                </ClayCard>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: "center" }}>
          <Button variant="secondary" size="lg" href="/editor">
            <span>View All Operations</span>
            <ArrowRight width={18} height={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
