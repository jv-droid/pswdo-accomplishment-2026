import type React from "react";
import { Easing, interpolate, spring } from "remotion";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 progress starting at frame `at` over `dur` frames (smooth, no overshoot). */
export const progress = (frame: number, at: number, dur = 24): number =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease });

/** Spring 0 → 1 with a lively overshoot, for icons, numbers and badges. */
export const bounce = (frame: number, at: number, fps: number, damping = 12, stiffness = 120): number =>
  spring({ frame: frame - at, fps, config: { damping, stiffness, mass: 0.9 } });

/** Spring 0 → 1 without overshoot, for bars and panels. */
export const settle = (frame: number, at: number, fps: number): number =>
  spring({ frame: frame - at, fps, config: { damping: 200, stiffness: 140 } });

/** Fade + slide-up entrance. */
export const fadeUp = (frame: number, at: number, dur = 22, dist = 36): React.CSSProperties => ({
  opacity: interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease }),
  translate: `0px ${interpolate(frame, [at, at + dur], [dist, 0], { ...clamp, easing: ease })}px`,
});

/** Fade + slide-in from the left. */
export const fadeLeft = (frame: number, at: number, dur = 22, dist = 48): React.CSSProperties => ({
  opacity: interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease }),
  translate: `${interpolate(frame, [at, at + dur], [-dist, 0], { ...clamp, easing: ease })}px 0px`,
});

/** Fade + slide-in from the right. */
export const fadeRight = (frame: number, at: number, dur = 22, dist = 48): React.CSSProperties => ({
  opacity: interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease }),
  translate: `${interpolate(frame, [at, at + dur], [dist, 0], { ...clamp, easing: ease })}px 0px`,
});

/** Springy pop-in (scale with overshoot + fade). */
export const pop = (frame: number, at: number, fps: number): React.CSSProperties => ({
  opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
  scale: String(Math.max(0, bounce(frame, at, fps))),
});

/** Integer count-up, eased so it settles smoothly on the final value. */
export const countUp = (frame: number, at: number, dur: number, to: number): number =>
  Math.round(
    interpolate(frame, [at, at + dur], [0, to], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );

export const fmt = (n: number): string => n.toLocaleString("en-US");
