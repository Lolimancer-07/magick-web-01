"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Crop,
  Sun,
  Palette,
  Sparkles,
  Droplets,
  RotateCw,
  ArrowUpDown,
  ArrowLeftRight,
  Contrast,
  CircleDot,
  Brush,
  Wind,
  Layers,
  Sliders,
  X,
} from "lucide-react";
import { OPERATIONS, OperationDef } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";

interface OperationPickerProps {
  onSelectOp?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Filters: { bg: "bg-emerald-50 text-emerald-700", text: "text-emerald-700", dot: "bg-emerald-500" },
  Geometry: { bg: "bg-sky-50 text-sky-700", text: "text-sky-700", dot: "bg-sky-500" },
  Color: { bg: "bg-amber-50 text-amber-700", text: "text-amber-700", dot: "bg-amber-500" },
  Effects: { bg: "bg-purple-50 text-purple-700", text: "text-purple-700", dot: "bg-purple-500" },
};

// SVG Icon mapping for operations
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

export default function OperationPicker({ onSelectOp }: OperationPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { addStep } = useEditorStore();

  const allCategories = ["All", "Geometry", "Color", "Filters", "Effects"];

  const filteredOps = useMemo(() => {
    let list = OPERATIONS;
    if (activeCategory !== "All") {
      list = list.filter((op) => op.category === activeCategory);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (op) =>
        op.name.toLowerCase().includes(q) ||
        op.category.toLowerCase().includes(q) ||
        op.id.toLowerCase().includes(q)
    );
  }, [search, activeCategory]);

  const handleAdd = (op: OperationDef) => {
    const defaults: Record<string, number | string | boolean> = {};
    for (const p of op.params) {
      defaults[p.id] = p.default;
    }
    addStep(op.id, defaults);
    if (onSelectOp) onSelectOp();
  };

  return (
    <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-4 flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display font-bold text-base text-ink tracking-tight">Tools & Ops</h3>
          <p className="text-xs text-muted">17 ImageMagick transforms</p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-ink/70">
          {filteredOps.length}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tools..."
          className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-ink/15 bg-slate-50 text-ink placeholder:text-muted/60 text-xs focus:outline-none focus:bg-white focus:border-green-d transition-all"
          aria-label="Search operations"
        />
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted/70"
          aria-hidden="true"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-0.5 rounded"
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-ink text-white shadow-sm"
                : "bg-slate-100 text-ink/70 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Operations List */}
      <div className="overflow-y-auto pr-1 flex-1 space-y-2">
        {filteredOps.map((op) => {
          const Icon = OP_ICONS[op.id] || Sparkles;
          const color = CATEGORY_COLORS[op.category] || CATEGORY_COLORS.Geometry;

          return (
            <button
              key={op.id}
              type="button"
              onClick={() => handleAdd(op)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-ink/10 bg-white hover:bg-slate-50/80 hover:border-ink/25 hover:shadow-sm transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.bg} shrink-0`}>
                  <Icon size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display font-bold text-xs sm:text-sm text-ink group-hover:text-ink">
                    {op.name}
                  </p>
                  <p className="text-[10px] text-muted">
                    {op.params.length === 0
                      ? "Instant filter"
                      : `${op.params.length} slider${op.params.length > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-green group-hover:text-white text-ink/60 flex items-center justify-center transition-colors">
                <Plus size={14} aria-hidden="true" />
              </div>
            </button>
          );
        })}

        {filteredOps.length === 0 && (
          <div className="text-center py-8 text-muted">
            <p className="text-xs font-semibold">No operations found</p>
            <p className="text-[11px] mt-1">Try another keyword</p>
          </div>
        )}
      </div>
    </div>
  );
}
