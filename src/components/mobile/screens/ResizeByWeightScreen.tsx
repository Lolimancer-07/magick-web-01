"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import NumberField from "../NumberField";
import ChipGroup from "../ChipGroup";
import ActionBar from "../ActionBar";
import { useMobileImageStore, triggerHaptic } from "@/store/mobileImageStore";
import { runResizeByWeight, ResizeByWeightResult } from "@/utils/resizeByWeight";
import { engine } from "@/engine/engineClient";
import { downloadBlob, createZip } from "@/utils/zipWriter";
import { Scale, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ResizeByWeightScreen() {
  const router = useRouter();
  const { currentImage, batchImages } = useMobileImageStore();

  const [targetVal, setTargetVal] = useState(200); // 200 KB default
  const [unit, setUnit] = useState<"KB" | "MB">("KB");
  const [mode, setMode] = useState<"never-exceed" | "closest">("never-exceed");
  const [format, setFormat] = useState<"webp" | "jpeg" | "png" | "avif">("webp");
  const [floorQuality, setFloorQuality] = useState(20);

  const [isRunning, setIsRunning] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ResizeByWeightResult | null>(null);

  const isBatch = batchImages.length > 1;

  const handleStart = async () => {
    if (!currentImage) return;
    triggerHaptic(15);
    setIsRunning(true);
    setResult(null);

    const targetBytes = targetVal * (unit === "MB" ? 1024 * 1024 : 1024);

    try {
      if (isBatch) {
        // Run batch
        const zipOutputs: { name: string; data: Uint8Array }[] = [];
        for (let i = 0; i < batchImages.length; i++) {
          const item = batchImages[i];
          setProgressMsg(`Processing ${i + 1}/${batchImages.length}: ${item.name}...`);
          await engine.load(item.file);

          const r = await runResizeByWeight(
            async (q, s) => {
              const res = await engine.render([], {
                preview: false,
                format,
                quality: q,
              });
              return new Uint8Array(res.bytes);
            },
            {
              targetBytes,
              mode,
              format,
              floorQuality,
            }
          );
          if (r.resultBytes) {
            const base = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
            zipOutputs.push({ name: `${base}.${format}`, data: r.resultBytes });
          }
        }
        const zip = createZip(zipOutputs);
        downloadBlob(zip, `magick-weight-batch-${Date.now()}.zip`);
        setProgressMsg("Batch processing complete! Zip downloaded.");
      } else {
        // Single image
        await engine.load(currentImage.file);
        const res = await runResizeByWeight(
          async (q, s) => {
            const r = await engine.render([], {
              preview: false,
              format,
              quality: q,
            });
            return new Uint8Array(r.bytes);
          },
          {
            targetBytes,
            mode,
            format,
            floorQuality,
            onProgress: (iter, size, q, s) => {
              setProgressMsg(`Iteration ${iter}: ${(size / 1024).toFixed(1)} KB (Q: ${q}, Scale: ${s})`);
            },
          }
        );
        setResult(res);
        if (res.resultBytes) {
          const blob = new Blob([res.resultBytes], { type: `image/${format}` });
          downloadBlob(blob, `compressed-${currentImage.name}.${format}`);
        }
      }
    } catch (err: any) {
      console.error("Resize by weight error:", err);
      setProgressMsg(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "calc(var(--m-action-bar-h, 72px) + var(--safe-bottom, 0px) + 24px)",
      }}
    >
      <TopBar title="Resize by Weight" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Target Size Card */}
        <SettingsCard title="Target File Size">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <NumberField label="Target Weight" value={targetVal} min={1} max={99999} onChange={setTargetVal} />
              <div style={{ width: "120px" }}>
                <Segmented
                  options={[
                    { value: "KB", label: "KB" },
                    { value: "MB", label: "MB" },
                  ]}
                  value={unit}
                  onChange={(u) => setUnit(u as any)}
                />
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
              Binary-search compression algorithm adjusts quality and scale factors automatically.
            </div>
          </div>
        </SettingsCard>

        {/* Mode Card */}
        <SettingsCard title="Target Mode">
          <Segmented
            options={[
              { value: "never-exceed", label: "Do Not Exceed (Strict)" },
              { value: "closest", label: "Closest Match" },
            ]}
            value={mode}
            onChange={(m) => setMode(m as any)}
          />
        </SettingsCard>

        {/* Output Format Card */}
        <SettingsCard title="Output Format">
          <ChipGroup
            items={[
              { id: "webp", label: "WEBP (Recommended)" },
              { id: "jpeg", label: "JPEG" },
              { id: "avif", label: "AVIF" },
              { id: "png", label: "PNG" },
            ]}
            selected={format}
            onSelect={(f) => setFormat(f as any)}
            layout="scroll"
          />
        </SettingsCard>

        {/* Floor Quality */}
        <SettingsCard title="Minimum Quality Floor">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
              <span>Quality Threshold</span>
              <span style={{ color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>{floorQuality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={floorQuality}
              onChange={(e) => setFloorQuality(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: "var(--green, #3fed1e)" }}
            />
            <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>
              If target cannot be achieved at this quality floor, dimensional downscaling kicks in.
            </div>
          </div>
        </SettingsCard>

        {/* Progress & Result Box */}
        {(isRunning || result || progressMsg) && (
          <div
            style={{
              margin: "0 16px",
              padding: "16px",
              borderRadius: "var(--m-radius-card, 24px)",
              backgroundColor: "var(--m-surface-1, #1c233c)",
              border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {isRunning && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--green, #3fed1e)" }}>
                <Loader2 size={18} className="animate-spin" />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{progressMsg || "Searching optimal compression..."}</span>
              </div>
            )}

            {result && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  {result.status === "success" ? (
                    <CheckCircle2 size={18} style={{ color: "var(--green, #3fed1e)" }} />
                  ) : (
                    <AlertTriangle size={18} style={{ color: "var(--amber, #f5a623)" }} />
                  )}
                  <span style={{ fontSize: "14px", fontWeight: 700 }}>{result.message}</span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--muted, #8a93b8)", lineHeight: 1.5 }}>
                  <div>Achieved: {(result.achievedBytes / 1024).toFixed(1)} KB ({result.iterations} iterations)</div>
                  <div>Chosen Quality: {result.quality}% · Scale: {(result.scale * 100).toFixed(0)}%</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <ActionBar onSave={handleStart} isSaving={isRunning} saveLabel={isBatch ? `Compress All (${batchImages.length})` : "Compress & Save"} />
    </div>
  );
}
