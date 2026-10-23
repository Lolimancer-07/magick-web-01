"use client";

import { Suspense } from "react";
import AppShell from "@/components/app/AppShell";

export default function UnifiedAppPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100dvh",
            backgroundColor: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "var(--green)",
                boxShadow: "0 0 12px var(--green)",
                animation: "magick-pulse 1.4s ease-in-out infinite",
              }}
            />
            <span
              className="font-display"
              style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.95rem" }}
            >
              Loading Magick Studio…
            </span>
          </div>
        </div>
      }
    >
      <AppShell />
    </Suspense>
  );
}
