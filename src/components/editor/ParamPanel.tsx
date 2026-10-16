"use client";

import { useMemo } from "react";
import { Sliders, RotateCcw } from "lucide-react";
import { OP_MAP } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import ClayCard from "@/components/ui/ClayCard";
import IconTile from "@/components/ui/IconTile";

interface ParamPanelProps {
  selectedUid?: string | null;
}

export default function ParamPanel({ selectedUid }: ParamPanelProps) {
  const { steps, updateStep } = useEditorStore();

  // Pick the active step: either explicitly selected or the latest step in pipeline
  const activeStep = useMemo(() => {
    if (selectedUid) {
      return steps.find((s) => s.uid === selectedUid) || null;
    }
    return steps.length > 0 ? steps[steps.length - 1] : null;
  }, [steps, selectedUid]);

  const opDef = activeStep ? OP_MAP[activeStep.opId] : null;

  if (!activeStep || !opDef) {
    return (
      <ClayCard variant="white" className="p-6 text-center text-muted">
        <Sliders size={32} className="mx-auto mb-2 text-muted/60" aria-hidden="true" />
        <h4 className="font-display font-bold text-base text-ink mb-1">Parameters</h4>
        <p className="text-xs">Add or select a pipeline step to configure settings.</p>
      </ClayCard>
    );
  }

  const handleResetDefaults = () => {
    const defaults: Record<string, number | string | boolean> = {};
    for (const p of opDef.params) {
      defaults[p.id] = p.default;
    }
    updateStep(activeStep.uid, defaults, true);
  };

  return (
    <ClayCard variant="white" className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-gray">
        <div className="flex items-center gap-2">
          <IconTile color="salmon" size="sm">
            <Sliders size={16} className="text-ink" aria-hidden="true" />
          </IconTile>
          <div>
            <h4 className="font-display font-bold text-base text-ink">{opDef.name}</h4>
            <p className="text-[11px] text-muted">Tune operation properties</p>
          </div>
        </div>

        {opDef.params.length > 0 && (
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-xs font-bold text-muted hover:text-ink px-2 py-1 rounded-lg border border-ink/40 bg-gray hover:bg-white cursor-pointer transition-colors"
            title="Reset parameters to defaults"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {opDef.params.length === 0 ? (
        <div className="py-4 text-center text-muted text-xs">
          This operation does not require configurable parameters.
        </div>
      ) : (
        <div className="space-y-4">
          {opDef.params.map((param) => {
            const currentValue = activeStep.params[param.id] ?? param.default;

            if (param.type === "number") {
              const numVal = typeof currentValue === "number" ? currentValue : Number(currentValue);

              return (
                <div key={param.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-display font-bold text-ink">
                    <label htmlFor={`param-${activeStep.uid}-${param.id}`}>
                      {param.label}
                    </label>
                    <span className="px-2 py-0.5 rounded-md bg-gray border border-ink font-mono text-[11px]">
                      {numVal}
                    </span>
                  </div>

                  <input
                    id={`param-${activeStep.uid}-${param.id}`}
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step ?? 1}
                    value={numVal}
                    onChange={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat(e.target.value) },
                        false // Live update while dragging
                      );
                    }}
                    onMouseUp={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat((e.target as HTMLInputElement).value) },
                        true // Commit to undo history on release
                      );
                    }}
                    onTouchEnd={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat((e.target as HTMLInputElement).value) },
                        true
                      );
                    }}
                    onKeyUp={(e) => {
                      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
                        updateStep(
                          activeStep.uid,
                          { [param.id]: parseFloat((e.target as HTMLInputElement).value) },
                          true
                        );
                      }
                    }}
                    className="w-full accent-green h-2.5 bg-gray rounded-lg border border-ink appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted font-medium">
                    <span>{param.min}</span>
                    <span>{param.max}</span>
                  </div>
                </div>
              );
            }

            if (param.type === "select") {
              return (
                <div key={param.id} className="space-y-1.5">
                  <label
                    htmlFor={`param-${activeStep.uid}-${param.id}`}
                    className="block text-xs font-display font-bold text-ink"
                  >
                    {param.label}
                  </label>
                  <select
                    id={`param-${activeStep.uid}-${param.id}`}
                    value={String(currentValue)}
                    onChange={(e) => {
                      updateStep(activeStep.uid, { [param.id]: e.target.value }, true);
                    }}
                    className="w-full px-3 py-2 rounded-xl border-2 border-ink bg-gray text-ink font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-d cursor-pointer"
                  >
                    {param.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (param.type === "boolean") {
              const boolVal = Boolean(currentValue);

              return (
                <div key={param.id} className="flex items-center justify-between py-1">
                  <label
                    htmlFor={`param-${activeStep.uid}-${param.id}`}
                    className="text-xs font-display font-bold text-ink cursor-pointer"
                  >
                    {param.label}
                  </label>
                  <input
                    id={`param-${activeStep.uid}-${param.id}`}
                    type="checkbox"
                    checked={boolVal}
                    onChange={(e) => {
                      updateStep(activeStep.uid, { [param.id]: e.target.checked }, true);
                    }}
                    className="w-5 h-5 rounded border-2 border-ink accent-green cursor-pointer"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </ClayCard>
  );
}
