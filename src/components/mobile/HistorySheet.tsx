"use client";

import React from "react";
import BottomSheet from "./BottomSheet";
import { History, Check, Trash2 } from "lucide-react";

export interface HistoryStepItem {
  id: string;
  name: string;
  timestamp: number;
}

interface HistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  steps: HistoryStepItem[];
  currentIndex: number;
  onJumpTo: (index: number) => void;
  onClear: () => void;
}

export default function HistorySheet({
  isOpen,
  onClose,
  steps,
  currentIndex,
  onJumpTo,
  onClear,
}: HistorySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Editing History" snapPoints={[40, 60, 80]} defaultSnap={55}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
            {steps.length} {steps.length === 1 ? "action" : "actions"} recorded this session
          </span>
          {steps.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              style={{
                background: "none",
                border: "none",
                color: "var(--red, #f04040)",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {steps.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--muted, #8a93b8)" }}>
            <History size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
            <p style={{ fontSize: "14px", margin: 0 }}>No modifications yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {steps.map((step, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onJumpTo(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    backgroundColor: isCurrent ? "var(--m-surface-3, #2a3252)" : "var(--m-surface-2, #222a46)",
                    border: `1px solid ${isCurrent ? "var(--green, #3fed1e)" : "var(--line, rgba(255,255,255,0.06))"}`,
                    color: "var(--ink, #f2f4fb)",
                    cursor: "pointer",
                    textAlign: "left",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: isCurrent ? "var(--green, #3fed1e)" : "rgba(255,255,255,0.08)",
                        color: isCurrent ? "var(--green-ink, #07110a)" : "var(--muted, #8a93b8)",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: isCurrent ? 700 : 500 }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--muted, #8a93b8)" }}>
                        {new Date(step.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <div style={{ color: "var(--green, #3fed1e)" }}>
                      <Check size={18} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
