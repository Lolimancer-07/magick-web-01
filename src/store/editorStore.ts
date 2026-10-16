import { create } from "zustand";
import type { PipelineStep } from "@/engine/types";

const genId = (): string =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export interface ToastItem {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
}

interface EditorState {
  // Image metadata
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  originalDimensions: { w: number; h: number } | null;

  // Pipeline history & selection
  steps: PipelineStep[];
  past: PipelineStep[][];
  future: PipelineStep[][];
  selectedUid: string | null;

  // Preview & rendering stats
  previewUrl: string | null;
  previewLoading: boolean;
  previewError: string | null;
  renderTimeMs: number | null;

  // Viewport / canvas controls
  zoom: number;
  pan: { x: number; y: number };
  beforeAfterMode: boolean;
  beforeUrl: string | null;
  peekOriginal: boolean;

  // Feedback & Dialogs
  toasts: ToastItem[];
  shortcutSheetOpen: boolean;

  // Actions
  setFile: (
    name: string,
    dims: { w: number; h: number },
    meta?: { size?: number; type?: string }
  ) => void;
  addStep: (opId: string, defaults: Record<string, number | string | boolean>) => void;
  updateStep: (
    uid: string,
    params: Record<string, number | string | boolean>,
    commit?: boolean
  ) => void;
  toggleStep: (uid: string) => void;
  removeStep: (uid: string) => void;
  reorderSteps: (from: number, to: number) => void;
  setSelectedUid: (uid: string | null) => void;
  undo: () => void;
  redo: () => void;
  setPreviewUrl: (u: string | null) => void;
  setBeforeUrl: (u: string | null) => void;
  setPreviewLoading: (v: boolean) => void;
  setPreviewError: (e: string | null) => void;
  setRenderTimeMs: (ms: number | null) => void;
  setZoom: (z: number | ((prev: number) => number)) => void;
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setBeforeAfterMode: (v: boolean) => void;
  setPeekOriginal: (v: boolean) => void;
  addToast: (msg: string, type?: "info" | "success" | "error") => void;
  removeToast: (id: string) => void;
  setShortcutSheetOpen: (open: boolean) => void;
  reset: () => void;
}

const snapshot = (steps: PipelineStep[]): PipelineStep[] =>
  steps.map((s) => ({ ...s, params: { ...s.params } }));

export const useEditorStore = create<EditorState>((set, get) => ({
  fileName: null,
  fileSize: null,
  fileType: null,
  originalDimensions: null,
  steps: [],
  past: [],
  future: [],
  selectedUid: null,
  previewUrl: null,
  previewLoading: false,
  previewError: null,
  renderTimeMs: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  beforeAfterMode: false,
  beforeUrl: null,
  peekOriginal: false,
  toasts: [],
  shortcutSheetOpen: false,

  setFile: (name, dims, meta) =>
    set({
      fileName: name,
      originalDimensions: dims,
      fileSize: meta?.size ?? null,
      fileType: meta?.type ?? (name.split(".").pop()?.toUpperCase() || "IMAGE"),
      steps: [],
      past: [],
      future: [],
      selectedUid: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
    }),

  addStep: (opId, defaults) => {
    const { steps, past } = get();
    const newStep: PipelineStep = { uid: genId(), opId, params: { ...defaults }, enabled: true };
    set({
      steps: [...steps, newStep],
      past: [...past, snapshot(steps)],
      future: [],
      selectedUid: newStep.uid,
    });
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
    const { steps, past, selectedUid } = get();
    const filtered = steps.filter((s) => s.uid !== uid);
    let nextSelected = selectedUid;
    if (selectedUid === uid) {
      nextSelected = filtered.length > 0 ? filtered[filtered.length - 1].uid : null;
    }
    set({
      steps: filtered,
      past: [...past, snapshot(steps)],
      future: [],
      selectedUid: nextSelected,
    });
  },

  reorderSteps: (from, to) => {
    const { steps, past } = get();
    const arr = [...steps];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    set({ steps: arr, past: [...past, snapshot(steps)], future: [] });
  },

  setSelectedUid: (uid) => set({ selectedUid: uid }),

  undo: () => {
    const { steps, past, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      steps: prev,
      past: past.slice(0, -1),
      future: [snapshot(steps), ...future],
      selectedUid: prev.length > 0 ? prev[prev.length - 1].uid : null,
    });
  },

  redo: () => {
    const { steps, past, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      steps: next,
      past: [...past, snapshot(steps)],
      future: future.slice(1),
      selectedUid: next.length > 0 ? next[next.length - 1].uid : null,
    });
  },

  setPreviewUrl: (u) => set({ previewUrl: u }),
  setBeforeUrl: (u) => set({ beforeUrl: u }),
  setPreviewLoading: (v) => set({ previewLoading: v }),
  setPreviewError: (e) => set({ previewError: e }),
  setRenderTimeMs: (ms) => set({ renderTimeMs: ms }),

  setZoom: (z) =>
    set((state) => ({
      zoom: typeof z === "function" ? (z as (prev: number) => number)(state.zoom) : z,
    })),

  setPan: (pan) =>
    set((state) => ({
      pan: typeof pan === "function" ? (pan as (prev: { x: number; y: number }) => { x: number; y: number })(state.pan) : pan,
    })),

  setBeforeAfterMode: (v) => set({ beforeAfterMode: v }),
  setPeekOriginal: (v) => set({ peekOriginal: v }),

  addToast: (message, type = "info") => {
    const id = genId();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3200);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setShortcutSheetOpen: (open) => set({ shortcutSheetOpen: open }),

  reset: () =>
    set({
      fileName: null,
      fileSize: null,
      fileType: null,
      originalDimensions: null,
      steps: [],
      past: [],
      future: [],
      selectedUid: null,
      previewUrl: null,
      previewLoading: false,
      previewError: null,
      renderTimeMs: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      beforeAfterMode: false,
      beforeUrl: null,
      peekOriginal: false,
    }),
}));
