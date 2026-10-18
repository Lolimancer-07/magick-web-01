"use client";

import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

interface SettingsCardProps {
  id?: string;
  title: string;
  onInfoClick?: () => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsedSummary?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export default function SettingsCard({
  id,
  title,
  onInfoClick,
  collapsible = false,
  defaultCollapsed = false,
  collapsedSummary,
  badge,
  children,
}: SettingsCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div
      id={id}
      style={{
        backgroundColor: "var(--m-surface-1, #1c233c)",
        borderRadius: "var(--m-radius-card, 24px)",
        border: "1px solid var(--line, rgba(255,255,255,0.07))",
        padding: "16px",
        margin: "0 var(--m-pad, 16px) var(--m-gap, 12px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Centered Title Header as specified */}
      <div
        onClick={() => collapsible && setCollapsed((c) => !c)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: "32px",
          marginBottom: collapsed ? 0 : "14px",
          cursor: collapsible ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--ink, #f2f4fb)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>

          {badge}

          {onInfoClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
              }}
              title={`About ${title}`}
              aria-label={`About ${title}`}
              style={{
                width: "28px",
                height: "28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                borderRadius: "50%",
                color: "var(--muted, #8a93b8)",
                cursor: "pointer",
                padding: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <Info size={16} />
            </button>
          )}
        </div>

        {/* Collapsed summary / chevron at right */}
        {collapsible && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--muted, #8a93b8)",
              fontSize: "12px",
            }}
          >
            {collapsed && collapsedSummary && (
              <span style={{ color: "var(--green, #3fed1e)", fontWeight: 500 }}>
                {collapsedSummary}
              </span>
            )}
            <ChevronDown
              size={18}
              style={{
                transition: "transform 0.2s ease",
                transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      {!collapsed && <div>{children}</div>}
    </div>
  );
}
