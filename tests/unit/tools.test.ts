import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { TOOLS, getTotalToolCount, TOOL_MAP } from "@/tools/toolRegistry";

describe("Tool Registry & Coverage Verification (Spec 8)", () => {
  const coveragePath = path.resolve(process.cwd(), "src/ops/coverage.json");
  const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));

  it("tool count is dynamic and never hardcoded to 140", () => {
    const count = getTotalToolCount();
    expect(count).toBe(TOOLS.length);
    expect(count).toBeGreaterThan(15);
  });

  it("all tools have valid non-empty id, title, description, and route", () => {
    for (const tool of TOOLS) {
      expect(tool.id).toBeTruthy();
      expect(tool.title).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.route).toMatch(/^\/app\/tool\//);
      expect(TOOL_MAP[tool.id]).toBe(tool);
    }
  });

  it("every tool cliFlag references an option present in coverage.json", () => {
    const invalidFlags: { toolId: string; flag: string }[] = [];

    for (const tool of TOOLS) {
      if (tool.cliFlags) {
        for (const flag of tool.cliFlags) {
          if (!coverage[flag]) {
            invalidFlags.push({ toolId: tool.id, flag });
          }
        }
      }
    }

    expect(invalidFlags).toEqual([]);
  });

  it("all 10 observed tools from the reference Edit tab exist with real text", () => {
    const expectedEditTools = [
      "single-edit",
      "resize-convert",
      "format-conversion",
      "crop",
      "image-cutting",
      "resize-weight",
      "resize-limits",
      "edit-exif",
      "delete-exif",
      "batch-rename",
    ];

    for (const expectedId of expectedEditTools) {
      const tool = TOOL_MAP[expectedId];
      expect(tool).toBeDefined();
      expect(tool.tab).toBe("edit");
      expect(tool.description.length).toBeGreaterThan(10);
    }
  });
});
