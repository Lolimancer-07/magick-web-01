"use client";

import { create } from "zustand";
import type { PipelineStep } from "@/engine/types";
import { OP_MAP } from "@/ops/definitions";

// ─── IDs ────────────────────────────────────────────────────────────────────

const genId = (): string =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── Image entry (batch / recent) ───────────────────────────────────────────

export interface ImageFileEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url: string;
  width?: number;
  height?: number;
  loadedAt: number;
}

// ─── Toast ──────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
}

// ─── Layout mode ─────────────────────────────────────────────────────────────

/** Determined from viewport width at render time — never by user agent. */
export type LayoutMode = "compact" | "medium" | "wide";

// ─── State interface ─────────────────────────────────────────────────────────

interface AppState {
  // ── Image metadata (current single image) ──
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  originalDimensions: { w: number; h: number } | null;

  // ── Batch & recent ──
  currentImage: ImageFileEntry | null;
  batchImages: ImageFileEntry[];
  recentImages: ImageFileEntry[];

  // ── Pipeline history & selection ──
  steps: PipelineStep[];
  past: PipelineStep[][];
  future: PipelineStep[][];
  selectedUid: string | null;

  // ── Preview & rendering stats ──
  previewUrl: string | null;
  previewLoading: boolean;
  previewError: string | null;
  renderTimeMs: number | null;

  // ── Viewport / canvas controls ──
  zoom: number;
  pan: { x: number; y: number };
  beforeAfterMode: boolean;
  beforeUrl: string | null;
  peekOriginal: boolean;

  // ── Active tool / workflow (deep-link pre-selection) ──
  /** tool= or op= query param value: pre-selected tool/workflow id */
  activeToolId: string | null;

  // ── Layout ──
  /** Derived from viewport, updated by useLayoutMode hook */
  layoutMode: LayoutMode;
  /** Bottom sheet open in compact mode */
  mobileSheet: "tools" | "edits" | "adjust" | "export" | null;

  // ── UI state ──
  commandPaletteOpen: boolean;
  libraryOpen: boolean;
  inspectorOpen: boolean;
  showExport: boolean;
  shortcutSheetOpen: boolean;

  // ── Settings / preferences ──
  theme: "default" | "mauve";
  hapticsEnabled: boolean;
  estimationMode: "accurate" | "fast";
  favoriteToolIds: string[];

  // ── Feedback ──
  toasts: ToastItem[];

  // ── Actions: file / image ──
  setFile: (
    name: string,
    dims: { w: number; h: number },
    meta?: { size?: number; type?: string }
  ) => void;
  setCurrentImage: (file: File, width?: number, height?: number) => ImageFileEntry;
  addBatchImages: (files: File[]) => void;
  removeBatchImage: (id: string) => void;
  clearBatch: () => void;

  // ── Actions: pipeline ──
  addStep: (opId: string, defaults?: Record<string, number | string | boolean>) => void;
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

  // ── Actions: preview ──
  setPreviewUrl: (u: string | null) => void;
  setBeforeUrl: (u: string | null) => void;
  setPreviewLoading: (v: boolean) => void;
  setPreviewError: (e: string | null) => void;
  setRenderTimeMs: (ms: number | null) => void;

  // ── Actions: canvas ──
  setZoom: (z: number | ((prev: number) => number)) => void;
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setBeforeAfterMode: (v: boolean) => void;
  setPeekOriginal: (v: boolean) => void;

  // ── Actions: layout / UI ──
  setLayoutMode: (m: LayoutMode) => void;
  setMobileSheet: (s: "tools" | "edits" | "adjust" | "export" | null) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setLibraryOpen: (v: boolean) => void;
  setInspectorOpen: (v: boolean) => void;
  setShowExport: (v: boolean) => void;
  setShortcutSheetOpen: (open: boolean) => void;
  setActiveToolId: (id: string | null) => void;

  // ── Actions: preferences ──
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  setTheme: (theme: "default" | "mauve") => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setEstimationMode: (mode: "accurate" | "fast") => void;

  // ── Actions: feedback ──
  addToast: (msg: string, type?: "info" | "success" | "error") => void;
  removeToast: (id: string) => void;

  // ── Reset ──
  reset: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const snapshot = (steps: PipelineStep[]): PipelineStep[] =>
  steps.map((s) => ({ ...s, params: { ...s.params } }));

const readLS = (key: string, fallback: string): string => {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
};

const writeLS = (key: string, val: string): void => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, val); } catch {}
};

