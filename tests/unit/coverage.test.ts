import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Coverage Manifest & Parser Test", () => {
  const helpPath = path.resolve(process.cwd(), "reference/magick-help.txt");
  const coveragePath = path.resolve(process.cwd(), "src/ops/coverage.json");
  const capabilitiesPath = path.resolve(process.cwd(), "src/ops/engine-capabilities.json");
  const docPath = path.resolve(process.cwd(), "docs/COVERAGE.md");

  it("reference/magick-help.txt exists and has options", () => {
    expect(fs.existsSync(helpPath)).toBe(true);
    const content = fs.readFileSync(helpPath, "utf-8");
    expect(content.length).toBeGreaterThan(1000);
  });

  it("src/ops/coverage.json exists and is valid JSON", () => {
    expect(fs.existsSync(coveragePath)).toBe(true);
    const raw = fs.readFileSync(coveragePath, "utf-8");
    const json = JSON.parse(raw);
    expect(typeof json).toBe("object");
  });

  it("all options from magick-help.txt are accounted for in coverage.json", () => {
    const helpContent = fs.readFileSync(helpPath, "utf-8");
    const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));

    const lines = helpContent.split("\n");
    const helpOptions: string[] = [];

    for (const line of lines) {
      const m = line.match(/^\s\s(-[a-zA-Z0-9\-+]+)\b/);
      if (m) {
        helpOptions.push(m[1]);
      }
    }

    expect(helpOptions.length).toBeGreaterThan(200);

    const missing: string[] = [];
    for (const opt of helpOptions) {
      if (!coverage[opt]) {
        missing.push(opt);
      }
    }

    expect(missing).toEqual([]);
  });

  it("no entries have status 'planned'", () => {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));
    const planned = Object.entries(coverage).filter(
      ([, v]: [string, any]) => v.status === "planned"
    );
    expect(planned).toEqual([]);
  });

  it("every not-applicable option has a valid one-line reason", () => {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));
    const invalidNotApplicable = Object.entries(coverage).filter(
      ([, v]: [string, any]) =>
        v.status === "not-applicable" && (!v.reason || typeof v.reason !== "string" || v.reason.trim().length === 0)
    );
    expect(invalidNotApplicable).toEqual([]);
  });

  it("every native-only option has a valid tool and reason", () => {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));
    const invalidNative = Object.entries(coverage).filter(
      ([, v]: [string, any]) =>
        v.status === "native-only" && (!v.reason || !v.tool || v.engine !== "native")
    );
    expect(invalidNative).toEqual([]);
  });

  it("every ui option specifies a tool and wasm engine", () => {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));
    const invalidUi = Object.entries(coverage).filter(
      ([, v]: [string, any]) =>
        v.status === "ui" && (!v.tool || v.engine !== "wasm")
    );
    expect(invalidUi).toEqual([]);
  });

  it("engine capabilities json exists and has expected methods", () => {
    expect(fs.existsSync(capabilitiesPath)).toBe(true);
    const caps = JSON.parse(fs.readFileSync(capabilitiesPath, "utf-8"));
    expect(caps.methods.length).toBeGreaterThan(50);
    expect(caps.formats.length).toBeGreaterThan(50);
  });

  it("docs/COVERAGE.md exists and is up to date", () => {
    expect(fs.existsSync(docPath)).toBe(true);
    const doc = fs.readFileSync(docPath, "utf-8");
    expect(doc).toContain("ImageMagick CLI Feature Coverage Manifest");
    expect(doc).toContain("Total CLI Options");
  });
});
