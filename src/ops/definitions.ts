import type { ParamDef } from "@/engine/types";

export interface OpContext {
  Percentage: new (value: number) => unknown;
  NoiseType: Record<string, number>;
}

export type Kind = "operator" | "setting" | "sequence" | "stack" | "analysis";
export type Category =
  | "Geometry"
  | "Color"
  | "Filters"
  | "Edges & Structure"
  | "Effects"
  | "Draw & Text"
  | "Composite"
  | "Stack & Layers";

export interface OperationDef {
  id: string;
  name: string;
  category: Category;
  kind?: Kind;
  cliFlags?: string[];
  description?: string;
  icon?: string;
  engine?: "wasm" | "native";
  needs?: ("secondImage" | "mask" | "selection" | "points" | "multiImage")[];
  params: ParamDef[];
  advanced?: ParamDef[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply: (img: any, p: Record<string, any>, ctx?: OpContext) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toCli?: (p: Record<string, any>) => string[];
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
    kind: "operator",
    cliFlags: ["-blur"],
    description: "Smooth image with Gaussian kernel",
    engine: "wasm",
    params: [{ id: "sigma", label: "Amount", type: "number", min: 0, max: 30, step: 0.5, default: 2 }],
    apply: (img, p) => img.blur(0, p.sigma),
    toCli: (p) => ["-blur", `0x${p.sigma}`],
  },
  {
    id: "gaussianBlur",
    name: "Full Gaussian Blur",
    icon: "◎",
    category: "Filters",
    kind: "operator",
    cliFlags: ["-gaussian-blur"],
    description: "Gaussian blur with custom radius and sigma",
    engine: "wasm",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 0, max: 30, step: 1, default: 0 },
      { id: "sigma", label: "Sigma", type: "number", min: 0.1, max: 20, step: 0.5, default: 2 },
    ],
    apply: (img, p) => img.gaussianBlur(p.radius, p.sigma),
    toCli: (p) => ["-gaussian-blur", `${p.radius}x${p.sigma}`],
  },
  {
    id: "sharpen",
    name: "Sharpen",
    icon: "◈",
    category: "Filters",
    kind: "operator",
    cliFlags: ["-sharpen"],
    description: "Accentuate high-frequency edge details",
    engine: "wasm",
    params: [{ id: "sigma", label: "Amount", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 }],
    apply: (img, p) => img.sharpen(0, p.sigma),
    toCli: (p) => ["-sharpen", `0x${p.sigma}`],
  },
  {
    id: "adaptiveSharpen",
    name: "Adaptive Sharpen",
    icon: "◈",
    category: "Filters",
    kind: "operator",
    cliFlags: ["-adaptive-sharpen"],
    description: "Sharpen edges while preserving smooth areas",
    engine: "wasm",
    params: [{ id: "sigma", label: "Sigma", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 }],
    apply: (img, p) => img.adaptiveSharpen(0, p.sigma),
    toCli: (p) => ["-adaptive-sharpen", `0x${p.sigma}`],
  },
  {
    id: "adaptiveBlur",
    name: "Adaptive Blur",
    icon: "◎",
    category: "Filters",
    kind: "operator",
    cliFlags: ["-adaptive-blur"],
    description: "Adaptively blur interior while protecting edges",
    engine: "wasm",
    params: [{ id: "sigma", label: "Sigma", type: "number", min: 0, max: 20, step: 0.5, default: 2 }],
    apply: (img, p) => img.adaptiveBlur(0, p.sigma),
    toCli: (p) => ["-adaptive-blur", `0x${p.sigma}`],
  },
  {
    id: "motionBlur",
    name: "Motion Blur",
    icon: "≋",
    category: "Filters",
    kind: "operator",
    cliFlags: ["-motion-blur"],
    description: "Simulate directional linear motion blur",
    engine: "wasm",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 1, max: 30, step: 1, default: 10 },
      { id: "sigma", label: "Sigma", type: "number", min: 1, max: 20, step: 1, default: 5 },
      { id: "angle", label: "Angle", type: "number", min: -180, max: 180, step: 5, default: 0 },
    ],
    apply: (img, p) => img.motionBlur(p.radius, p.sigma, p.angle),
    toCli: (p) => ["-motion-blur", `${p.radius}x${p.sigma}+${p.angle}`],
  },
  {
    id: "noise",
    name: "Add Noise",
    icon: "⁖",
    category: "Filters",
    kind: "operator",
    cliFlags: ["-noise"],
    description: "Simulate sensor grain or photographic noise",
    engine: "wasm",
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
    toCli: (p) => ["+noise", String(p.noiseType)],
  },

  // ── Geometry ──
  {
    id: "resize",
    name: "Resize",
    icon: "⤡",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-resize"],
    description: "Scale image dimensions by percentage",
    engine: "wasm",
    params: [{ id: "percent", label: "Scale %", type: "number", min: 5, max: 200, default: 50 }],
    apply: (img, p) =>
      img.resize(
        Math.max(1, Math.round((img.width * p.percent) / 100)),
        Math.max(1, Math.round((img.height * p.percent) / 100))
      ),
    toCli: (p) => ["-resize", `${p.percent}%`],
  },
  {
    id: "adaptiveResize",
    name: "Adaptive Resize",
    icon: "⤢",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-adaptive-resize"],
    description: "Data-dependent adaptive resizing with edge preservation",
    engine: "wasm",
    params: [{ id: "percent", label: "Scale %", type: "number", min: 5, max: 200, default: 50 }],
    apply: (img, p) =>
      img.adaptiveResize(
        Math.max(1, Math.round((img.width * p.percent) / 100)),
        Math.max(1, Math.round((img.height * p.percent) / 100))
      ),
    toCli: (p) => ["-adaptive-resize", `${p.percent}%`],
  },
  {
    id: "rotate",
    name: "Rotate",
    icon: "↻",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-rotate"],
    description: "Rotate image by degrees",
    engine: "wasm",
    params: [{ id: "deg", label: "Degrees", type: "number", min: -180, max: 180, default: 90 }],
    apply: (img, p) => img.rotate(p.deg),
    toCli: (p) => ["-rotate", String(p.deg)],
  },
  {
    id: "flip",
    name: "Flip Vertical",
    icon: "⇅",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-flip"],
    description: "Reflect scanlines vertically top to bottom",
    engine: "wasm",
    params: [],
    apply: (img) => img.flip(),
    toCli: () => ["-flip"],
  },
  {
    id: "flop",
    name: "Flip Horizontal",
    icon: "⇄",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-flop"],
    description: "Reflect scanlines horizontally left to right",
    engine: "wasm",
    params: [],
    apply: (img) => img.flop(),
    toCli: () => ["-flop"],
  },
  {
    id: "roll",
    name: "Roll Canvas",
    icon: "⥁",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-roll"],
    description: "Roll canvas offsets horizontally and vertically",
    engine: "wasm",
    params: [
      { id: "x", label: "Offset X", type: "number", min: -200, max: 200, default: 20 },
      { id: "y", label: "Offset Y", type: "number", min: -200, max: 200, default: 20 },
    ],
    apply: (img, p) => img.roll(p.x, p.y),
    toCli: (p) => ["-roll", `+${p.x}+${p.y}`],
  },
  {
    id: "trim",
    name: "Trim Background",
    icon: "✂",
    category: "Geometry",
    kind: "operator",
    cliFlags: ["-trim"],
    description: "Trim uniform background border colors",
    engine: "wasm",
    params: [],
    apply: (img) => img.trim(),
    toCli: () => ["-trim"],
  },

  // ── Color ──
  {
    id: "grayscale",
    name: "Grayscale",
    icon: "◑",
    category: "Color",
    kind: "operator",
    cliFlags: ["-grayscale"],
    description: "Transform image to monochromatic grayscale",
    engine: "wasm",
    params: [],
    apply: (img) => img.grayscale(),
    toCli: () => ["-grayscale", "Rec709Luminance"],
  },
  {
    id: "negate",
    name: "Invert Colors",
    icon: "⊘",
    category: "Color",
    kind: "operator",
    cliFlags: ["-negate"],
    description: "Invert all channel color intensities",
    engine: "wasm",
    params: [],
    apply: (img) => img.negate(),
    toCli: () => ["-negate"],
  },
  {
    id: "modulate",
    name: "Brightness / Saturation / Hue",
    icon: "☀",
    category: "Color",
    kind: "operator",
    cliFlags: ["-modulate"],
    description: "Fine-tune brightness, saturation and hue",
    engine: "wasm",
    params: [
      { id: "brightness", label: "Brightness %", type: "number", min: 0, max: 200, step: 1, default: 100 },
      { id: "saturation", label: "Saturation %", type: "number", min: 0, max: 200, step: 1, default: 100 },
      { id: "hue", label: "Hue %", type: "number", min: 0, max: 200, step: 1, default: 100 },
    ],
    apply: (img, p, ctx) =>
      img.modulate(pct(ctx, p.brightness), pct(ctx, p.saturation), pct(ctx, p.hue)),
    toCli: (p) => ["-modulate", `${p.brightness},${p.saturation},${p.hue}`],
  },
  {
    id: "brightnessContrast",
    name: "Brightness & Contrast",
    icon: "◐",
    category: "Color",
    kind: "operator",
    cliFlags: ["-brightness-contrast"],
    description: "Linear adjustment of brightness and contrast levels",
    engine: "wasm",
    params: [
      { id: "brightness", label: "Brightness", type: "number", min: -100, max: 100, step: 1, default: 10 },
      { id: "contrast", label: "Contrast", type: "number", min: -100, max: 100, step: 1, default: 15 },
    ],
    apply: (img, p, ctx) =>
      img.brightnessContrast(pct(ctx, p.brightness), pct(ctx, p.contrast)),
    toCli: (p) => ["-brightness-contrast", `${p.brightness}x${p.contrast}`],
  },
  {
    id: "sigmoidalContrast",
    name: "Contrast (Sigmoidal)",
    icon: "◐",
    category: "Color",
    kind: "operator",
    cliFlags: ["-sigmoidal-contrast"],
    description: "Sigmoidal non-linear S-curve filmic contrast",
    engine: "wasm",
    params: [
      { id: "contrast", label: "Contrast", type: "number", min: 0, max: 10, step: 0.5, default: 3 },
    ],
    apply: (img, p) => img.sigmoidalContrast(p.contrast),
    toCli: (p) => ["-sigmoidal-contrast", `${p.contrast}x50%`],
  },
  {
    id: "gamma",
    name: "Gamma",
    icon: "γ",
    category: "Color",
    kind: "operator",
    cliFlags: ["-gamma"],
    description: "Apply power-law mid-tone gamma luminance correction",
    engine: "wasm",
    params: [{ id: "value", label: "Gamma", type: "number", min: 0.1, max: 5, step: 0.1, default: 1.0 }],
    apply: (img, p) => img.gammaCorrect(p.value),
    toCli: (p) => ["-gamma", String(p.value)],
  },
  {
    id: "autoGamma",
    name: "Auto Gamma",
    icon: "γ",
    category: "Color",
    kind: "operator",
    cliFlags: ["-auto-gamma"],
    description: "Automatically calculate and apply mid-tone gamma",
    engine: "wasm",
    params: [],
    apply: (img) => img.autoGamma(),
    toCli: () => ["-auto-gamma"],
  },
  {
    id: "autoLevel",
    name: "Auto Level",
    icon: "▤",
    category: "Color",
    kind: "operator",
    cliFlags: ["-auto-level"],
    description: "Automatically normalize full dynamic range",
    engine: "wasm",
    params: [],
    apply: (img) => img.autoLevel(),
    toCli: () => ["-auto-level"],
  },
  {
    id: "normalize",
    name: "Normalize",
    icon: "▤",
    category: "Color",
    kind: "operator",
    cliFlags: ["-normalize"],
    description: "Transform image to span full color histogram range",
    engine: "wasm",
    params: [],
    apply: (img) => img.normalize(),
    toCli: () => ["-normalize"],
  },
  {
    id: "solarize",
    name: "Solarize",
    icon: "☼",
    category: "Color",
    kind: "operator",
    cliFlags: ["-solarize"],
    description: "Invert pixels above threshold (Sabattier effect)",
    engine: "wasm",
    params: [
      { id: "threshold", label: "Threshold %", type: "number", min: 0, max: 100, step: 5, default: 50 },
    ],
    apply: (img, p, ctx) => img.solarize(pct(ctx, p.threshold)),
    toCli: (p) => ["-solarize", `${p.threshold}%`],
  },
  {
    id: "blueShift",
    name: "Blue Shift",
    icon: "☽",
    category: "Color",
    kind: "operator",
    cliFlags: ["-blue-shift"],
    description: "Mute warm colors and simulate moonlight night scene",
    engine: "wasm",
    params: [
      { id: "factor", label: "Factor", type: "number", min: 0.5, max: 3, step: 0.1, default: 1.5 },
    ],
    apply: (img, p) => img.blueShift(p.factor),
    toCli: (p) => ["-blue-shift", String(p.factor)],
  },
  {
    id: "level",
    name: "Levels",
    icon: "▤",
    category: "Color",
    kind: "operator",
    cliFlags: ["-level"],
    description: "Remap black point, white point and mid-tone gamma",
    engine: "wasm",
    params: [
      { id: "blackPoint", label: "Black Point %", type: "number", min: 0, max: 50, step: 1, default: 0 },
      { id: "whitePoint", label: "White Point %", type: "number", min: 50, max: 100, step: 1, default: 100 },
      { id: "gamma", label: "Gamma", type: "number", min: 0.1, max: 5, step: 0.1, default: 1.0 },
    ],
    apply: (img, p, ctx) =>
      img.level(pct(ctx, p.blackPoint), pct(ctx, p.whitePoint), p.gamma),
    toCli: (p) => ["-level", `${p.blackPoint}%,${p.whitePoint}%,${p.gamma}`],
  },

  // ── Edges & Structure ──
  {
    id: "cannyEdge",
    name: "Canny Edge Detector",
    icon: "⊞",
    category: "Edges & Structure",
    kind: "operator",
    cliFlags: ["-canny"],
    description: "Multi-stage optimal edge detection algorithm",
    engine: "wasm",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 0, max: 5, step: 0.5, default: 0 },
      { id: "sigma", label: "Sigma", type: "number", min: 0.5, max: 5, step: 0.5, default: 1 },
      { id: "lower", label: "Lower %", type: "number", min: 1, max: 50, step: 1, default: 10 },
      { id: "upper", label: "Upper %", type: "number", min: 10, max: 99, step: 1, default: 30 },
    ],
    apply: (img, p, ctx) =>
      img.cannyEdge(p.radius, p.sigma, pct(ctx, p.lower), pct(ctx, p.upper)),
    toCli: (p) => ["-canny", `${p.radius}x${p.sigma}+${p.lower}%+${p.upper}%`],
  },
  {
    id: "fft",
    name: "Fast Fourier Transform",
    icon: "∿",
    category: "Edges & Structure",
    kind: "operator",
    cliFlags: ["-fft"],
    description: "Fast Fourier Transform frequency magnitude (Desktop only)",
    engine: "native",
    params: [],
    apply: () => {},
    toCli: () => ["-fft"],
  },
  {
    id: "ift",
    name: "Inverse Fourier Transform",
    icon: "∿",
    category: "Edges & Structure",
    kind: "operator",
    cliFlags: ["-ift"],
    description: "Inverse Fast Fourier Transform reconstruction (Desktop only)",
    engine: "native",
    params: [],
    apply: () => {},
    toCli: () => ["-ift"],
  },

  // ── Effects ──
  {
    id: "sepia",
    name: "Sepia Tone",
    icon: "🟫",
    category: "Effects",
    kind: "operator",
    cliFlags: ["-sepia-tone"],
    description: "Warm vintage photograph sepia tint",
    engine: "wasm",
    params: [
      { id: "threshold", label: "Threshold %", type: "number", min: 0, max: 100, step: 5, default: 80 },
    ],
    apply: (img, p, ctx) => img.sepiaTone(pct(ctx, p.threshold)),
    toCli: (p) => ["-sepia-tone", `${p.threshold}%`],
  },
  {
    id: "oilPaint",
    name: "Oil Paint",
    icon: "🖌",
    category: "Effects",
    kind: "operator",
    cliFlags: ["-paint"],
    description: "Simulate painterly oil canvas brushstrokes",
    engine: "wasm",
    params: [{ id: "radius", label: "Radius", type: "number", min: 0.5, max: 10, step: 0.5, default: 3 }],
    apply: (img, p) => img.oilPaint(p.radius),
    toCli: (p) => ["-paint", String(p.radius)],
  },
  {
    id: "charcoal",
    name: "Charcoal",
    icon: "✏",
    category: "Effects",
    kind: "operator",
    cliFlags: ["-charcoal"],
    description: "Simulate fine graphite and charcoal drawing",
    engine: "wasm",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 },
      { id: "sigma", label: "Sigma", type: "number", min: 0, max: 10, step: 0.5, default: 0.5 },
    ],
    apply: (img, p) => img.charcoal(p.radius, p.sigma),
    toCli: (p) => ["-charcoal", `${p.radius}x${p.sigma}`],
  },
  {
    id: "vignette",
    name: "Vignette",
    icon: "◉",
    category: "Effects",
    kind: "operator",
    cliFlags: ["-vignette"],
    description: "Soften outer corners with radial camera vignette",
    engine: "wasm",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 0, max: 50, step: 5, default: 0 },
      { id: "sigma", label: "Sigma", type: "number", min: 0, max: 50, step: 5, default: 15 },
    ],
    apply: (img, p) => img.vignette(p.radius, p.sigma, 0, 0),
    toCli: (p) => ["-vignette", `${p.radius}x${p.sigma}`],
  },
  {
    id: "wave",
    name: "Wave Distortion",
    icon: "〰",
    category: "Effects",
    kind: "operator",
    cliFlags: ["-wave"],
    description: "Alter scanlines with periodic sine wave displacement",
    engine: "wasm",
    params: [
      { id: "amplitude", label: "Amplitude", type: "number", min: 1, max: 50, step: 1, default: 10 },
      { id: "wavelength", label: "Wavelength", type: "number", min: 10, max: 150, step: 5, default: 50 },
    ],
    apply: (img, p) => img.wave(p.amplitude, p.wavelength),
    toCli: (p) => ["-wave", `${p.amplitude}x${p.wavelength}`],
  },
];

export const OP_MAP = Object.fromEntries(OPERATIONS.map((o) => [o.id, o]));
