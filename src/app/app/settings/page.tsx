"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/mobile/TopBar";
import SettingsCard from "@/components/mobile/SettingsCard";
import Segmented from "@/components/mobile/Segmented";
import { useMobileImageStore, triggerHaptic } from "@/store/mobileImageStore";
import { Palette, Vibrate, Zap, Cpu, Info, ShieldCheck, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const {
    theme,
    setTheme,
    hapticsEnabled,
    setHapticsEnabled,
    estimationMode,
    setEstimationMode,
  } = useMobileImageStore();

  useEffect(() => {
    if (theme === "mauve") {
      document.documentElement.setAttribute("data-theme", "mauve");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  const handleThemeChange = (newTheme: "default" | "mauve") => {
    triggerHaptic(15);
    setTheme(newTheme);
  };

  const handleCopyDiagnostics = async () => {
    triggerHaptic(20);
    const hasWasm = typeof WebAssembly !== "undefined";
    const hasSimd =
      typeof WebAssembly !== "undefined" &&
      typeof WebAssembly.validate === "function" &&
      WebAssembly.validate(
        new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 26, 11])
      );

    const diagnostics = {
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
      deviceMemory:
        typeof navigator !== "undefined" && "deviceMemory" in navigator
          ? `${(navigator as any).deviceMemory} GB`
          : "N/A",
      hardwareConcurrency:
        typeof navigator !== "undefined" ? navigator.hardwareConcurrency : "N/A",
      viewport:
        typeof window !== "undefined"
          ? `${window.innerWidth}x${window.innerHeight} (dpr: ${window.devicePixelRatio})`
          : "N/A",
      crossOriginIsolated:
        typeof window !== "undefined" ? window.crossOriginIsolated : false,
      webAssembly: hasWasm,
      wasmSimd: hasSimd,
      timestamp: new Date().toISOString(),
    };

    const text = JSON.stringify(diagnostics, null, 2);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy diagnostics:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "40px",
      }}
    >
      <TopBar title="Settings" onBack={() => router.back()} />

      <main style={{ paddingTop: "12px" }}>
        {/* Theme Settings (Spec 3.1) */}
        <SettingsCard title="Theme & Color Palette">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted, #8a93b8)", fontSize: "13px" }}>
              <Palette size={16} />
              <span>Choose your preferred aesthetic</span>
            </div>
            <Segmented
              options={[
                { value: "default", label: "Dark Navy (Default)" },
                { value: "mauve", label: "Mauve Material" },
              ]}
              value={theme}
              onChange={handleThemeChange}
            />
            <p style={{ fontSize: "12px", color: "var(--muted, #8a93b8)", margin: 0, lineHeight: 1.4 }}>
              Dark Navy uses Magick Studio neon green & dark navy tokens. Mauve Material matches the reference app warm dark palette with lilac accents.
            </p>
          </div>
        </SettingsCard>

        {/* Haptics (Spec 6.4) */}
        <SettingsCard title="Haptic Feedback">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Vibrate size={18} style={{ color: "var(--green, #30d158)" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>Vibration on Touch</div>
                <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                  Short 10ms haptic tap on toggles and chips
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hapticsEnabled}
              onChange={(e) => {
                setHapticsEnabled(e.target.checked);
                if (e.target.checked) triggerHaptic(20);
              }}
              style={{
                width: "22px",
                height: "22px",
                accentColor: "var(--green, #30d158)",
                cursor: "pointer",
              }}
            />
          </div>
        </SettingsCard>

        {/* Estimation Mode (Spec 5.5) */}
        <SettingsCard title="Size Estimation Mode">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted, #8a93b8)", fontSize: "13px" }}>
              <Zap size={16} />
              <span>Preview Size Encoding</span>
            </div>
            <Segmented
              options={[
                { value: "accurate", label: "Accurate (Full)" },
                { value: "fast", label: "Fast (Proxy ~)" },
              ]}
              value={estimationMode}
              onChange={(v) => {
                triggerHaptic(10);
                setEstimationMode(v);
              }}
            />
            <p style={{ fontSize: "12px", color: "var(--muted, #8a93b8)", margin: 0, lineHeight: 1.4 }}>
              Accurate runs a full background encode. Fast encodes a downscaled proxy and extrapolates file size.
            </p>
          </div>
        </SettingsCard>

        {/* Performance & Privacy Info (Spec 6.5) */}
        <SettingsCard title="Engine & Privacy Architecture">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--muted, #8a93b8)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <Cpu size={18} style={{ color: "var(--blue, #0a84ff)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--ink, #f2f4fb)" }}>ImageMagick WebAssembly 0.0.44</strong>
                <p style={{ margin: "2px 0 0" }}>Runs entirely on client Web Workers with hardware isolation.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <ShieldCheck size={18} style={{ color: "var(--green, #30d158)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--ink, #f2f4fb)" }}>100% Private & Local</strong>
                <p style={{ margin: "2px 0 0" }}>Zero photos are uploaded to any server. All processing is strictly in-browser.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <Info size={18} style={{ color: "var(--muted, #8a93b8)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--ink, #f2f4fb)" }}>Performance Budgets</strong>
                <p style={{ margin: "2px 0 0" }}>Preview proxy clamp 1600px, 60fps slider interactions, debounced 400ms renders.</p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* About & Diagnostics (Spec 6.1) */}
        <SettingsCard title="About & Diagnostics">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <p style={{ margin: 0, color: "var(--muted, #8a93b8)", lineHeight: 1.4 }}>
              Inspect your runtime environment to diagnose mobile hardware, memory limits, and WebAssembly capabilities.
            </p>
            <button
              type="button"
              id="copy-diagnostics-btn"
              onClick={handleCopyDiagnostics}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: copied ? "rgba(63, 237, 30, 0.15)" : "var(--surface-2, #212946)",
                border: `1px solid ${copied ? "var(--green, #30d158)" : "var(--line, rgba(255,255,255,0.08))"}`,
                color: copied ? "var(--green, #30d158)" : "var(--ink, #f2f4fb)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Diagnostics Copied to Clipboard!" : "Copy Diagnostics"}</span>
            </button>
          </div>
        </SettingsCard>
      </main>
    </div>
  );
}
