"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../TopBar";
import SettingsCard from "../SettingsCard";
import Segmented from "../Segmented";
import NumberField from "../NumberField";
import ActionBar from "../ActionBar";
import { useMobileImageStore } from "@/store/mobileImageStore";
import { computeBatchRenameList } from "@/utils/batchRename";
import { createZip, downloadBlob } from "@/utils/zipWriter";
import { FileText, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

const TOKEN_CHIPS = [
  { token: "{name}", label: "Original Name" },
  { token: "{index}", label: "Index (001)" },
  { token: "{date}", label: "Date (YYYY-MM-DD)" },
  { token: "{w}", label: "Width" },
  { token: "{h}", label: "Height" },
  { token: "{ext}", label: "Extension" },
  { token: "{counter}", label: "Counter (1, 2)" },
  { token: "{random}", label: "Random ID" },
];

export default function BatchRenameScreen() {
  const router = useRouter();
  const { currentImage, batchImages } = useMobileImageStore();

  const files = batchImages.length > 0 ? batchImages : currentImage ? [currentImage] : [];

  const [pattern, setPattern] = useState("photo_{index}");
  const [startNum, setStartNum] = useState(1);
  const [stepNum, setStepNum] = useState(1);
  const [padding, setPadding] = useState(3);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseChange, setCaseChange] = useState<"none" | "lower" | "upper" | "title">("none");

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute live preview list
  const previewResults = useMemo(() => {
    return computeBatchRenameList(
      files.map((f) => ({
        name: f.name,
        width: f.width,
        height: f.height,
        date: new Date(f.loadedAt),
      })),
      pattern,
      {
        start: startNum,
        step: stepNum,
        padding,
        findText,
        replaceText,
        caseChange,
      }
    );
  }, [files, pattern, startNum, stepNum, padding, findText, replaceText, caseChange]);

  const insertToken = (token: string) => {
    setPattern((p) => p + token);
  };

  const handleSave = async () => {
    if (files.length === 0) return;
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const zipFiles: { name: string; data: Uint8Array }[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const res = previewResults[i];
        const buf = await item.file.arrayBuffer();
        zipFiles.push({
          name: res.conflictResolvedName,
          data: new Uint8Array(buf),
        });
      }

      const zip = createZip(zipFiles);
      downloadBlob(zip, `renamed-batch-${Date.now()}.zip`);
      setSuccessMsg(`Packaged ${files.length} renamed files into ZIP archive!`);
    } catch (err: any) {
      console.error("Batch rename error:", err);
    } finally {
      setIsSaving(false);
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
      <TopBar title="Batch Rename" onBack={() => router.back()} />

      <main style={{ padding: "12px 0 24px" }}>
        {/* Browser limitation notice (Spec 4.10) */}
        <div
          style={{
            margin: "0 16px 12px",
            padding: "10px 14px",
            borderRadius: "14px",
            backgroundColor: "rgba(48, 137, 197, 0.12)",
            border: "1px solid rgba(48, 137, 197, 0.25)",
            fontSize: "12px",
            color: "var(--blue, #3089c5)",
            lineHeight: 1.4,
          }}
        >
          Note: Web browsers cannot rename files directly on your local disk in-place. Outputs are exported as an organized ZIP archive containing your renamed files.
        </div>

        {/* Pattern Field */}
        <SettingsCard title="Naming Pattern">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. photo_{index}"
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "var(--m-surface-2, #222a46)",
                border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
                borderRadius: "14px",
                color: "var(--ink, #f2f4fb)",
                padding: "0 14px",
                fontSize: "15px",
                fontFamily: "var(--font-mono)",
                outline: "none",
              }}
            />

            {/* Token Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {TOKEN_CHIPS.map((chip) => (
                <button
                  key={chip.token}
                  type="button"
                  onClick={() => insertToken(chip.token)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    backgroundColor: "var(--m-surface-3, #2a3252)",
                    border: "1px solid var(--line, rgba(255,255,255,0.06))",
                    color: "var(--green, #3fed1e)",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                  }}
                >
                  {chip.token}
                </button>
              ))}
            </div>
          </div>
        </SettingsCard>

        {/* Index Settings */}
        <SettingsCard title="Numbering Sequence">
          <div style={{ display: "flex", gap: "8px" }}>
            <NumberField label="Start At" value={startNum} min={0} onChange={setStartNum} />
            <NumberField label="Step By" value={stepNum} min={1} onChange={setStepNum} />
            <NumberField label="Padding" value={padding} min={1} max={6} onChange={setPadding} />
          </div>
        </SettingsCard>

        {/* Find and Replace */}
        <SettingsCard title="Find & Replace" collapsible defaultCollapsed>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="text"
              placeholder="Find text..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: "4px" }}>
              <Segmented
                options={[
                  { value: "none", label: "Normal" },
                  { value: "lower", label: "lowercase" },
                  { value: "upper", label: "UPPERCASE" },
                  { value: "title", label: "Title Case" },
                ]}
                value={caseChange}
                onChange={(c) => setCaseChange(c as any)}
              />
            </div>
          </div>
        </SettingsCard>

        {/* Live Preview Table */}
        <SettingsCard title={`Name Preview (${previewResults.length} files)`}>
          {previewResults.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted, #8a93b8)", padding: "16px 0" }}>
              No images loaded. Return to hub and open files.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {previewResults.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    backgroundColor: "var(--m-surface-2, #222a46)",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--muted, #8a93b8)",
                      maxWidth: "42%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.originalName}
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--dim, #4e5880)", flexShrink: 0 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", maxWidth: "50%" }}>
                    <span
                      style={{
                        color: r.hasConflict ? "var(--amber, #f5a623)" : "var(--green, #3fed1e)",
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.conflictResolvedName}
                    </span>
                    {r.hasConflict && (
                      <AlertCircle size={14} style={{ color: "var(--amber, #f5a623)", flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SettingsCard>

        {successMsg && (
          <div
            style={{
              margin: "0 16px",
              padding: "12px 16px",
              borderRadius: "14px",
              backgroundColor: "var(--green, #3fed1e)",
              color: "var(--green-ink, #07110a)",
              fontWeight: 700,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}
      </main>

      <ActionBar onSave={handleSave} isSaving={isSaving} saveLabel={`Rename & Export (${files.length})`} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  backgroundColor: "var(--m-surface-2, #222a46)",
  border: "1px solid var(--line, rgba(255,255,255,0.08))",
  color: "var(--ink, #f2f4fb)",
  padding: "0 12px",
  fontSize: "14px",
  outline: "none",
};
