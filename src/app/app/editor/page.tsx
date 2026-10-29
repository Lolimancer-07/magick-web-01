"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AppEditorRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const target = qs ? `/app/?${qs}` : "/app/";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink, #f2f4fb)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 24px",
          backgroundColor: "var(--surface, #1a2035)",
          border: "1px solid var(--line, rgba(255,255,255,0.08))",
          borderRadius: "16px",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "var(--green, #30d158)",
          }}
        />
        <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
          Redirecting to Magick Studio…
        </span>
      </div>
    </div>
  );
}

export default function AppEditorPage() {
  return (
    <Suspense fallback={null}>
      <AppEditorRedirectContent />
    </Suspense>
  );
}
