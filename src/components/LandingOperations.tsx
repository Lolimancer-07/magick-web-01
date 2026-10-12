"use client";

import { useState } from "react";
import Link from "next/link";
import { OPERATIONS } from "@/ops/definitions";

const CATEGORIES = ["All", "Filters", "Color", "Geometry", "Effects"] as const;

export default function LandingOperations() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? OPERATIONS
      : OPERATIONS.filter((op) => op.category === activeCategory);

  return (
    <section className="ops-section" id="ops">
      <div className="ops-header">
        <h2 className="section-title">All Operations</h2>
        <p className="section-subtitle">
          Click any operation below to launch the editor and test it immediately on a demo image.
        </p>

        {/* Category Tabs */}
        <div className="ops-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`ops-tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="ops-grid">
        {filtered.map((op) => (
          <Link
            key={op.id}
            href={`/editor?op=${op.id}`}
            className="op-chip-btn"
            title={`Launch editor and apply ${op.name}`}
          >
            <span className="op-chip-icon">{op.icon}</span>
            <span className="op-chip-name">{op.name}</span>
            <span className="op-chip-cat">{op.category}</span>
            <span className="op-chip-arrow">→</span>
          </Link>
        ))}
      </div>

      <div className="ops-footer-cta">
        <Link href="/editor?demo=true" className="btn-demo-try">
          ✨ Open Editor with Demo Image
        </Link>
      </div>
    </section>
  );
}
