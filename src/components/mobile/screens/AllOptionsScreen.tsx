"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import { Search, Terminal, ArrowUpRight, ShieldCheck, Cpu } from "lucide-react";
import coverageData from "@/ops/coverage.json";

interface OptionEntry {
  flag: string;
  section: string;
  status: string;
  tool: string;
  engine: string;
  reason?: string;
}

export default function AllOptionsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const allEntries: OptionEntry[] = useMemo(() => {
    return Object.entries(coverageData).map(([flag, data]: [string, any]) => ({
      flag,
      section: data.section || "operator",
      status: data.status || "ui",
      tool: data.tool || "generic",
      engine: data.engine || "wasm",
      reason: data.reason,
    }));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allEntries;
    const q = query.toLowerCase().trim();
    return allEntries.filter(
      (e) =>
        e.flag.toLowerCase().includes(q) ||
        e.tool.toLowerCase().includes(q) ||
        e.section.toLowerCase().includes(q) ||
        (e.reason && e.reason.toLowerCase().includes(q))
    );
  }, [allEntries, query]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "32px",
      }}
    >
      <TopBar title="All ImageMagick Options" onBack={() => router.back()} />

      {/* Search Header */}
      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "48px",
            backgroundColor: "var(--m-surface-1, #1c233c)",
            borderRadius: "var(--m-radius-chip, 999px)",
            padding: "0 16px",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
          }}
        >
          <Search size={18} style={{ color: "var(--muted, #8a93b8)" }} />
          <input
            type="text"
            placeholder="Search all 240+ flags (e.g. -modulate, -blur)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--ink, #f2f4fb)",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
            }}
          />
        </div>
      </div>

      <main style={{ padding: "0 16px" }}>
        <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)", marginBottom: "10px" }}>
          Showing {filtered.length} of {allEntries.length} options mapped to WebAssembly & Native engines
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.slice(0, 100).map((opt) => (
            <div
              key={opt.flag}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "14px",
                backgroundColor: "var(--m-surface-1, #1c233c)",
                border: "1px solid var(--line, rgba(255,255,255,0.06))",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <code style={{ fontSize: "14px", fontWeight: 700, color: "var(--green, #3fed1e)" }}>
                    {opt.flag}
                  </code>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: "6px",
                      backgroundColor:
                        opt.engine === "native" ? "rgba(48, 137, 197, 0.2)" : "rgba(63, 237, 30, 0.15)",
                      color: opt.engine === "native" ? "var(--blue, #3089c5)" : "var(--green, #3fed1e)",
                      textTransform: "uppercase",
                    }}
                  >
                    {opt.engine}
                  </span>
                </div>
                {opt.reason ? (
                  <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>{opt.reason}</div>
                ) : (
                  <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>Mapped to tool: {opt.tool}</div>
                )}
              </div>

              <span style={{ fontSize: "11px", color: "var(--muted, #8a93b8)", textTransform: "capitalize" }}>
                {opt.section}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
