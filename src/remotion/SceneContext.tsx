import { createContext, useContext } from "react";
import type { Caption } from "@remotion/captions";
import { useVideoConfig } from "remotion";

export type SceneData = {
  id: string;
  title: string;
  chapter: string;
  audio: string;
  durationMs: number;
  frames: number;
  startFrame: number;
  captions: Caption[];
};

const Ctx = createContext<SceneData | null>(null);
export const SceneProvider = Ctx.Provider;

export const useScene = (): SceneData => {
  const scene = useContext(Ctx);
  if (!scene) {
    throw new Error("useScene must be used inside a SceneProvider");
  }
  return scene;
};

const norm = (s: string) => s.toLowerCase().replace(/[^\w']/g, "");

/**
 * Frame (local to the scene) at which a spoken word begins, so visuals land exactly
 * when the narrator says them. Falls back to `fallbackSec` if the word is not found.
 */
export const useWordFrame = (word: string, fallbackSec: number, nth = 0): number => {
  const { captions } = useScene();
  const { fps } = useVideoConfig();
  const target = norm(word);
  let seen = 0;
  for (const c of captions) {
    if (norm(c.text) === target) {
      if (seen === nth) {
        return Math.round((c.startMs / 1000) * fps);
      }
      seen++;
    }
  }
  return Math.round(fallbackSec * fps);
};

/** Frame at a fraction of the narration (0..1), useful for beats not tied to a word. */
export const useNarrationFrame = (fraction: number): number => {
  const { durationMs } = useScene();
  const { fps } = useVideoConfig();
  return Math.round(((500 + durationMs * fraction) / 1000) * fps);
};
