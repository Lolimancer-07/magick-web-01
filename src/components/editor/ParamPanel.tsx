"use client";

import { Sliders, RotateCcw } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { OP_MAP } from "@/ops/definitions";

interface ParamPanelProps {
  selectedUid: string | null;
}

export default function ParamPanel({ selectedUid }: ParamPanelProps) {
  const { steps, updateStep } = useEditorStore();

  const activeStep = selectedUid
    ? steps.find((s) => s.uid === selectedUid)
    : steps[steps.length - 1];

  const opDef = activeStep ? OP_MAP[activeStep.opId] : null;

  if (!activeStep || !opDef) {
    return (
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-4 text-center text-muted">
        <Sliders size={20} className="mx-auto mb-1 text-muted/40" />
        <h4 className="font-display font-bold text-xs text-ink/80 mb-0.5">Parameters</h4>
        <p className="text-[11px]">Select a step in the pipeline to tune settings</p>
      </div>
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
    <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3 max-h-[42vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-ink/10">
        <div>
          <h4 className="font-display font-bold text-sm text-ink tracking-tight">{opDef.name}</h4>
          <span className="text-[10px] text-muted">Tune operation properties</span>
        </div>

        {opDef.params.length > 0 && (
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-ink px-2 py-1 rounded-lg border border-ink/10 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset to defaults"
          >
            <RotateCcw size={11} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {opDef.params.length === 0 ? (
        <div className="py-4 text-center text-muted text-xs">
          This operation works instantly without configurable sliders.
        </div>
      ) : (
        <div className="space-y-3.5">
          {opDef.params.map((param) => {
            const currentValue = activeStep.params[param.id] ?? param.default;

            if (param.type === "number") {
              const numVal = typeof currentValue === "number" ? currentValue : Number(currentValue);

              return (
                <div key={param.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink">
                    <label htmlFor={`param-${activeStep.uid}-${param.id}`}>
                      {param.label}
                    </label>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-ink/10 font-mono text-[11px] text-ink">
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
                        false
                      );
                    }}
                    onMouseUp={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat((e.target as HTMLInputElement).value) },
                        true
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green"
                  />
                  <div className="flex justify-between text-[10px] text-muted/80 font-mono">
                    <span>{param.min}</span>
                    <span>{param.max}</span>
                  </div>
                </div>
              );
            }

            if (param.type === "select") {
              return (
                <div key={param.id} className="space-y-1">
                  <label
                    htmlFor={`param-${activeStep.uid}-${param.id}`}
                    className="block text-xs font-semibold text-ink"
                  >
                    {param.label}
                  </label>
                  <select
                    id={`param-${activeStep.uid}-${param.id}`}
                    value={String(currentValue)}
                    onChange={(e) => {
                      updateStep(activeStep.uid, { [param.id]: e.target.value }, true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-ink/15 bg-slate-50 text-ink text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-d cursor-pointer"
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
                    className="text-xs font-semibold text-ink cursor-pointer"
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
                    className="w-4 h-4 rounded border-ink/20 accent-green cursor-pointer"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
