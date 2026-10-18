"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/mobile/TopBar";
import SettingsCard from "@/components/mobile/SettingsCard";
import Segmented from "@/components/mobile/Segmented";
import { useMobileImageStore, triggerHaptic } from "@/store/mobileImageStore";
import { Palette, Vibrate, Zap, Cpu, Info, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
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
              <Vibrate size={18} style={{ color: "var(--green, #3fed1e)" }} />
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
                accentColor: "var(--green, #3fed1e)",
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
              <Cpu size={18} style={{ color: "var(--blue, #3089c5)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--ink, #f2f4fb)" }}>ImageMagick WebAssembly 0.0.44</strong>
                <p style={{ margin: "2px 0 0" }}>Runs entirely on client Web Workers with hardware isolation.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <ShieldCheck size={18} style={{ color: "var(--green, #3fed1e)", flexShrink: 0, marginTop: "2px" }} />
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
      </main>
    </div>
  );
}
