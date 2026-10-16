"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Search, X, Sparkles, Sliders, Wand2, Terminal, Monitor } from "lucide-react";
import { OPERATIONS, OperationDef } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { addStep, addToast, fileName } = useEditorStore();
  const hasImage = Boolean(fileName);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredOps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OPERATIONS.slice(0, 30);
    return OPERATIONS.filter((op) => {
      const matchName = op.name.toLowerCase().includes(q);
      const matchCategory = op.category.toLowerCase().includes(q);
      const matchId = op.id.toLowerCase().includes(q);
      const matchFlags = op.cliFlags?.some((f) => f.toLowerCase().includes(q));
      const matchDesc = op.description?.toLowerCase().includes(q);
      return matchName || matchCategory || matchId || matchFlags || matchDesc;
    });
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredOps]);

  const handleSelect = (op: OperationDef) => {
    if (op.engine === "native") {
      addToast(`${op.name} requires the Desktop ImageMagick engine`, "info");
      onClose();
      return;
    }
    addStep(op.id);
    addToast(`Added ${op.name} to pipeline`, "success");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredOps.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, filteredOps.length - 1) : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOps[selectedIndex]) {
        handleSelect(filteredOps[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: "rgba(10, 14, 26, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line-strong)",
          borderRadius: "16px",
          boxShadow: "0 16px 50px rgba(0,0,0,0.6)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <Search size={18} color="var(--muted)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools by name, category, or CLI flag (e.g. -blur)..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--ink)",
              fontSize: "0.95rem",
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
          />
          <kbd
            style={{
              fontSize: "0.72rem",
              padding: "3px 6px",
              borderRadius: "4px",
              backgroundColor: "var(--surface-2)",
              color: "var(--muted)",
              border: "1px solid var(--line)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            maxHeight: "380px",
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {filteredOps.length === 0 ? (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: "0.88rem",
              }}
            >
              No ImageMagick tools found matching &quot;{query}&quot;
            </div>
          ) : (
            filteredOps.map((op, idx) => {
              const isSelected = idx === selectedIndex;
              const isNative = op.engine === "native";

              return (
                <div
                  key={op.id}
                  onClick={() => handleSelect(op)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: isSelected
                      ? "var(--surface-2)"
                      : "transparent",
                    border: isSelected
                      ? "1px solid var(--line-strong)"
                      : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.1s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        backgroundColor: "var(--tile)",
                        color: "#3089c5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {op.icon || "⚙"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "var(--ink)",
                          }}
                        >
                          {op.name}
                        </span>
                        {op.cliFlags?.[0] && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.75rem",
                              color: "var(--green)",
                              backgroundColor: "rgba(63,237,30,0.1)",
                              padding: "1px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {op.cliFlags[0]}
                          </span>
                        )}
                        {isNative && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: "var(--muted)",
                              backgroundColor: "var(--surface-3)",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <Monitor size={10} /> Desktop only
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {op.description || `${op.category} operation`}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--muted)",
                      backgroundColor: "var(--surface-3)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      flexShrink: 0,
                    }}
                  >
                    {op.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--line)",
            backgroundColor: "var(--bg-nav)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <span>
              <kbd style={{ padding: "2px 5px", background: "var(--surface)", borderRadius: "3px" }}>↑</kbd>
              <kbd style={{ padding: "2px 5px", background: "var(--surface)", borderRadius: "3px", marginLeft: "2px" }}>↓</kbd> Navigate
            </span>
            <span>
              <kbd style={{ padding: "2px 5px", background: "var(--surface)", borderRadius: "3px" }}>↵</kbd> Select
            </span>
          </div>
          <span>{filteredOps.length} tools available</span>
        </div>
      </div>
    </div>
  );
}
