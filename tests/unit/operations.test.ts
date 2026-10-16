import { describe, it, expect } from "vitest";
import { OPERATIONS, OP_MAP } from "@/ops/definitions";

describe("Operation Registry (Step 4)", () => {
  it("exports OPERATIONS array and OP_MAP dictionary", () => {
    expect(Array.isArray(OPERATIONS)).toBe(true);
    expect(OPERATIONS.length).toBeGreaterThan(0);
    expect(OP_MAP).toBeDefined();
  });

  const requiredOps = ["blur", "sharpen", "resize", "rotate", "grayscale", "sepia"];

  it.each(requiredOps)("includes required operation '%s' with sensible defaults", (opId) => {
    const op = OP_MAP[opId];
    expect(op).toBeDefined();
    expect(op.id).toBe(opId);
    expect(typeof op.name).toBe("string");
    expect(typeof op.apply).toBe("function");

    for (const param of op.params) {
      expect(param.id).toBeDefined();
      expect(param.label).toBeDefined();
      if (param.type === "number") {
        expect(param.default).toBeGreaterThanOrEqual(param.min);
        expect(param.default).toBeLessThanOrEqual(param.max);
      } else if (param.type === "select") {
        expect(param.options).toContain(param.default);
      }
    }
  });
});
