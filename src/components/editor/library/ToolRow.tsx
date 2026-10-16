"use client";

import { Plus } from "lucide-react";
import { OperationDef } from "@/ops/definitions";

interface ToolRowProps {
  op: OperationDef;
  icon: React.ElementType;
  colorClass: { bg: string; text: string };
  description: string;
  onAdd: (op: OperationDef) => void;
}

export default function ToolRow({ op, icon: Icon, colorClass, description, onAdd }: ToolRowProps) {
  return (
    <button
      type="button"
      onClick={() => onAdd(op)}
      className="w-full h-[40px] px-2 flex items-center justify-between rounded-lg hover:bg-[var(--surface-2)] text-left transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:outline-ink select-none"
      title={`${op.name}: ${description}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Pastel leading icon tile (28px) */}
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border border-ink/10 ${colorClass.bg} ${colorClass.text}`}
        >
          <Icon size={15} aria-hidden="true" />
        </div>

        {/* Name and description in one compact row */}
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="font-display font-semibold text-xs text-[var(--ink)] truncate">
              {op.name}
            </span>
            <span className="text-[11px] text-[var(--muted)] truncate hidden sm:inline">
              {description}
            </span>
          </div>
        </div>
      </div>

      {/* Ghost + button */}
      <div className="w-5 h-5 rounded flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--ink)] group-hover:bg-[var(--surface)] transition-colors shrink-0">
        <Plus size={13} aria-hidden="true" />
      </div>
    </button>
  );
}
