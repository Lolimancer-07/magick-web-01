"use client";

import React, { useState, useEffect } from "react";
import BottomSheet from "./BottomSheet";
import Segmented from "./Segmented";
import { PLATFORM_PRESETS, SIZE_PRESETS, getSavedPresets, SavedPresetState, savePreset, deleteSavedPreset } from "@/utils/presetsData";
import { Share2, Maximize, Bookmark, Plus, Trash2, Check } from "lucide-react";

interface PresetsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDimensions: (w: number, h: number, name: string) => void;
  onApplySavedPreset?: (preset: SavedPresetState) => void;
  currentSettings?: {
    resizeType: string;
    format: string;
    quality: number;
    scaleMode: string;
    colorSpace: string;
    backgroundColor: string;
  };
}

export default function PresetsSheet({
  isOpen,
  onClose,
  onSelectDimensions,
  onApplySavedPreset,
  currentSettings,
}: PresetsSheetProps) {
  const [tab, setTab] = useState<"platform" | "size" | "saved">("platform");
  const [savedPresets, setSavedPresets] = useState<SavedPresetState[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [isSavingNew, setIsSavingNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSavedPresets(getSavedPresets());
    }
  }, [isOpen]);

  const handleSaveCurrent = () => {
    if (!newPresetName.trim() || !currentSettings) return;
    const created = savePreset(newPresetName.trim(), currentSettings);
    setSavedPresets((prev) => [created, ...prev]);
    setNewPresetName("");
    setIsSavingNew(false);
  };

  const handleDelete = (id: string) => {
    deleteSavedPreset(id);
    setSavedPresets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Presets" snapPoints={[50, 70, 90]} defaultSnap={65}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Segmented
          options={[
            { value: "platform", label: "Sharing Targets" },
            { value: "size", label: "Standard Sizes" },
            { value: "saved", label: "Saved State" },
          ]}
          value={tab}
          onChange={(t) => setTab(t as any)}
        />

        {/* Platform Sharing Targets Tab */}
        {tab === "platform" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)", marginBottom: "4px" }}>
              Target dimensions for social platforms (verify latest platform guidelines before publishing):
            </div>
            {PLATFORM_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectDimensions(p.width, p.height, p.name);
                  onClose();
                }}
                style={presetRowStyle}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Share2 size={16} style={{ color: "var(--blue, #3089c5)" }} />
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{p.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--green, #3fed1e)", fontFamily: "var(--font-mono)" }}>
                    {p.width} × {p.height}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--muted, #8a93b8)", padding: "1px 5px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.06)" }}>
                    {p.aspectRatio}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Size Presets Tab */}
        {tab === "size" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {SIZE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectDimensions(p.width, p.height, p.name);
                  onClose();
                }}
                style={presetRowStyle}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Maximize size={16} style={{ color: "var(--green, #3fed1e)" }} />
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{p.name}</span>
                </div>
                <span style={{ fontSize: "13px", color: "var(--ink, #f2f4fb)", fontFamily: "var(--font-mono)" }}>
                  {p.width} × {p.height}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Saved Presets Tab */}
        {tab === "saved" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentSettings && (
              <div>
                {isSavingNew ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Preset name (e.g. My Webp 80%)..."
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      style={{
                        flex: 1,
                        height: "44px",
                        backgroundColor: "var(--m-surface-2, #222a46)",
                        border: "1px solid var(--green, #3fed1e)",
                        borderRadius: "12px",
                        padding: "0 12px",
                        color: "var(--ink, #f2f4fb)",
                        fontSize: "13px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveCurrent}
                      style={{
                        padding: "0 16px",
                        borderRadius: "12px",
                        backgroundColor: "var(--green, #3fed1e)",
                        color: "var(--green-ink, #07110a)",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSavingNew(false)}
                      style={{
                        padding: "0 12px",
                        borderRadius: "12px",
                        backgroundColor: "var(--m-surface-3, #2a3252)",
                        color: "var(--ink, #f2f4fb)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSavingNew(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      height: "44px",
                      borderRadius: "14px",
                      backgroundColor: "var(--m-surface-2, #222a46)",
                      border: "1px dashed var(--line-2, rgba(255,255,255,0.14))",
                      color: "var(--green, #3fed1e)",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={16} />
                    <span>Save Current Settings as Preset</span>
                  </button>
                )}
              </div>
            )}

            {savedPresets.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--muted, #8a93b8)" }}>
                <Bookmark size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                <p style={{ fontSize: "14px", margin: 0 }}>No saved presets yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {savedPresets.map((sp) => (
                  <div
                    key={sp.id}
                    style={{
                      ...presetRowStyle,
                      cursor: "default",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{sp.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>
                        {sp.format.toUpperCase()} · Quality {sp.quality}% · {sp.resizeType} · {sp.scaleMode}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {onApplySavedPreset && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplySavedPreset(sp);
                            onClose();
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            backgroundColor: "var(--green, #3fed1e)",
                            color: "var(--green-ink, #07110a)",
                            fontWeight: 700,
                            fontSize: "12px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Apply
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(sp.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "none",
                          border: "none",
                          color: "var(--red, #f04040)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

const presetRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 14px",
  borderRadius: "14px",
  backgroundColor: "var(--m-surface-2, #222a46)",
  border: "1px solid var(--line, rgba(255,255,255,0.06))",
  color: "var(--ink, #f2f4fb)",
  cursor: "pointer",
  width: "100%",
  textAlign: "left",
  WebkitTapHighlightColor: "transparent",
};
