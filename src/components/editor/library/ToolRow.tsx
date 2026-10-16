"use client";

import { Plus, Monitor } from "lucide-react";
import { OperationDef } from "@/ops/definitions";

interface ToolRowProps {
  op: OperationDef;
  icon: React.ElementType;
  colorClass: { bg: string; text: string };
  description: string;
  onAdd: (op: OperationDef) => void;
}

export default function ToolRow({
  op,
  icon: Icon,
  colorClass,
  description,
  onAdd,
}: ToolRowProps) {
  const isNative = op.engine === "native";

  return (
    <button
      type="button"
      onClick={() => onAdd(op)}
      title={`${op.name}${op.cliFlags?.[0] ? ` (${op.cliFlags[0]})` : ""}: ${description}${isNative ? " (Requires Desktop Engine)" : ""}`}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 8px",
        borderRadius: "8px",
        background: "transparent",
        border: "1px solid transparent",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.15s ease",
        color: "var(--ink)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "var(--surface-2)";
        el.style.borderColor = "var(--line)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "transparent";
        el.style.borderColor = "transparent";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
          flex: 1,
        }}
      >
        {/* Leading icon tile (26px) */}
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "6px",
            backgroundColor: "var(--tile)",
            color: "#3089c5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={14} aria-hidden="true" />
        </div>

        {/* Name, flag, description */}
        <div style={{ minWidth: 0, flex: 1, paddingRight: "4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "var(--ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {op.name}
            </span>

            {op.cliFlags?.[0] && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--green)",
                  backgroundColor: "rgba(63,237,30,0.08)",
                  padding: "0 4px",
                  borderRadius: "3px",
                  flexShrink: 0,
                }}
              >
                {op.cliFlags[0]}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isNative ? (
              <span style={{ color: "#70b8f0", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Monitor size={10} /> Desktop only
              </span>
            ) : (
              description
            )}
          </div>
        </div>
      </div>

      {/* Add indicator button */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          flexShrink: 0,
        }}
      >
        <Plus size={13} aria-hidden="true" />
      </div>
    </button>
  );
}
