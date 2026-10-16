"use client";

import {
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react";
import { OP_MAP } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import ClayCard from "@/components/ui/ClayCard";
import IconTile from "@/components/ui/IconTile";

interface HistoryPanelProps {
  selectedUid?: string | null;
  onSelectStep?: (uid: string) => void;
}

export default function HistoryPanel({
  selectedUid,
  onSelectStep,
}: HistoryPanelProps) {
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
    <ClayCard variant="white" className="p-4 flex flex-col h-full max-h-[85vh]">
      {/* Header with Undo / Redo */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-gray mb-3">
        <div className="flex items-center gap-2">
          <IconTile color="mint" size="sm">
            <Layers size={16} className="text-ink" aria-hidden="true" />
          </IconTile>
          <div>
            <h3 className="font-display font-bold text-base text-ink">Pipeline</h3>
            <p className="text-[11px] text-muted">{steps.length} step{steps.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        {/* Undo / Redo Clay Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-xl border-2 border-ink font-display text-xs font-bold transition-all ${
              canUndo
                ? "bg-white hover:bg-gray text-ink cursor-pointer active:translate-y-0.5 shadow-[2px_2px_0_var(--ink)]"
                : "bg-gray/50 text-muted/40 border-ink/30 cursor-not-allowed"
            }`}
            aria-label="Undo last change (Ctrl+Z)"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-xl border-2 border-ink font-display text-xs font-bold transition-all ${
              canRedo
                ? "bg-white hover:bg-gray text-ink cursor-pointer active:translate-y-0.5 shadow-[2px_2px_0_var(--ink)]"
                : "bg-gray/50 text-muted/40 border-ink/30 cursor-not-allowed"
            }`}
            aria-label="Redo last change (Ctrl+Shift+Z)"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="overflow-y-auto pr-1 flex-1 space-y-2">
        {steps.map((step, index) => {
          const op = OP_MAP[step.opId];
          const isSelected = selectedUid ? step.uid === selectedUid : index === steps.length - 1;

          // Summarize params
          const paramSummary = Object.entries(step.params)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ");

          return (
            <div
              key={step.uid}
              onClick={() => onSelectStep?.(step.uid)}
              className={`p-3 rounded-xl border-2 border-ink transition-all cursor-pointer ${
                isSelected
                  ? "bg-mint/20 shadow-[3px_3px_0_var(--ink)] -translate-y-0.5"
                  : "bg-white hover:bg-gray shadow-[2px_2px_0_var(--ink)]"
              } ${!step.enabled ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md border border-ink bg-gray flex items-center justify-center font-display font-bold text-[10px] text-ink">
                    {index + 1}
                  </span>
                  <span className="font-display font-bold text-sm text-ink">
                    {op?.name || step.opId}
                  </span>
                </div>

                {/* Step controls */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {/* Up button */}
                  <button
                    type="button"
                    onClick={() => index > 0 && reorderSteps(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 rounded-lg border border-ink/50 bg-white hover:bg-gray disabled:opacity-30 disabled:cursor-not-allowed text-ink cursor-pointer"
                    aria-label={`Move ${op?.name} up`}
                    title="Move up"
                  >
                    <ChevronUp size={14} aria-hidden="true" />
                  </button>

                  {/* Down button */}
                  <button
                    type="button"
                    onClick={() => index < steps.length - 1 && reorderSteps(index, index + 1)}
                    disabled={index === steps.length - 1}
                    className="p-1 rounded-lg border border-ink/50 bg-white hover:bg-gray disabled:opacity-30 disabled:cursor-not-allowed text-ink cursor-pointer"
                    aria-label={`Move ${op?.name} down`}
                    title="Move down"
                  >
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>

                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => toggleStep(step.uid)}
                    className={`p-1 rounded-lg border border-ink text-ink cursor-pointer ${
                      step.enabled ? "bg-mint" : "bg-gray text-muted"
                    }`}
                    aria-label={step.enabled ? `Disable ${op?.name}` : `Enable ${op?.name}`}
                    title={step.enabled ? "Disable step" : "Enable step"}
                  >
                    {step.enabled ? (
                      <Eye size={14} aria-hidden="true" />
                    ) : (
                      <EyeOff size={14} aria-hidden="true" />
                    )}
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeStep(step.uid)}
                    className="p-1 rounded-lg border border-ink bg-salmon/30 hover:bg-salmon text-ink cursor-pointer transition-colors"
                    aria-label={`Delete ${op?.name}`}
                    title="Delete step"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {paramSummary && (
                <p className="text-[11px] text-muted font-mono truncate pl-7">
                  {paramSummary}
                </p>
              )}
            </div>
          );
        })}

        {steps.length === 0 && (
          <div className="py-8 text-center text-muted">
            <p className="font-display font-bold text-sm text-ink mb-1">Pipeline is Empty</p>
            <p className="text-xs">Add an operation from the catalog to begin editing.</p>
          </div>
        )}
      </div>
    </ClayCard>
  );
}
