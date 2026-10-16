"use client";

import { Sliders, RotateCcw } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { OP_MAP } from "@/ops/definitions";

export default function ParamPanel() {
  const { steps, selectedUid, updateStep } = useEditorStore();

  const activeStep = selectedUid
    ? steps.find((s) => s.uid === selectedUid)
    : steps[steps.length - 1];

  const opDef = activeStep ? OP_MAP[activeStep.opId] : null;

  if (!activeStep || !opDef) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center text-[var(--muted)]">
        <Sliders size={20} className="mb-1 text-[var(--muted)]/40" />
        <p className="font-display font-semibold text-xs text-[var(--ink)]/80">Parameters</p>
        <p className="text-[11px] text-[var(--muted)] mt-0.5">Select a step in the pipeline above</p>
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
    <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto text-[var(--ink)]">
      {/* Parameter Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]/60 shrink-0">
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
            {opDef.name} Parameters
          </h4>
        </div>

        {opDef.params.length > 0 && (
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-1.5 py-0.5 rounded hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            title="Reset step parameters to default"
          >
            <RotateCcw size={11} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {opDef.params.length === 0 ? (
        <div className="py-6 text-center text-[var(--muted)] text-xs">
          This operation applies immediately without adjustable parameters.
        </div>
      ) : (
        <div className="space-y-3">
          {opDef.params.map((param) => {
            const currentValue = activeStep.params[param.id] ?? param.default;

            if (param.type === "number") {
              const numVal = typeof currentValue === "number" ? currentValue : Number(currentValue);

              return (
                <div key={param.id} className="space-y-1">
                  {/* Label & Number Input */}
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
                    <label htmlFor={`param-${activeStep.uid}-${param.id}`}>
                      {param.label}
                    </label>

                    {/* Paired Numeric Input */}
                    <input
                      type="number"
                      min={param.min}
                      max={param.max}
                      step={param.step ?? 1}
                      value={numVal}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          const clamped = Math.max(param.min, Math.min(param.max, val));
                          updateStep(activeStep.uid, { [param.id]: clamped }, true);
                        }
                      }}
                      className="w-16 h-6 px-1.5 rounded border border-[var(--line)] bg-[var(--surface)] text-right font-mono text-[11px] text-[var(--ink)] focus:outline-none focus:border-[var(--line-2)]"
                    />
                  </div>

                  {/* Slider */}
                  <input
                    id={`param-${activeStep.uid}-${param.id}`}
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step ?? 1}
                    value={numVal}
                    aria-valuemin={param.min}
                    aria-valuemax={param.max}
                    aria-valuenow={numVal}
                    onChange={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat(e.target.value) },
                        false // Live preview
                      );
                    }}
                    onMouseUp={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat((e.target as HTMLInputElement).value) },
                        true // Commit to undo history
                      );
                    }}
                    onTouchEnd={(e) => {
                      updateStep(
                        activeStep.uid,
                        { [param.id]: parseFloat((e.target as HTMLInputElement).value) },
                        true
                      );
                    }}
                    className="w-full h-1.5 bg-[#cfc9c3] rounded-lg appearance-none cursor-pointer accent-[#2abc60]"
                  />

                  {/* Min / Max bounds */}
                  <div className="flex justify-between text-[10px] text-[var(--muted)] font-mono">
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
                    className="block text-xs font-semibold text-[var(--ink)]"
                  >
                    {param.label}
                  </label>
                  <select
                    id={`param-${activeStep.uid}-${param.id}`}
                    value={String(currentValue)}
                    onChange={(e) => {
                      updateStep(activeStep.uid, { [param.id]: e.target.value }, true);
                    }}
                    className="w-full h-7 px-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--line-2)] cursor-pointer"
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
                    className="text-xs font-semibold text-[var(--ink)] cursor-pointer"
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
                    className="w-4 h-4 rounded border-[var(--line)] accent-[#2abc60] cursor-pointer"
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
