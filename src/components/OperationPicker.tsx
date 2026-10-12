"use client";

import { useState, useMemo } from "react";
import { OPERATIONS } from "@/ops/definitions";
import { useEditorStore } from "@/store/editorStore";
import type { OperationDef } from "@/ops/definitions";

const CATEGORIES = ["Filters", "Color", "Geometry", "Effects"] as const;

export default function OperationPicker() {
  const { addStep } = useEditorStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return OPERATIONS.filter((op) => {
      const matchesSearch = op.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || op.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map: Record<string, OperationDef[]> = {};
    for (const cat of CATEGORIES) map[cat] = [];
    for (const op of filtered) {
      if (!map[op.category]) map[op.category] = [];
      map[op.category].push(op);
    }
    return map;
  }, [filtered]);

  const handleAdd = (op: OperationDef) => {
    const defaults: Record<string, number | string | boolean> = {};
    for (const p of op.params) defaults[p.id] = p.default;
    addStep(op.id, defaults);
  };

  return (
    <div className="op-picker">
      <div className="op-picker-header">
        <h3>Operations</h3>
        <div className="op-search-wrap">
          <svg className="op-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="op-search"
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="op-cats">
        <button
          className={`op-cat-btn ${!activeCategory ? "active" : ""}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`op-cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Op list */}
      <div className="op-list">
        {CATEGORIES.map((cat) =>
          grouped[cat]?.length ? (
            <div key={cat} className="op-group">
              {(!activeCategory || activeCategory === cat) && (
                <div className="op-group-label">{cat}</div>
              )}
              {grouped[cat].map((op) => (
                <button
                  key={op.id}
                  className="op-item"
                  onClick={() => handleAdd(op)}
                  title={`Add ${op.name}`}
                >
                  <span className="op-icon">{op.icon}</span>
                  <span className="op-name">{op.name}</span>
                  <span className="op-add">+</span>
                </button>
              ))}
            </div>
          ) : null
        )}

        {filtered.length === 0 && (
          <div className="op-empty">No operations match &ldquo;{search}&rdquo;</div>
        )}
      </div>
    </div>
  );
}
