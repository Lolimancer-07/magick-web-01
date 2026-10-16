"use client";

import { GripVertical, Eye, EyeOff, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { PipelineStep } from "@/engine/types";
import { OP_MAP } from "@/ops/definitions";

interface StepRowProps {
  step: PipelineStep;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function StepRow({
  step,
  index,
  total,
  isSelected,
  onSelect,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: StepRowProps) {
  const op = OP_MAP[step.opId];

  // Friendly summary string of primary param values
  const paramSummary = Object.entries(step.params)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  return (
    <div
      onClick={onSelect}
      className={`px-2.5 py-2 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer select-none ${
        isSelected
          ? "bg-[var(--green)]/10 border-[var(--line-2)] shadow-sm"
          : "bg-[var(--surface)] hover:bg-[var(--surface-2)] border-[var(--line)]"
      } ${!step.enabled ? "opacity-45" : ""}`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {/* Step index */}
        <span className="w-4 h-4 rounded text-[10px] font-mono font-bold bg-[var(--surface-2)] text-[var(--ink)]/70 flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        {/* Step Name & Param summary */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-xs text-[var(--ink)] truncate">
              {op?.name || step.opId}
            </span>
          </div>
          {paramSummary && (
            <p className="text-[10px] text-[var(--muted)] font-mono truncate">
              {paramSummary}
            </p>
          )}
        </div>
      </div>

      {/* Row Action Controls */}
      <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Keyboard Reorder buttons */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 rounded text-[var(--ink)]/60 hover:text-[var(--ink)] disabled:opacity-20 disabled:hover:text-[var(--ink)]/60 transition-colors"
          title="Move Step Up (Alt+Up)"
          aria-label="Move step up"
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1 rounded text-[var(--ink)]/60 hover:text-[var(--ink)] disabled:opacity-20 disabled:hover:text-[var(--ink)]/60 transition-colors"
          title="Move Step Down (Alt+Down)"
          aria-label="Move step down"
        >
          <ChevronDown size={12} />
        </button>

        {/* Toggle Enabled */}
        <button
          type="button"
          onClick={onToggle}
          className={`p-1 rounded transition-colors ${
            step.enabled ? "text-[var(--green)] hover:bg-[var(--green)]/15" : "text-[var(--muted)] hover:bg-slate-200"
          }`}
          title={step.enabled ? "Disable Step" : "Enable Step"}
          aria-label={step.enabled ? "Disable step" : "Enable step"}
        >
          {step.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          title="Remove Step (Delete)"
          aria-label="Remove step"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
