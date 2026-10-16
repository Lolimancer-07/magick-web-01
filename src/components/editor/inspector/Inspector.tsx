"use client";

import { useState } from "react";
import { Sliders, Info } from "lucide-react";
import PipelineList from "./PipelineList";
import ParamPanel from "./ParamPanel";
import InfoTab from "./InfoTab";

export default function Inspector() {
  const [activeTab, setActiveTab] = useState<"edits" | "info">("edits");

  return (
    <div className="w-full h-full flex flex-col bg-[var(--surface)] border-l border-[var(--line)] select-none text-[var(--ink)]">
      {/* ── Tabs Header ── */}
      <div className="h-[40px] px-3 border-b border-[var(--line)] bg-[var(--surface)] flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("edits")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-display font-bold transition-colors cursor-pointer ${
            activeTab === "edits"
              ? "bg-[var(--surface)] text-[var(--ink)] shadow-[0_1px_2px_rgba(46,54,69,0.08)] border border-[var(--line)]"
              : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
          }`}
        >
          <Sliders size={13} />
          <span>Edits</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-display font-bold transition-colors cursor-pointer ${
            activeTab === "info"
              ? "bg-[var(--surface)] text-[var(--ink)] shadow-[0_1px_2px_rgba(46,54,69,0.08)] border border-[var(--line)]"
              : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
          }`}
        >
          <Info size={13} />
          <span>Info</span>
        </button>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === "edits" ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Half: Pipeline List */}
            <PipelineList />

            {/* Bottom Half: Parameters for selected step */}
            <ParamPanel />
          </div>
        ) : (
          <InfoTab />
        )}
      </div>
    </div>
  );
}
