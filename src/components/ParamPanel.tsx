"use client";

import { OP_MAP } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import type { PipelineStep } from "@/engine/types";
import type { ParamDef } from "@/engine/types";

interface ParamPanelProps {
  step: PipelineStep;
}

function NumberParam({
  def,
  value,
  onChange,
  onCommit,
}: {
  def: Extract<ParamDef, { type: "number" }>;
  value: number;
  onChange: (v: number) => void;
  onCommit: (v: number) => void;
}) {
  return (
    <div className="param-row">
      <label className="param-label">
        {def.label}
        <span className="param-value">{value}</span>
      </label>
      <input
        className="param-slider"
        type="range"
        min={def.min}
        max={def.max}
        step={def.step ?? 1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onMouseUp={(e) => onCommit(parseFloat((e.target as HTMLInputElement).value))}
        onTouchEnd={(e) => onCommit(parseFloat((e.target as HTMLInputElement).value))}
      />
      <div className="param-range-labels">
        <span>{def.min}</span>
        <span>{def.max}</span>
      </div>
    </div>
  );
}

function SelectParam({
  def,
  value,
  onChange,
}: {
  def: Extract<ParamDef, { type: "select" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="param-row">
      <label className="param-label">{def.label}</label>
      <select className="param-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {def.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function BoolParam({
  def,
  value,
  onChange,
}: {
  def: Extract<ParamDef, { type: "boolean" }>;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="param-row param-row-bool">
      <label className="param-label">{def.label}</label>
      <button
        className={`toggle-btn ${value ? "on" : "off"}`}
        onClick={() => onChange(!value)}
      >
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}

export default function ParamPanel({ step }: ParamPanelProps) {
  const { updateStep } = useEditorStore();
  const op = OP_MAP[step.opId];
  if (!op || op.params.length === 0) {
    return <p className="param-no-params">No parameters</p>;
  }

  return (
    <div className="param-panel">
      {op.params.map((def) => {
        const value = step.params[def.id] ?? def.default;

        if (def.type === "number") {
          return (
            <NumberParam
              key={def.id}
              def={def}
              value={value as number}
              onChange={(v) => updateStep(step.uid, { [def.id]: v })}
              onCommit={(v) => updateStep(step.uid, { [def.id]: v }, true)}
            />
          );
        }
        if (def.type === "select") {
          return (
            <SelectParam
              key={def.id}
              def={def}
              value={value as string}
              onChange={(v) => updateStep(step.uid, { [def.id]: v }, true)}
            />
          );
        }
        if (def.type === "boolean") {
          return (
            <BoolParam
              key={def.id}
              def={def}
              value={value as boolean}
              onChange={(v) => updateStep(step.uid, { [def.id]: v }, true)}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
