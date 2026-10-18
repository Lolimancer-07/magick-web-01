"use client";

import React from "react";
import { Edit3, PlusSquare, Image as ImageIcon, Wrench } from "lucide-react";

export type NavTab = "edit" | "create" | "image" | "tools";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "edit", label: "Edit", icon: Edit3 },
  { id: "create", label: "Create", icon: PlusSquare },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "tools", label: "Tools", icon: Wrench },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      id="bottom-nav"
      aria-label="Main Navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(var(--m-bottom-nav-h, 72px) + var(--safe-bottom, 0px))",
        paddingBottom: "var(--safe-bottom, 0px)",
        backgroundColor: "var(--m-surface-1, #1c233c)",
        borderTop: "1px solid var(--line, rgba(255,255,255,0.08))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 50,
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            id={`nav-tab-${id}`}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              minHeight: "var(--m-tap, 48px)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 0",
              color: isActive ? "var(--ink, #f2f4fb)" : "var(--muted, #8a93b8)",
              transition: "all 0.18s ease-out",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* Pill container around icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "32px",
                borderRadius: "var(--m-radius-chip, 999px)",
                backgroundColor: isActive ? "var(--m-surface-3, #2a3252)" : "transparent",
                color: isActive ? "var(--green, #3fed1e)" : "inherit",
                transition: "background-color 0.2s ease, transform 0.15s ease",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Icon size={20} />
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: isActive ? 600 : 500,
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
