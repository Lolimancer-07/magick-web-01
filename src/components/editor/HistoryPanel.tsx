"use client";

import {
  Layers,
  Undo2,
  Redo2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sliders,
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { OP_MAP } from "@/ops/definitions";

interface HistoryPanelProps {
  selectedUid: string | null;
  onSelectStep?: (uid: string) => void;
}

export default function HistoryPanel({ selectedUid, onSelectStep }: HistoryPanelProps) {
  const {
    steps,
    past,
    future,
    undo,
    redo,
    toggleStep,
    removeStep,
    reorderSteps,
  } = useEditorStore();

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line-2)]/10 shadow-sm p-4 flex flex-col max-h-[42vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line-2)]/10 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Layers size={15} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--ink)] tracking-tight">Active Pipeline</h3>
            <p className="text-[10px] text-muted">{steps.length} step{steps.length === 1 ? "" : "s"} applied</p>
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-[var(--line-2)]/10">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="p-1 rounded text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-[var(--surface)] disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={13} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="p-1 rounded text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-[var(--surface)] disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={13} />
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="overflow-y-auto pr-1 flex-1 space-y-1.5">
        {steps.map((step, index) => {
          const op = OP_MAP[step.opId];
          const isSelected = selectedUid ? step.uid === selectedUid : index === steps.length - 1;

          const paramSummary = Object.entries(step.params)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ");

          return (
            <div
              key={step.uid}
              onClick={() => onSelectStep?.(step.uid)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-green/5 border-green-d/40 shadow-sm"
                  : "bg-[var(--surface)] hover:bg-slate-50 border-[var(--line-2)]/10"
              } ${!step.enabled ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded text-[10px] font-mono font-bold bg-slate-100 text-[var(--ink)]/70 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-display font-bold text-xs text-[var(--ink)] truncate max-w-[110px]">
                    {op?.name || step.opId}
                  </span>
                </div>

                {/* Step controls */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => index > 0 && reorderSteps(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 rounded text-[var(--ink)]/60 hover:text-[var(--ink)] hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => index < steps.length - 1 && reorderSteps(index, index + 1)}
                    disabled={index === steps.length - 1}
                    className="p-1 rounded text-[var(--ink)]/60 hover:text-[var(--ink)] hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleStep(step.uid)}
                    className={`p-1 rounded transition-colors ${
                      step.enabled ? "text-green-d hover:bg-green/10" : "text-muted hover:bg-slate-100"
                    }`}
                    title={step.enabled ? "Disable step" : "Enable step"}
                  >
                    {step.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeStep(step.uid)}
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete step"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {paramSummary && (
                <p className="text-[10px] text-muted font-mono truncate pl-6 mt-0.5">
                  {paramSummary}
                </p>
              )}
            </div>
          );
        })}

        {steps.length === 0 && (
          <div className="py-6 text-center text-muted">
            <Sliders size={20} className="mx-auto mb-1 text-muted/40" />
            <p className="font-display font-semibold text-xs text-[var(--ink)]/80">Pipeline is Empty</p>
            <p className="text-[11px] text-muted/70 mt-0.5">Click any tool on the left to add a step</p>
          </div>
        )}
      </div>
    </div>
  );
}
