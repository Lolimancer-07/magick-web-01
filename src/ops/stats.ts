import coverageData from "./coverage.json";

interface CoverageItem {
  section: string;
  status: "ui" | "native-only" | "not-applicable" | "planned";
  tool?: string;
  engine?: string;
  reason?: string;
}

const entries = Object.entries(coverageData as Record<string, CoverageItem>);

export const COVERAGE_STATS = {
  total: entries.length,
  ui: entries.filter(([, v]) => v.status === "ui").length,
  nativeOnly: entries.filter(([, v]) => v.status === "native-only").length,
  notApplicable: entries.filter(([, v]) => v.status === "not-applicable").length,
  planned: entries.filter(([, v]) => v.status === "planned").length,
  formatsCount: 280, // from engine-capabilities.json
};
