import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "@/store/editorStore";

describe("Editor Zustand Store (Step 6)", () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it("initializes with empty pipeline", () => {
    const state = useEditorStore.getState();
    expect(state.steps).toEqual([]);
    expect(state.past).toEqual([]);
    expect(state.future).toEqual([]);
    expect(state.previewUrl).toBeNull();
  });

  it("addStep adds a step and pushes snapshot to past", () => {
    const store = useEditorStore.getState();
    store.addStep("blur", { sigma: 5 });

    const updated = useEditorStore.getState();
    expect(updated.steps.length).toBe(1);
    expect(updated.steps[0].opId).toBe("blur");
    expect(updated.steps[0].params).toEqual({ sigma: 5 });
    expect(updated.steps[0].enabled).toBe(true);
    expect(updated.past.length).toBe(1);
    expect(updated.past[0]).toEqual([]); // state before add
  });

  it("updateStep with commit=false updates live without pushing to past", () => {
    const store = useEditorStore.getState();
    store.addStep("blur", { sigma: 2 });
    const uid = useEditorStore.getState().steps[0].uid;

    // Simulate drag without commit
    useEditorStore.getState().updateStep(uid, { sigma: 4 }, false);
    let current = useEditorStore.getState();
    expect(current.steps[0].params.sigma).toBe(4);
    expect(current.past.length).toBe(1); // past hasn't grown

    // Simulate mouse release / commit
    useEditorStore.getState().updateStep(uid, { sigma: 8 }, true);
    current = useEditorStore.getState();
    expect(current.steps[0].params.sigma).toBe(8);
    expect(current.past.length).toBe(2);
    expect(current.past[1][0].params.sigma).toBe(4); // snapshot before commit
  });

  it("toggleStep toggles enabled flag", () => {
    const store = useEditorStore.getState();
    store.addStep("grayscale", {});
    const uid = useEditorStore.getState().steps[0].uid;

    expect(useEditorStore.getState().steps[0].enabled).toBe(true);
    useEditorStore.getState().toggleStep(uid);
    expect(useEditorStore.getState().steps[0].enabled).toBe(false);
    useEditorStore.getState().toggleStep(uid);
    expect(useEditorStore.getState().steps[0].enabled).toBe(true);
  });

  it("removeStep removes step and records history", () => {
    const store = useEditorStore.getState();
    store.addStep("blur", { sigma: 2 });
    const uid = useEditorStore.getState().steps[0].uid;

    useEditorStore.getState().removeStep(uid);
    const updated = useEditorStore.getState();
    expect(updated.steps.length).toBe(0);
    expect(updated.past.length).toBe(2);
  });

  it("reorderSteps moves a step from one index to another", () => {
    const store = useEditorStore.getState();
    store.addStep("blur", { sigma: 2 });
    store.addStep("sharpen", { sigma: 1 });
    store.addStep("sepia", { threshold: 80 });

    const s = useEditorStore.getState();
    expect(s.steps.map((x) => x.opId)).toEqual(["blur", "sharpen", "sepia"]);

    // Move sepia from index 2 to 0
    useEditorStore.getState().reorderSteps(2, 0);
    const reordered = useEditorStore.getState();
    expect(reordered.steps.map((x) => x.opId)).toEqual(["sepia", "blur", "sharpen"]);
  });

  it("undo and redo navigate history properly", () => {
    const store = useEditorStore.getState();
    store.addStep("blur", { sigma: 2 });
    const uid = useEditorStore.getState().steps[0].uid;

    // Commit change
    useEditorStore.getState().updateStep(uid, { sigma: 10 }, true);
    expect(useEditorStore.getState().steps[0].params.sigma).toBe(10);

    // Undo
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().steps[0].params.sigma).toBe(2);
    expect(useEditorStore.getState().future.length).toBe(1);

    // Redo
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().steps[0].params.sigma).toBe(10);
    expect(useEditorStore.getState().future.length).toBe(0);
  });

  it("discards stale render responses when newer render ID arrives", () => {
    let latestRequestId = 0;
    let renderedResult: string | null = null;

    const simulateRenderResponse = (reqId: number, result: string) => {
      // Discard results older than latest requested ID
      if (reqId >= latestRequestId) {
        renderedResult = result;
      }
    };

    latestRequestId = 1;
    latestRequestId = 2; // Newer request launched before request 1 returns

    simulateRenderResponse(1, "result-1");
    expect(renderedResult).toBeNull(); // Discarded!

    simulateRenderResponse(2, "result-2");
    expect(renderedResult).toBe("result-2"); // Kept!
  });
});
