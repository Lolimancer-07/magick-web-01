"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

export interface TopBarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

interface TopBarProps {
  title?: React.ReactNode;
  onBack?: () => void;
  actions?: TopBarAction[];
  subtitle?: string;
}

export default function TopBar({ title, onBack, actions = [], subtitle }: TopBarProps) {
  return (
    <header
      id="mobile-topbar"
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: "calc(var(--m-topbar-h, 56px) + var(--safe-top, 0px))",
        paddingTop: "var(--safe-top, 0px)",
        paddingLeft: "var(--m-pad, 16px)",
        paddingRight: "var(--m-pad, 16px)",
        backgroundColor: "var(--bg, #0f1320)",
        borderBottom: "1px solid var(--line, rgba(255,255,255,0.07))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        zIndex: 40,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
        {onBack && (
          <button
            id="topbar-back-btn"
            onClick={onBack}
            aria-label="Back"
            style={{
              width: "var(--m-tap, 48px)",
              height: "var(--m-tap, 48px)",
              marginLeft: "-8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              borderRadius: "50%",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <ArrowLeft size={22} />
          </button>
        )}

        <div style={{ minWidth: 0, flex: 1 }}>
          {typeof title === "string" ? (
            <h1
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "var(--ink, #f2f4fb)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>
          ) : (
            title
          )}
          {subtitle && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted, #8a93b8)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {actions.map((action) => (
            <button
              key={action.id}
              id={`topbar-action-${action.id}`}
              onClick={action.onClick}
              disabled={action.disabled}
              aria-label={action.label}
              title={action.label}
              style={{
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: action.active ? "var(--m-surface-3, #2a3252)" : "transparent",
                border: "none",
                color: action.active
                  ? "var(--green, #3fed1e)"
                  : action.disabled
                  ? "var(--dim, #4e5880)"
                  : "var(--ink, #f2f4fb)",
                cursor: action.disabled ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
