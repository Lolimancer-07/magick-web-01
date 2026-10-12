"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OP_MAP } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import ParamPanel from "./ParamPanel";
import type { PipelineStep } from "@/engine/types";

function SortableStep({ step }: { step: PipelineStep }) {
  const { toggleStep, removeStep } = useEditorStore();
  const [expanded, setExpanded] = useState(false);
  const op = OP_MAP[step.opId];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`history-step ${!step.enabled ? "disabled" : ""} ${isDragging ? "dragging" : ""}`}
    >
      <div className="step-header">
        {/* Drag handle */}
        <button className="step-drag" {...attributes} {...listeners} title="Drag to reorder">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
          </svg>
        </button>

        {/* Op icon + name */}
        <button className="step-title" onClick={() => setExpanded(!expanded)}>
          <span className="step-icon">{op?.icon ?? "?"}</span>
          <span className="step-name">{op?.name ?? step.opId}</span>
          {op && op.params.length > 0 && (
            <span className={`step-chevron ${expanded ? "open" : ""}`}>▾</span>
          )}
        </button>

        {/* Toggle */}
        <button
          className={`step-toggle ${step.enabled ? "enabled" : "disabled"}`}
          onClick={() => toggleStep(step.uid)}
          title={step.enabled ? "Disable" : "Enable"}
        >
          {step.enabled ? "●" : "○"}
        </button>

        {/* Delete */}
        <button
          className="step-delete"
          onClick={() => removeStep(step.uid)}
          title="Remove"
        >
          ✕
        </button>
      </div>

      {/* Params accordion */}
      {expanded && op && op.params.length > 0 && (
        <div className="step-params">
          <ParamPanel step={step} />
        </div>
      )}
    </div>
  );
}

export default function HistoryPanel() {
  const { steps, reorderSteps, undo, redo, past, future } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = steps.findIndex((s) => s.uid === active.id);
    const to = steps.findIndex((s) => s.uid === over.id);
    if (from !== -1 && to !== -1) reorderSteps(from, to);
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Pipeline</h3>
        <div className="history-undo-btns">
          <button
            className="icon-btn"
            onClick={undo}
            disabled={past.length === 0}
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          <button
            className="icon-btn"
            onClick={redo}
            disabled={future.length === 0}
            title="Redo (Ctrl+Shift+Z)"
          >
            ↪
          </button>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="history-empty">
          <p>No operations yet.</p>
          <p>Add one from the Operations panel →</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map((s) => s.uid)}
            strategy={verticalListSortingStrategy}
          >
            <div className="history-list">
              {steps.map((step) => (
                <SortableStep key={step.uid} step={step} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
