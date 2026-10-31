import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});

export const font = fontFamily;

/**
 * Bright, energetic palette. Dark ink on a paper background with vivid accent blocks.
 * Teal/amber comparison pair is CVD-validated (dataviz validator, both modes).
 */
export const palette = {
  paper: "#F7F9FB",
  paper2: "#EEF3F6",
  ink: "#0B1F2A",
  ink2: "#3D515C",
  ink3: "#7A8B94",
  line: "rgba(11,31,42,0.1)",
  white: "#FFFFFF",
  teal: "#0D9488",
  tealDeep: "#0F766E",
  tealLight: "#CCFBF1",
  emerald: "#10B981",
  gold: "#F5B301",
  amber: "#D97706",
  coral: "#FF5A5F",
  rose: "#E11D48",
  sky: "#0EA5E9",
  violet: "#7C3AED",
  indigo: "#4F46E5",
  orange: "#F97316",
  pink: "#DB2777",
  navy: "#0E2531",
};

export type Accent = {
  color: string;
  soft: string;
  dark: string;
};

/** Convert a hex color into a soft tint and a darker shade for panels. */
const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};
export const tint = (hex: string, alpha: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
};
export const shade = (hex: string, amount: number) => {
  const [r, g, b] = hexToRgb(hex).map((c) => Math.round(c * (1 - amount)));
  return `rgb(${r},${g},${b})`;
};
export const accent = (color: string): Accent => ({ color, soft: tint(color, 0.14), dark: shade(color, 0.28) });
