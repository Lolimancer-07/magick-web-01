import { Check, ArrowRight, Download } from "lucide-react";
import ClayCard from "@/components/ui/ClayCard";
import Button from "@/components/ui/Button";

const GITHUB_RELEASES_URL = "https://github.com/Lolimancer-07/magick-web-01/releases";

export default function CtaBand() {
  return (
    <section
      id="download"
      style={{
        backgroundColor: "var(--blue)",
        padding: "90px 24px 100px",
        scrollMarginTop: "80px",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <ClayCard
          style={{
            padding: "54px 36px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            borderRadius: "28px",
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.2,
            }}
          >
            Ready to start editing?
          </h2>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.2rem",
              maxWidth: "600px",
              lineHeight: 1.6,
              fontWeight: 600,
            }}
          >
            No account or sign-up required. Jump straight into the browser editor, or download the native Linux desktop app for offline workflows.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            <Button variant="primary" size="lg" href="/editor">
              <span>Launch Editor</span>
              <ArrowRight width={18} height={18} aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href={GITHUB_RELEASES_URL}
              style={{
                backgroundColor: "var(--beige)",
              }}
            >
              <Download width={18} height={18} aria-hidden="true" />
              <span>Download for Linux</span>
            </Button>
          </div>

          {/* Checkmarks */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
              flexWrap: "wrap",
              marginTop: "12px",
              color: "var(--ink)",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "var(--green)",
                  border: "1.5px solid var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check width={12} height={12} color="var(--ink)" strokeWidth={3} aria-hidden="true" />
              </div>
              <span>No sign-up required</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "var(--green)",
                  border: "1.5px solid var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check width={12} height={12} color="var(--ink)" strokeWidth={3} aria-hidden="true" />
              </div>
              <span>Works offline in the app</span>
            </div>
          </div>
        </ClayCard>
      </div>
    </section>
  );
}