const LS = {
  FAVS:   "magick_tool_favorites_v2",
  THEME:  "magick_theme_v1",
  HAPTIC: "magick_haptics_v1",
  EST:    "magick_est_mode_v1",
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // file
  fileName: null,
  fileSize: null,
  fileType: null,
  originalDimensions: null,

  // batch / recent
  currentImage: null,
  batchImages: [],
  recentImages: [],

  // pipeline
  steps: [],
  past: [],
  future: [],
  selectedUid: null,

  // preview
  previewUrl: null,
  previewLoading: false,
  previewError: null,
  renderTimeMs: null,

  // canvas
  zoom: 1,
  pan: { x: 0, y: 0 },
  beforeAfterMode: false,
  beforeUrl: null,
  peekOriginal: false,

  // tool selection
  activeToolId: null,

  // layout
  layoutMode: "wide",
  mobileSheet: null,

  // UI
  commandPaletteOpen: false,
  libraryOpen: true,
  inspectorOpen: true,
  showExport: false,
  shortcutSheetOpen: false,

  // preferences
  theme: (readLS(LS.THEME, "default") as "default" | "mauve"),
  hapticsEnabled: readLS(LS.HAPTIC, "true") !== "false",
  estimationMode: (readLS(LS.EST, "accurate") as "accurate" | "fast"),
  favoriteToolIds: (() => {
    try { return JSON.parse(readLS(LS.FAVS, "[]")); } catch { return []; }
  })(),

  // feedback
  toasts: [],

  // ─── file / image actions ────────────────────────────────────────────────

  setFile: (name, dims, meta) =>
    set({
      fileName: name,
      originalDimensions: dims,
      fileSize: meta?.size ?? null,
      fileType: meta?.type ?? null,
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

  setCurrentImage: (file, width, height) => {
    const url = URL.createObjectURL(file);
    const entry: ImageFileEntry = {
      id: genId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type || "image/png",
      url,
      width,
      height,
      loadedAt: Date.now(),
    };
    set((s) => {
      const filtered = s.recentImages.filter(
        (r) => !(r.name === file.name && r.size === file.size)
      );
      return {
        currentImage: entry,
        recentImages: [entry, ...filtered].slice(0, 10),
      };
    });
    return entry;
  },

  addBatchImages: (files) => {
    const entries: ImageFileEntry[] = files.map((f) => ({
      id: genId(),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type || "image/png",
      url: URL.createObjectURL(f),
      loadedAt: Date.now(),
    }));
    set((s) => ({
      batchImages: [...s.batchImages, ...entries],
      currentImage: s.currentImage ?? entries[0] ?? null,
      recentImages: [...entries, ...s.recentImages].slice(0, 10),
    }));
  },

  removeBatchImage: (id) =>
    set((s) => ({ batchImages: s.batchImages.filter((b) => b.id !== id) })),

  clearBatch: () => set({ batchImages: [] }),

  // ─── pipeline actions ────────────────────────────────────────────────────

  addStep: (opId, defaults) => {
    const def = OP_MAP[opId];
    const defParams: Record<string, number | string | boolean> = {};
    if (def?.params) {
      for (const p of def.params) {
        if (p.default !== undefined) defParams[p.id] = p.default;
      }
    }
    const params = { ...defParams, ...(defaults ?? {}) };
    const step: PipelineStep = {
      uid: genId(),
      opId,
      params,
      enabled: true,
    };
    set((s) => ({
      steps: [...s.steps, step],
      past: [...s.past, snapshot(s.steps)],
      future: [],
      selectedUid: step.uid,
    }));
  },

  updateStep: (uid, params, commit = false) =>
    set((s) => {
      const steps = s.steps.map((step) =>
        step.uid === uid
          ? { ...step, params: { ...step.params, ...params } }
          : step
      );
      return commit
        ? { steps, past: [...s.past, snapshot(s.steps)], future: [] }
        : { steps };
    }),

  toggleStep: (uid) =>
    set((s) => ({
      steps: s.steps.map((st) =>
        st.uid === uid ? { ...st, enabled: !st.enabled } : st
      ),
      past: [...s.past, snapshot(s.steps)],
      future: [],
    })),

  removeStep: (uid) =>
    set((s) => ({
      steps: s.steps.filter((st) => st.uid !== uid),
      past: [...s.past, snapshot(s.steps)],
      future: [],
      selectedUid: s.selectedUid === uid ? null : s.selectedUid,
    })),

  reorderSteps: (from, to) =>
    set((s) => {
      const arr = [...s.steps];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { steps: arr, past: [...s.past, snapshot(s.steps)], future: [] };
    }),

  setSelectedUid: (uid) => set({ selectedUid: uid }),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return {};
      const prev = s.past[s.past.length - 1];
      return {
        steps: prev,
        past: s.past.slice(0, -1),
        future: [snapshot(s.steps), ...s.future],
        selectedUid: prev.length > 0 ? prev[prev.length - 1].uid : null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return {};
      const next = s.future[0];
      return {
        steps: next,
        past: [...s.past, snapshot(s.steps)],
        future: s.future.slice(1),
        selectedUid: next.length > 0 ? next[next.length - 1].uid : null,
      };
    }),

  // ─── preview actions ─────────────────────────────────────────────────────

  setPreviewUrl: (u) => set({ previewUrl: u }),
  setBeforeUrl: (u) => set({ beforeUrl: u }),
  setPreviewLoading: (v) => set({ previewLoading: v }),
  setPreviewError: (e) => set({ previewError: e }),
  setRenderTimeMs: (ms) => set({ renderTimeMs: ms }),

  // ─── canvas actions ──────────────────────────────────────────────────────

  setZoom: (z) =>
    set((s) => ({
      zoom: typeof z === "function" ? z(s.zoom) : z,
    })),

  setPan: (pan) =>
    set((s) => ({
      pan: typeof pan === "function" ? pan(s.pan) : pan,
    })),

  setBeforeAfterMode: (v) => set({ beforeAfterMode: v }),
  setPeekOriginal: (v) => set({ peekOriginal: v }),

  // ─── layout / UI actions ─────────────────────────────────────────────────

  setLayoutMode: (m) =>
    set((s) => {
      // Auto-open/close panels based on layout change
      if (m === "wide") return { layoutMode: m, libraryOpen: true, inspectorOpen: true, mobileSheet: null };
      if (m === "medium") return { layoutMode: m, libraryOpen: false, inspectorOpen: false, mobileSheet: null };
      return { layoutMode: m, libraryOpen: false, inspectorOpen: false };
    }),

  setMobileSheet: (s) => set({ mobileSheet: s }),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setLibraryOpen: (v) => set({ libraryOpen: v }),
  setInspectorOpen: (v) => set({ inspectorOpen: v }),
  setShowExport: (v) => set({ showExport: v }),
  setShortcutSheetOpen: (open) => set({ shortcutSheetOpen: open }),
  setActiveToolId: (id) => set({ activeToolId: id }),

  // ─── preference actions ──────────────────────────────────────────────────

  toggleFavorite: (toolId) =>
    set((s) => {
      const exists = s.favoriteToolIds.includes(toolId);
      const next = exists
        ? s.favoriteToolIds.filter((id) => id !== toolId)
        : [...s.favoriteToolIds, toolId];
      writeLS(LS.FAVS, JSON.stringify(next));
      return { favoriteToolIds: next };
    }),

  isFavorite: (toolId) => get().favoriteToolIds.includes(toolId),

  setTheme: (theme) => {
    writeLS(LS.THEME, theme);
    if (typeof document !== "undefined") {
      if (theme === "mauve") {
        document.documentElement.setAttribute("data-theme", "mauve");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
    set({ theme });
  },

  setHapticsEnabled: (enabled) => {
    writeLS(LS.HAPTIC, String(enabled));
    set({ hapticsEnabled: enabled });
  },

  setEstimationMode: (mode) => {
    writeLS(LS.EST, mode);
    set({ estimationMode: mode });
  },

  // ─── feedback actions ────────────────────────────────────────────────────

  addToast: (message, type = "info") => {
    const id = genId();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 3200);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // ─── reset ───────────────────────────────────────────────────────────────

  reset: () =>
    set({
      fileName: null,
      fileSize: null,
      fileType: null,
      originalDimensions: null,
      currentImage: null,
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

// ─── Convenience selector: does the app have an image loaded? ────────────────

export const selectHasImage = (s: AppState): boolean =>
  s.fileName !== null || s.currentImage !== null;

// ─── Haptic helper ───────────────────────────────────────────────────────────

export function triggerHaptic(duration = 10): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    if (useAppStore.getState().hapticsEnabled) {
      navigator.vibrate(duration);
    }
  } catch {}
}

// ─── Backward-compat shims ───────────────────────────────────────────────────
// These allow existing consumers of editorStore / mobileImageStore to keep
// working while they are migrated to useAppStore.

/** @deprecated use useAppStore */
export const useEditorStore = useAppStore;

/** @deprecated use useAppStore */
export const useMobileImageStore = useAppStore;
