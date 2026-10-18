"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { Columns, Eye, FolderOpen } from "lucide-react";

export default function CompareImagesScreen() {
  const router = useRouter();
  const { currentImage, batchImages } = useMobileImageStore();
  const [splitPos, setSplitPos] = useState(50);
  const [viewMode, setViewMode] = useState<"split" | "side-by-side">("split");
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const img1 = currentImage;
  const img2 = batchImages.length > 1 ? batchImages[1] : null;

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSplitPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "32px",
      }}
    >
      <TopBar title="Compare Images (-compare)" onBack={() => router.back()} />

      <main style={{ padding: "12px 0" }}>
        <SettingsCard title="Comparison Mode">
          <Segmented
            options={[
              { value: "split", label: "Split Slider" },
              { value: "side-by-side", label: "Side by Side" },
            ]}
            value={viewMode}
            onChange={(m) => setViewMode(m as any)}
          />
        </SettingsCard>

        {/* Comparison Viewer */}
        <div style={{ padding: "0 16px" }}>
          {viewMode === "split" ? (
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(260px, 45vh, 420px)",
                borderRadius: "var(--m-radius-card, 24px)",
                backgroundColor: "#0b0e18",
                overflow: "hidden",
                touchAction: "none",
                userSelect: "none",
                border: "1px solid var(--line, rgba(255,255,255,0.08))",
              }}
            >
              {img1 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img1.url}
                  alt="Image 1"
                  style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
                />
              )}

              {img2 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${splitPos}%`,
                    overflow: "hidden",
                    borderRight: "2px solid var(--green, #3fed1e)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img2.url}
                    alt="Image 2"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    Image B
                  </span>
                </div>
              )}

              {/* Slider Handle */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${splitPos}%`,
                  transform: "translate(-50%, -50%)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--green, #3fed1e)",
                  color: "var(--green-ink, #07110a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                  cursor: "ew-resize",
                  zIndex: 10,
                }}
              >
                <Columns size={16} />
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div
                style={{
                  borderRadius: "16px",
                  backgroundColor: "var(--m-surface-1, #1c233c)",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px", color: "var(--muted, #8a93b8)" }}>
                  Image A (Primary)
                </div>
                {img1 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img1.url} alt="Image A" style={{ width: "100%", height: "160px", objectFit: "contain" }} />
                )}
              </div>

              <div
                style={{
                  borderRadius: "16px",
                  backgroundColor: "var(--m-surface-1, #1c233c)",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px", color: "var(--muted, #8a93b8)" }}>
                  Image B (Secondary)
                </div>
                {img2 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img2.url} alt="Image B" style={{ width: "100%", height: "160px", objectFit: "contain" }} />
                ) : (
                  <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted, #8a93b8)", fontSize: "12px" }}>
                    Select 2 images from hub
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
