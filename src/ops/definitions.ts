import type { ParamDef } from "@/engine/types";

// Helpers injected at runtime from the worker context
export interface OpContext {
  Percentage: new (value: number) => unknown;
  NoiseType: Record<string, number>;
}

export interface OperationDef {
  id: string;
  name: string;
  icon: string;
  category: "Geometry" | "Color" | "Filters" | "Effects";
  params: ParamDef[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply: (img: any, p: Record<string, any>, ctx?: OpContext) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pct = (ctx: OpContext | undefined, val: number): any =>
  ctx ? new ctx.Percentage(val) : val;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noiseType = (ctx: OpContext | undefined, name: string): any => {
  if (!ctx) return 2; // Gaussian fallback
  const map: Record<string, string> = {
    Gaussian: "Gaussian",
    Uniform: "Uniform",
    Impulse: "Impulse",
    Laplacian: "Laplacian",
    Poisson: "Poisson",
    Random: "Random",
    MultiplicativeGaussian: "MultiplicativeGaussian",
  };
  return ctx.NoiseType[map[name] ?? "Gaussian"] ?? 2;
};

export const OPERATIONS: OperationDef[] = [
  // ── Filters ──
  {
    id: "blur",
    name: "Gaussian Blur",
    icon: "◎",
    category: "Filters",
    params: [{ id: "sigma", label: "Amount", type: "number", min: 0, max: 30, step: 0.5, default: 2 }],
    apply: (img, p) => img.blur(0, p.sigma),
  },
  {
    id: "sharpen",
    name: "Sharpen",
    icon: "◈",
    category: "Filters",
    params: [{ id: "sigma", label: "Amount", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 }],
    apply: (img, p) => img.sharpen(0, p.sigma),
  },
  {
    id: "motionBlur",
    name: "Motion Blur",
    icon: "≋",
    category: "Filters",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 1, max: 30, step: 1, default: 10 },
      { id: "sigma", label: "Sigma", type: "number", min: 1, max: 20, step: 1, default: 5 },
      { id: "angle", label: "Angle", type: "number", min: -180, max: 180, step: 5, default: 0 },
    ],
    apply: (img, p) => img.motionBlur(p.radius, p.sigma, p.angle),
  },
  {
    id: "noise",
    name: "Add Noise",
    icon: "⁖",
    category: "Filters",
    params: [
      {
        id: "noiseType",
        label: "Type",
        type: "select",
        options: ["Gaussian", "Uniform", "Impulse", "Laplacian", "Poisson", "Random", "MultiplicativeGaussian"],
        default: "Gaussian",
      },
    ],
    apply: (img, p, ctx) => img.addNoise(noiseType(ctx, p.noiseType as string)),
  },

  // ── Geometry ──
  {
    id: "resize",
    name: "Resize",
    icon: "⤡",
    category: "Geometry",
    params: [{ id: "percent", label: "Scale %", type: "number", min: 5, max: 200, default: 50 }],
    apply: (img, p) =>
      img.resize(
        Math.max(1, Math.round(img.width * p.percent / 100)),
        Math.max(1, Math.round(img.height * p.percent / 100))
      ),
  },
  {
    id: "rotate",
    name: "Rotate",
    icon: "↻",
    category: "Geometry",
    params: [{ id: "deg", label: "Degrees", type: "number", min: -180, max: 180, default: 90 }],
    apply: (img, p) => img.rotate(p.deg),
  },
  {
    id: "flip",
    name: "Flip Vertical",
    icon: "⇅",
    category: "Geometry",
    params: [],
    apply: (img) => img.flip(),
  },
  {
    id: "flop",
    name: "Flip Horizontal",
    icon: "⇄",
    category: "Geometry",
    params: [],
    apply: (img) => img.flop(),
  },

  // ── Color ──
  {
    id: "grayscale",
    name: "Grayscale",
    icon: "◑",
    category: "Color",
    params: [],
    apply: (img) => img.grayscale(),
  },
  {
    id: "negate",
    name: "Invert Colors",
    icon: "⊘",
    category: "Color",
    params: [],
    apply: (img) => img.negate(),
  },
  {
    id: "modulate",
    name: "Brightness / Saturation / Hue",
    icon: "☀",
    category: "Color",
    params: [
      { id: "brightness", label: "Brightness %", type: "number", min: 0, max: 200, step: 1, default: 100 },
      { id: "saturation", label: "Saturation %", type: "number", min: 0, max: 200, step: 1, default: 100 },
      { id: "hue", label: "Hue %", type: "number", min: 0, max: 200, step: 1, default: 100 },
    ],
    apply: (img, p, ctx) =>
      img.modulate(pct(ctx, p.brightness), pct(ctx, p.saturation), pct(ctx, p.hue)),
  },
  {
    id: "sigmoidalContrast",
    name: "Contrast (Sigmoidal)",
    icon: "◐",
    category: "Color",
    params: [
      { id: "contrast", label: "Contrast", type: "number", min: 0, max: 10, step: 0.5, default: 3 },
    ],
    apply: (img, p) => img.sigmoidalContrast(p.contrast),
  },
  {
    id: "gamma",
    name: "Gamma",
    icon: "γ",
    category: "Color",
    params: [{ id: "value", label: "Gamma", type: "number", min: 0.1, max: 5, step: 0.1, default: 1.0 }],
    apply: (img, p) => {
      img.gammaCorrect(p.value);
    },
  },
  {
    id: "level",
    name: "Levels",
    icon: "▤",
    category: "Color",
    params: [
      { id: "blackPoint", label: "Black Point %", type: "number", min: 0, max: 50, step: 1, default: 0 },
      { id: "whitePoint", label: "White Point %", type: "number", min: 50, max: 100, step: 1, default: 100 },
      { id: "gamma", label: "Gamma", type: "number", min: 0.1, max: 5, step: 0.1, default: 1.0 },
    ],
    apply: (img, p, ctx) =>
      img.level(pct(ctx, p.blackPoint), pct(ctx, p.whitePoint), p.gamma),
  },

  // ── Effects ──
  {
    id: "sepia",
    name: "Sepia Tone",
    icon: "🟫",
    category: "Effects",
    params: [
      { id: "threshold", label: "Threshold %", type: "number", min: 0, max: 100, step: 5, default: 80 },
    ],
    apply: (img, p, ctx) => img.sepiaTone(pct(ctx, p.threshold)),
  },
  {
    id: "oilPaint",
    name: "Oil Paint",
    icon: "🖌",
    category: "Effects",
    params: [{ id: "radius", label: "Radius", type: "number", min: 0.5, max: 10, step: 0.5, default: 3 }],
    apply: (img, p) => img.oilPaint(p.radius),
  },
  {
    id: "charcoal",
    name: "Charcoal",
    icon: "✏",
    category: "Effects",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 },
      { id: "sigma", label: "Sigma", type: "number", min: 0, max: 10, step: 0.5, default: 0.5 },
    ],
    apply: (img, p) => img.charcoal(p.radius, p.sigma),
  },
];

export const OP_MAP = Object.fromEntries(OPERATIONS.map((o) => [o.id, o]));
