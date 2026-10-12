import { create } from "zustand";
import type { PipelineStep } from "@/engine/types";

const genId = (): string =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

interface EditorState {
  // Image meta
  fileName: string | null;
  originalDimensions: { w: number; h: number } | null;

  // Pipeline
  steps: PipelineStep[];
  past: PipelineStep[][];
  future: PipelineStep[][];

  // Preview
  previewUrl: string | null;
  previewLoading: boolean;
  previewError: string | null;

  // UI
  beforeAfterMode: boolean;
  beforeUrl: string | null;

  // Actions
  setFile: (name: string, dims: { w: number; h: number }) => void;
  addStep: (opId: string, defaults: Record<string, number | string | boolean>) => void;
  updateStep: (uid: string, params: Record<string, number | string | boolean>, commit?: boolean) => void;
  toggleStep: (uid: string) => void;
  removeStep: (uid: string) => void;
  reorderSteps: (from: number, to: number) => void;
  undo: () => void;
  redo: () => void;
  setPreviewUrl: (u: string | null) => void;
  setBeforeUrl: (u: string | null) => void;
  setPreviewLoading: (v: boolean) => void;
  setPreviewError: (e: string | null) => void;
  setBeforeAfterMode: (v: boolean) => void;
  reset: () => void;
}

const snapshot = (steps: PipelineStep[]): PipelineStep[] =>
  steps.map((s) => ({ ...s, params: { ...s.params } }));

export const useEditorStore = create<EditorState>((set, get) => ({
  fileName: null,
  originalDimensions: null,
  steps: [],
  past: [],
  future: [],
  previewUrl: null,
  previewLoading: false,
  previewError: null,
  beforeAfterMode: false,
  beforeUrl: null,

  setFile: (name, dims) =>
    set({ fileName: name, originalDimensions: dims, steps: [], past: [], future: [] }),

  addStep: (opId, defaults) => {
    const { steps, past } = get();
    const newStep: PipelineStep = { uid: genId(), opId, params: { ...defaults }, enabled: true };
    set({ steps: [...steps, newStep], past: [...past, snapshot(steps)], future: [] });
  },

  updateStep: (uid, params, commit = false) => {
    const { steps, past } = get();
    const updated = steps.map((s) => (s.uid === uid ? { ...s, params: { ...s.params, ...params } } : s));
    set({
      steps: updated,
      past: commit ? [...past, snapshot(steps)] : past,
      future: commit ? [] : get().future,
    });
  },

  toggleStep: (uid) => {
    const { steps } = get();
    set({ steps: steps.map((s) => (s.uid === uid ? { ...s, enabled: !s.enabled } : s)) });
  },

  removeStep: (uid) => {
    const { steps, past } = get();
    set({ steps: steps.filter((s) => s.uid !== uid), past: [...past, snapshot(steps)], future: [] });
  },

  reorderSteps: (from, to) => {
    const { steps, past } = get();
    const arr = [...steps];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    set({ steps: arr, past: [...past, snapshot(steps)], future: [] });
  },

  undo: () => {
    const { steps, past, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({ steps: prev, past: past.slice(0, -1), future: [snapshot(steps), ...future] });
  },

  redo: () => {
    const { steps, past, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({ steps: next, past: [...past, snapshot(steps)], future: future.slice(1) });
  },

  setPreviewUrl: (u) => set({ previewUrl: u }),
  setBeforeUrl: (u) => set({ beforeUrl: u }),
  setPreviewLoading: (v) => set({ previewLoading: v }),
  setPreviewError: (e) => set({ previewError: e }),
  setBeforeAfterMode: (v) => set({ beforeAfterMode: v }),

  reset: () =>
    set({
      fileName: null,
      originalDimensions: null,
      steps: [],
      past: [],
      future: [],
      previewUrl: null,
      previewLoading: false,
      previewError: null,
      beforeAfterMode: false,
      beforeUrl: null,
    }),
}));
