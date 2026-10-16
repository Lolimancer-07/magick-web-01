"use client";

import { useState } from "react";
import { Layers, RotateCcw } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import StepRow from "./StepRow";

export default function PipelineList() {
  const {
    steps,
    selectedUid,
    setSelectedUid,
    toggleStep,
    removeStep,
    reorderSteps,
    addToast,
    fileName,
    originalDimensions,
  } = useEditorStore();

  const [announcement, setAnnouncement] = useState("");

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSteps(index, index - 1);
      const name = steps[index].opId;
      setAnnouncement(`Moved ${name} to position ${index}`);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < steps.length - 1) {
      reorderSteps(index, index + 1);
      const name = steps[index].opId;
      setAnnouncement(`Moved ${name} to position ${index + 2}`);
    }
  };

  const handleResetAll = () => {
    if (confirm("Reset all operations in the pipeline?")) {
      useEditorStore.getState().setFile(fileName || "image", originalDimensions || { w: 0, h: 0 });
      addToast("Cleared all edits", "info");
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[140px] max-h-[46vh] border-b border-[var(--line)] p-3 text-[var(--ink)]">
      {/* Live announcement region for screen readers */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--line)]/60 shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers size={14} className="text-[var(--green)]" />
          <span className="font-display font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
            Pipeline Steps
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--surface-2)] text-[var(--muted)]">
            {steps.length}
          </span>
        </div>

        {steps.length > 0 && (
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-1.5 py-0.5 rounded hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            title="Reset All Edits"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
        {steps.map((step, idx) => (
          <StepRow
            key={step.uid}
            step={step}
            index={idx}
            total={steps.length}
            isSelected={selectedUid ? step.uid === selectedUid : idx === steps.length - 1}
            onSelect={() => setSelectedUid(step.uid)}
            onToggle={() => toggleStep(step.uid)}
            onDelete={() => removeStep(step.uid)}
            onMoveUp={() => handleMoveUp(idx)}
            onMoveDown={() => handleMoveDown(idx)}
          />
        ))}

        {steps.length === 0 && (
          <div className="py-8 text-center text-[var(--muted)]">
            <p className="text-xs font-semibold">No edits yet</p>
            <p className="text-[11px] mt-0.5">Click any tool on the left to add a step</p>
          </div>
        )}
      </div>
    </div>
  );
}
