import type { LucideIcon } from "lucide-react";
import {
  Baby,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  Scale,
  Shield,
  ShieldAlert,
  Sun,
} from "lucide-react";
import { palette } from "./theme";

/** Accent color and icon for each program, shared by every scene that mentions it. */
export const PROGRAM_META: Record<string, { color: string; icon: LucideIcon }> = {
  pave: { color: palette.rose, icon: ShieldAlert },
  hero: { color: palette.violet, icon: HeartHandshake },
  "golden-life": { color: palette.gold, icon: Sun },
  aics: { color: palette.orange, icon: LifeBuoy },
  rhap: { color: palette.sky, icon: HeartPulse },
  "youth-sdec": { color: palette.emerald, icon: GraduationCap },
  cdc: { color: palette.teal, icon: Baby },
  cnsp: { color: palette.pink, icon: Shield },
  cicl: { color: palette.indigo, icon: Scale },
};
