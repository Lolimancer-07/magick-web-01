"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Sliders,
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
} from "lucide-react";
import { OPERATIONS, OperationDef } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import ClayCard from "@/components/ui/ClayCard";
import IconTile from "@/components/ui/IconTile";

interface OperationPickerProps {
  onSelectOp?: () => void;
}

const CATEGORY_COLORS: Record<string, "mint" | "blue" | "salmon" | "lavender"> = {
  Filters: "mint",
  Geometry: "blue",
  Color: "salmon",
  Effects: "lavender",
};

// Lucide icon mapping for operations (strictly SVG, NO emoji)
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
  const { addStep } = useEditorStore();

  const filteredOps = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return OPERATIONS;
    return OPERATIONS.filter(
      (op) =>
        op.name.toLowerCase().includes(q) ||
        op.category.toLowerCase().includes(q) ||
        op.id.toLowerCase().includes(q)
    );
  }, [search]);

  // Group by category
  const categories = useMemo(() => {
    const order: ("Geometry" | "Color" | "Filters" | "Effects")[] = [
      "Geometry",
      "Color",
      "Filters",
      "Effects",
    ];
    return order
      .map((cat) => ({
        name: cat,
        ops: filteredOps.filter((o) => o.category === cat),
      }))
      .filter((cat) => cat.ops.length > 0);
  }, [filteredOps]);

  const handleAdd = (op: OperationDef) => {
    const defaults: Record<string, number | string | boolean> = {};
    for (const p of op.params) {
      defaults[p.id] = p.default;
    }
    addStep(op.id, defaults);
    if (onSelectOp) onSelectOp();
  };

  return (
    <ClayCard variant="white" className="p-4 flex flex-col h-full max-h-[85vh]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-lg text-ink">Add Operation</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray text-muted border border-ink">
          {filteredOps.length} ops
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools (blur, rotate, color...)"
          className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-ink bg-gray text-ink placeholder:text-muted/70 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-d font-medium transition-colors"
          aria-label="Search operations"
        />
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>

      {/* Grouped Tool List */}
      <div className="overflow-y-auto pr-1 flex-1 space-y-4">
        {categories.map((cat) => {
          const colorKey = CATEGORY_COLORS[cat.name] || "blue";

          return (
            <div key={cat.name}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full border border-ink" style={{ backgroundColor: `var(--${colorKey})` }} />
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-muted">
                  {cat.name}
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {cat.ops.map((op) => {
                  const Icon = OP_ICONS[op.id] || Sparkles;

                  return (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => handleAdd(op)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border-2 border-ink bg-white hover:bg-gray transition-all text-left cursor-pointer group hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-none"
                    >
                      <div className="flex items-center gap-3">
                        <IconTile color={colorKey} size="sm">
                          <Icon size={18} className="text-ink" aria-hidden="true" />
                        </IconTile>
                        <div>
                          <p className="font-display font-bold text-sm text-ink group-hover:text-ink">
                            {op.name}
                          </p>
                          <p className="text-[11px] text-muted">
                            {op.params.length === 0
                              ? "Instant action"
                              : `${op.params.length} adjustable param${op.params.length > 1 ? "s" : ""}`}
                          </p>
                        </div>
                      </div>

                      <div className="w-7 h-7 rounded-lg border-2 border-ink bg-gray flex items-center justify-center text-ink group-hover:bg-green group-hover:text-ink transition-colors">
                        <Plus size={16} aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredOps.length === 0 && (
          <div className="text-center py-8 text-muted">
            <p className="text-sm font-semibold">No operations found</p>
            <p className="text-xs mt-1">Try another keyword</p>
          </div>
        )}
      </div>
    </ClayCard>
  );
}
