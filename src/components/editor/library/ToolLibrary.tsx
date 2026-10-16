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
} from "lucide-react";
import { OPERATIONS, OperationDef } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import ToolRow from "./ToolRow";

interface ToolLibraryProps {
  onSelectOp?: () => void;
}

const TOOL_DESCRIPTIONS: Record<string, string> = {
  resize: "Scale dimensions by percentage",
  rotate: "Rotate degrees clockwise",
  flip: "Flip vertically top-to-bottom",
  flop: "Mirror horizontally left-to-right",
  modulate: "Tune brightness, saturation & hue",
  gamma: "Adjust mid-tone luminance",
  sigmoidalContrast: "S-curve filmic contrast",
  level: "Remap black & white points",
  grayscale: "Monochromatic black & white",
  sepia: "Warm vintage photo tint",
  negate: "Invert all color channels",
  blur: "Soft Gaussian smoothing",
  sharpen: "Crisp edge accentuation",
  motionBlur: "Directional motion streak",
  noise: "Add photographic sensor grain",
  oilPaint: "Painterly artistic canvas strokes",
  charcoal: "Graphite & charcoal drawing",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Geometry: { bg: "bg-[rgba(48,137,197,0.15)]", text: "text-[#70b8f0]" },
  Color: { bg: "bg-[rgba(240,100,100,0.12)]", text: "text-[#f09090]" },
  Filters: { bg: "bg-[rgba(63,237,30,0.12)]", text: "text-[var(--green)]" },
  Effects: { bg: "bg-[rgba(130,100,220,0.15)]", text: "text-[#b09ee0]" },
};

const OP_ICONS: Record<string, React.ElementType> = {
  blur: Droplets,
  sharpen: Sparkles,
  motionBlur: Wind,
  noise: Layers,
  resize: Crop,
  rotate: RotateCw,
  flip: ArrowUpDown,
  flop: ArrowLeftRight,
  grayscale: Contrast,
  negate: CircleDot,
  modulate: Sun,
  sigmoidalContrast: Contrast,
  gamma: Sliders,
  level: Layers,
  sepia: Palette,
  oilPaint: Brush,
  charcoal: Brush,
};

const RECENT_KEY = "magick_recent_tools";

export default function ToolLibrary({ onSelectOp }: ToolLibraryProps) {
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [recentOpIds, setRecentOpIds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { addStep, addToast } = useEditorStore();

  // Load recent tools from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) {
        setRecentOpIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Hotkey / focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const saveRecent = (opId: string) => {
    try {
      const updated = [opId, ...recentOpIds.filter((id) => id !== opId)].slice(0, 3);
      setRecentOpIds(updated);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddOp = (op: OperationDef) => {
    const defaults: Record<string, number | string | boolean> = {};
    for (const p of op.params) {
      defaults[p.id] = p.default;
    }
    addStep(op.id, defaults);
    saveRecent(op.id);
    addToast(`Added ${op.name}`, "info");
    if (onSelectOp) onSelectOp();
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredOps = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return OPERATIONS;
    return OPERATIONS.filter(
      (op) =>
        op.name.toLowerCase().includes(q) ||
        op.category.toLowerCase().includes(q) ||
        op.id.toLowerCase().includes(q) ||
        (TOOL_DESCRIPTIONS[op.id] && TOOL_DESCRIPTIONS[op.id].toLowerCase().includes(q))
    );
  }, [search]);

  const categories = useMemo(() => {
    const order = ["Geometry", "Color", "Filters", "Effects"];
    return order
      .map((cat) => ({
        name: cat,
        ops: filteredOps.filter((o) => o.category === cat),
      }))
      .filter((cat) => cat.ops.length > 0);
  }, [filteredOps]);

  const recentOps = useMemo(() => {
    if (search) return [];
    return recentOpIds
      .map((id) => OPERATIONS.find((op) => op.id === id))
      .filter((op): op is OperationDef => Boolean(op));
  }, [recentOpIds, search]);

  return (
    <div className="w-full h-full flex flex-col bg-[var(--surface)] border-r border-[var(--line)] select-none text-[var(--ink)]">
      {/* ── Sticky Top Search Field ── */}
      <div className="p-3 border-b border-[var(--line)] bg-[var(--surface)] shrink-0">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools (/)"
            className="w-full h-[32px] pl-8 pr-7 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-xs text-[var(--ink)] placeholder:text-[var(--muted)]/70 focus:bg-[var(--surface-2)] focus:outline-none focus:border-ink transition-colors font-medium"
            aria-label="Search tools"
          />
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            aria-hidden="true"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] p-0.5 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Tools Scrollable List ── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
        {/* Recently Used Section */}
        {recentOps.length > 0 && (
          <div>
            <div className="px-2 py-1 flex items-center gap-1.5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
              <Clock size={11} />
              <span>Recent</span>
            </div>
            <div className="space-y-0.5">
              {recentOps.map((op) => (
                <ToolRow
                  key={`recent-${op.id}`}
                  op={op}
                  icon={OP_ICONS[op.id] || Sparkles}
                  colorClass={CATEGORY_COLORS[op.category] || CATEGORY_COLORS.Geometry}
                  description={TOOL_DESCRIPTIONS[op.id] || ""}
                  onAdd={handleAddOp}
                />
              ))}
            </div>
            <div className="h-px bg-[#cfc9c3]/60 my-2 mx-2" />
          </div>
        )}

        {/* Categorized Tools */}
        {categories.map((cat) => {
          const isCollapsed = collapsedCategories[cat.name];
          const color = CATEGORY_COLORS[cat.name] || CATEGORY_COLORS.Geometry;

          return (
            <div key={cat.name}>
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.name)}
                className="w-full px-2 py-1 flex items-center justify-between text-left hover:bg-[var(--surface-2)] rounded transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  {isCollapsed ? (
                    <ChevronRight size={13} className="text-[var(--muted)]" />
                  ) : (
                    <ChevronDown size={13} className="text-[var(--muted)]" />
                  )}
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-[var(--muted)] group-hover:text-[var(--ink)]">
                    {cat.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] px-1.5 py-0.2 rounded bg-[var(--surface-2)]">
                  {cat.ops.length}
                </span>
              </button>

              {/* Rows */}
              {!isCollapsed && (
                <div className="mt-0.5 space-y-0.5">
                  {cat.ops.map((op) => (
                    <ToolRow
                      key={op.id}
                      op={op}
                      icon={OP_ICONS[op.id] || Sparkles}
                      colorClass={color}
                      description={TOOL_DESCRIPTIONS[op.id] || ""}
                      onAdd={handleAddOp}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty Search Result */}
        {filteredOps.length === 0 && (
          <div className="py-8 text-center text-[var(--muted)]">
            <p className="text-xs font-semibold">No tools match &ldquo;{search}&rdquo;</p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-2 text-xs font-bold text-[var(--green)] hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
