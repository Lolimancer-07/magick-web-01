"use client";

import React from "react";
import BottomSheet from "./BottomSheet";
import { Lightbulb, CheckCircle2 } from "lucide-react";

export interface InfoContent {
  title: string;
  whatItDoes: string;
  whenToUse: string;
  cliFlag?: string;
  example?: {
    before?: string;
    after?: string;
    description?: string;
  };
}

interface InfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  info: InfoContent | null;
}

export default function InfoSheet({ isOpen, onClose, info }: InfoSheetProps) {
  if (!info) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={info.title} snapPoints={[40, 60, 85]} defaultSnap={55}>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", color: "var(--ink, #f2f4fb)" }}>
        {info.cliFlag && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "var(--m-surface-2, #222a46)",
              color: "var(--green, #3fed1e)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "12px",
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            <span>CLI:</span>
            <code>{info.cliFlag}</code>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--muted, #8a93b8)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            What it does
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
            {info.whatItDoes}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--blue, #3089c5)" }}>
            <Lightbulb size={16} />
            <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
              When to use it
            </h3>
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
            {info.whenToUse}
          </p>
        </div>

        {info.example && (
          <div
            style={{
              padding: "12px",
              borderRadius: "14px",
              backgroundColor: "var(--m-surface-2, #222a46)",
              border: "1px solid var(--line, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--green, #3fed1e)", fontSize: "12px", fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              <span>Example / Best Practice</span>
            </div>
            {info.example.description && (
              <p style={{ fontSize: "13px", color: "var(--muted, #8a93b8)", margin: 0 }}>
                {info.example.description}
              </p>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
