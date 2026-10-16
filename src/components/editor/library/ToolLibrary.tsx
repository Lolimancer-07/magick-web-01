"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Droplets,
  Wind,
  Layers,
  Crop,
  RotateCw,
  ArrowUpDown,
  ArrowLeftRight,
  Contrast,
  CircleDot,
  Sun,
  Sliders,
  Palette,
  Brush,
  Clock,
  Monitor,
  Check,
} from "lucide-react";
import { OPERATIONS, OperationDef } from "@/ops/definitions";
import { COVERAGE_STATS } from "@/ops/stats";
import { useEditorStore } from "@/store/editorStore";
import ToolRow from "./ToolRow";

interface ToolLibraryProps {
  onSelectOp?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Geometry: Crop,
  Color: Palette,
  Filters: Sparkles,
  "Edges & Structure": Contrast,
  Effects: Brush,
  "Draw & Text": Sliders,
  Composite: Layers,
  "Stack & Layers": Layers,
};

const OP_ICONS: Record<string, React.ElementType> = {
  resize: Crop,
  rotate: RotateCw,
  flip: ArrowUpDown,
  flop: ArrowLeftRight,
  modulate: Sliders,
  gamma: Sun,
  sigmoidalContrast: Contrast,
  level: CircleDot,
  grayscale: Droplets,
  sepia: Sparkles,
  negate: Contrast,
  blur: Wind,
  sharpen: Sparkles,
  motionBlur: Wind,
  noise: Sparkles,
  oilPaint: Brush,
  charcoal: Brush,
};

export default function ToolLibrary({ onSelectOp }: ToolLibraryProps) {
  const { addStep, addToast } = useEditorStore();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "browser" | "desktop" | "second">("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [recentOpIds, setRecentOpIds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recently used tools from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("magick_recent_tools");
      if (saved) {
        setRecentOpIds(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecent = (opId: string) => {
    try {
      const updated = [opId, ...recentOpIds.filter((id) => id !== opId)].slice(0, 5);
      setRecentOpIds(updated);
      localStorage.setItem("magick_recent_tools", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddTool = (op: OperationDef) => {
    if (op.engine === "native") {
      addToast(`${op.name} requires the Desktop ImageMagick engine`, "info");
      return;
    }
    addStep(op.id);
    saveRecent(op.id);
    addToast(`Added ${op.name}`, "info");
    if (onSelectOp) onSelectOp();
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter tools by search query and active filter chip
  const filteredOps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return OPERATIONS.filter((op) => {
      // Filter chip
      if (filterType === "browser" && op.engine === "native") return false;
      if (filterType === "desktop" && op.engine !== "native") return false;
      if (filterType === "second" && !op.needs?.includes("secondImage")) return false;

      // Search query
      if (!q) return true;
      const matchName = op.name.toLowerCase().includes(q);
      const matchCategory = op.category.toLowerCase().includes(q);
      const matchId = op.id.toLowerCase().includes(q);
      const matchFlags = op.cliFlags?.some((f) => f.toLowerCase().includes(q));
      const matchDesc = op.description?.toLowerCase().includes(q);
      return matchName || matchCategory || matchId || matchFlags || matchDesc;
    });
  }, [search, filterType]);

  const categories = useMemo(() => {
    const catMap = new Map<string, OperationDef[]>();
    for (const op of filteredOps) {
      const cat = op.category || "General";
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(op);
    }
    return Array.from(catMap.entries()).map(([name, ops]) => ({ name, ops }));
  }, [filteredOps]);

  const recentOps = useMemo(() => {
    if (search) return [];
    return recentOpIds
      .map((id) => OPERATIONS.find((op) => op.id === id))
      .filter((op): op is OperationDef => Boolean(op));
  }, [recentOpIds, search]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--line)",
        userSelect: "none",
        color: "var(--ink)",
      }}
    >
      {/* ── Top Header with Live Count ── */}
      <div
        style={{
          padding: "12px 14px 10px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--muted)",
            }}
          >
            Tool Library
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--green)",
              backgroundColor: "rgba(63,237,30,0.1)",
              padding: "2px 7px",
              borderRadius: "4px",
            }}
          >
            {COVERAGE_STATS.ui} in browser
          </span>
        </div>

        {/* Search input */}
        <div style={{ position: "relative", marginBottom: "8px" }}>
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools or -flag..."
            style={{
              width: "100%",
              height: "32px",
              paddingLeft: "30px",
              paddingRight: "26px",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              backgroundColor: "var(--surface-2)",
              fontSize: "0.82rem",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "9px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              pointerEvents: "none",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            overflowX: "auto",
            paddingBottom: "2px",
          }}
        >
          {[
            { id: "all", label: "All" },
            { id: "browser", label: "Browser" },
            { id: "desktop", label: "Desktop" },
            { id: "second", label: "2nd Image" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterType(chip.id as any)}
              style={{
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor:
                  filterType === chip.id
                    ? "var(--blue)"
                    : "var(--surface-2)",
                color: filterType === chip.id ? "#ffffff" : "var(--muted)",
                transition: "all 0.15s ease",
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tools Scrollable List ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {/* Recently Used section */}
        {recentOps.length > 0 && !search && filterType === "all" && (
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 8px",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              <Clock size={11} />
              Recently Used
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {recentOps.map((op) => (
                <ToolRow
                  key={`recent-${op.id}`}
                  op={op}
                  icon={OP_ICONS[op.id] || Sparkles}
                  colorClass={{ bg: "bg-[var(--tile)]", text: "text-[#3089c5]" }}
                  description={op.description || `${op.category} operation`}
                  onAdd={handleAddTool}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categorized Tools */}
        {categories.map((cat) => {
          const isCollapsed = Boolean(collapsedCategories[cat.name]);
          const Icon = CATEGORY_ICONS[cat.name] || Sliders;

          return (
            <div key={cat.name} style={{ marginBottom: "10px" }}>
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.name)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ink)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <Icon size={14} color="#3089c5" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                    {cat.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--muted)",
                      backgroundColor: "var(--surface-2)",
                      padding: "1px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {cat.ops.length}
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronRight size={14} color="var(--muted)" />
                ) : (
                  <ChevronDown size={14} color="var(--muted)" />
                )}
              </button>

              {/* Category Tools */}
              {!isCollapsed && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    marginTop: "2px",
                    paddingLeft: "4px",
                  }}
                >
                  {cat.ops.map((op) => (
                    <ToolRow
                      key={op.id}
                      op={op}
                      icon={OP_ICONS[op.id] || Icon}
                      colorClass={{ bg: "bg-[var(--tile)]", text: "text-[#3089c5]" }}
                      description={op.description || `${op.category} tool`}
                      onAdd={handleAddTool}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredOps.length === 0 && (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "0.85rem",
            }}
          >
            No tools matching filter
          </div>
        )}
      </div>
    </div>
  );
}
