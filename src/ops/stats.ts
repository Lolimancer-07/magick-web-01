/**
 * stats.ts — All numbers about the engine, computed from data files.
 *
 * Rule: Never hardcode counts. Every number that appears in the UI must
 * come from here, which in turn reads coverage.json and engine-capabilities.json.
 */

import coverageData from "./coverage.json";
import capabilitiesData from "./engine-capabilities.json";

interface CoverageItem {
  section: string;
  status: "ui" | "native-only" | "not-applicable" | "planned";
  tool?: string;
  engine?: string;
  reason?: string;
}

const entries = Object.entries(
  coverageData as Record<string, CoverageItem>
);

const capabilities = capabilitiesData as {
  counts: { methods: number; properties: number; formats: number };
  formats: string[];
};

export const COVERAGE_STATS = {
  /** Total CLI option keys in coverage.json */
  total: entries.length,
  /** Options exposed via the browser WASM UI */
  ui: entries.filter(([, v]) => v.status === "ui").length,
  /** Options that require the native desktop build */
  nativeOnly: entries.filter(([, v]) => v.status === "native-only").length,
  /** Options not applicable in any UI (e.g., -display, -bench) */
  notApplicable: entries.filter(([, v]) => v.status === "not-applicable").length,
  /** Planned / proposed operations */
  planned: entries.filter(([, v]) => v.status === "planned").length,
  /** Total number of image formats the WASM engine knows about */
  formatsCount: capabilities.counts.formats,
  /** Raw list of format names from engine-capabilities.json */
  formatNames: capabilities.formats as string[],
} as const;
