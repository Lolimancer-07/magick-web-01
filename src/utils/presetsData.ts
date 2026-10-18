export interface DimensionPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: "social" | "size";
  aspectRatio: string;
}

export const PLATFORM_PRESETS: DimensionPreset[] = [
  { id: "ig-post", name: "Instagram Square", width: 1080, height: 1080, category: "social", aspectRatio: "1:1" },
  { id: "ig-story", name: "Instagram Story / Reel", width: 1080, height: 1920, category: "social", aspectRatio: "9:16" },
  { id: "ig-portrait", name: "Instagram Portrait", width: 1080, height: 1350, category: "social", aspectRatio: "4:5" },
  { id: "x-post", name: "X / Twitter Post", width: 1200, height: 675, category: "social", aspectRatio: "16:9" },
  { id: "x-header", name: "X / Twitter Header", width: 1500, height: 500, category: "social", aspectRatio: "3:1" },
  { id: "yt-thumb", name: "YouTube Thumbnail", width: 1280, height: 720, category: "social", aspectRatio: "16:9" },
  { id: "li-banner", name: "LinkedIn Banner", width: 1584, height: 396, category: "social", aspectRatio: "4:1" },
  { id: "fb-post", name: "Facebook Post", width: 1200, height: 630, category: "social", aspectRatio: "1.91:1" },
  { id: "pin-standard", name: "Pinterest Pin", width: 1000, height: 1500, category: "social", aspectRatio: "2:3" },
];

export const SIZE_PRESETS: DimensionPreset[] = [
  { id: "4k-uhd", name: "4K UHD", width: 3840, height: 2160, category: "size", aspectRatio: "16:9" },
  { id: "fhd-1080p", name: "Full HD 1080p", width: 1920, height: 1080, category: "size", aspectRatio: "16:9" },
  { id: "hd-720p", name: "HD 720p", width: 1280, height: 720, category: "size", aspectRatio: "16:9" },
  { id: "sq-1080", name: "Standard Square", width: 1080, height: 1080, category: "size", aspectRatio: "1:1" },
  { id: "portrait-45", name: "Portrait 4:5", width: 1080, height: 1350, category: "size", aspectRatio: "4:5" },
  { id: "landscape-32", name: "Classic 3:2", width: 1500, height: 1000, category: "size", aspectRatio: "3:2" },
];

export interface SavedPresetState {
  id: string;
  name: string;
  resizeType: string;
  format: string;
  quality: number;
  scaleMode: string;
  colorSpace: string;
  backgroundColor: string;
  createdAt: number;
}

const STORAGE_SAVED_PRESETS_KEY = "magick_saved_presets_v1";

export function getSavedPresets(): SavedPresetState[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePreset(name: string, state: Omit<SavedPresetState, "id" | "name" | "createdAt">): SavedPresetState {
  const current = getSavedPresets();
  const newPreset: SavedPresetState = {
    ...state,
    id: `preset-${Date.now()}`,
    name,
    createdAt: Date.now(),
  };
  const updated = [newPreset, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_SAVED_PRESETS_KEY, JSON.stringify(updated));
  }
  return newPreset;
}

export function deleteSavedPreset(id: string): void {
  const current = getSavedPresets();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_SAVED_PRESETS_KEY, JSON.stringify(updated));
  }
}
