"use client";

import { create } from "zustand";

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

interface MobileImageState {
  // Current active single image
  currentImage: ImageFileEntry | null;

  // Active batch of images
  batchImages: ImageFileEntry[];

  // Recent images during current session (max 10)
  recentImages: ImageFileEntry[];

  // Favorite tool IDs (persisted to localStorage)
  favoriteToolIds: string[];

  // App settings
  theme: "default" | "mauve";
  hapticsEnabled: boolean;
  estimationMode: "accurate" | "fast";

  // Actions
  setCurrentImage: (file: File, width?: number, height?: number) => ImageFileEntry;
  addBatchImages: (files: File[]) => void;
  removeBatchImage: (id: string) => void;
  clearBatch: () => void;
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  setTheme: (theme: "default" | "mauve") => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setEstimationMode: (mode: "accurate" | "fast") => void;
}

const STORAGE_FAVORITES_KEY = "magick_tool_favorites_v1";
const STORAGE_THEME_KEY = "magick_theme_v1";
const STORAGE_HAPTICS_KEY = "magick_haptics_v1";
const STORAGE_EST_KEY = "magick_est_mode_v1";

const getStoredFavorites = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getStoredTheme = (): "default" | "mauve" => {
  if (typeof window === "undefined") return "default";
  try {
    const t = localStorage.getItem(STORAGE_THEME_KEY);
    return t === "mauve" ? "mauve" : "default";
  } catch {
    return "default";
  }
};

export const useMobileImageStore = create<MobileImageState>((set, get) => ({
  currentImage: null,
  batchImages: [],
  recentImages: [],
  favoriteToolIds: getStoredFavorites(),
  theme: getStoredTheme(),
  hapticsEnabled: true,
  estimationMode: "accurate",

  setCurrentImage: (file: File, width?: number, height?: number) => {
    const url = URL.createObjectURL(file);
    const entry: ImageFileEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type || "image/png",
      url,
      width,
      height,
      loadedAt: Date.now(),
    };

    set((state) => {
      // Add to recent images (deduplicate by file name/size, limit to 10)
      const filteredRecent = state.recentImages.filter(
        (r) => !(r.name === file.name && r.size === file.size)
      );
      return {
        currentImage: entry,
        recentImages: [entry, ...filteredRecent].slice(0, 10),
      };
    });

    return entry;
  },

  addBatchImages: (files: File[]) => {
    const entries: ImageFileEntry[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type || "image/png",
      url: URL.createObjectURL(file),
      loadedAt: Date.now(),
    }));

    set((state) => {
      const combined = [...state.batchImages, ...entries];
      const newRecent = [...entries, ...state.recentImages].slice(0, 10);
      return {
        batchImages: combined,
        currentImage: state.currentImage ?? entries[0] ?? null,
        recentImages: newRecent,
      };
    });
  },

  removeBatchImage: (id: string) => {
    set((state) => ({
      batchImages: state.batchImages.filter((b) => b.id !== id),
    }));
  },

  clearBatch: () => {
    set({ batchImages: [] });
  },

  toggleFavorite: (toolId: string) => {
    set((state) => {
      const exists = state.favoriteToolIds.includes(toolId);
      const next = exists
        ? state.favoriteToolIds.filter((id) => id !== toolId)
        : [...state.favoriteToolIds, toolId];

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
        } catch {}
      }

      return { favoriteToolIds: next };
    });
  },

  isFavorite: (toolId: string) => {
    return get().favoriteToolIds.includes(toolId);
  },

  setTheme: (theme: "default" | "mauve") => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, theme);
        if (theme === "mauve") {
          document.documentElement.setAttribute("data-theme", "mauve");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      } catch {}
    }
    set({ theme });
  },

  setHapticsEnabled: (enabled: boolean) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_HAPTICS_KEY, String(enabled));
      } catch {}
    }
    set({ hapticsEnabled: enabled });
  },

  setEstimationMode: (mode: "accurate" | "fast") => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_EST_KEY, mode);
      } catch {}
    }
    set({ estimationMode: mode });
  },
}));

/** Light haptic feedback helper (respects haptics setting) */
export function triggerHaptic(duration = 10) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      const enabled = useMobileImageStore.getState().hapticsEnabled;
      if (enabled) {
        navigator.vibrate(duration);
      }
    } catch {}
  }
}
