import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useScene } from "../SceneContext";
import { palette, tint } from "../theme";
import voiceover from "../generated/voiceover.json";

/**
 * Common frame for every scene: bright paper background with drifting color blobs,
 * header pills, global progress line and footer. Children render inside the safe content
 * area, which leaves room at the bottom for the subtitles.
 */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  accent?: string;
  variant?: "paper" | "color";
  hideChrome?: boolean;
  backdrop?: React.ReactNode;
  /** The left side sits on a colored panel: render the left chrome in white. */
  leftOnColor?: boolean;
}> = ({ children, accent = palette.teal, variant = "paper", hideChrome, backdrop, leftOnColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scene = useScene();
  const globalProgress = Math.min(1, (scene.startFrame + frame) / voiceover.totalFrames);
  const onColor = variant === "color";
  const ink = onColor ? palette.white : palette.ink;
  const ink3 = onColor ? "rgba(255,255,255,0.75)" : palette.ink3;

  return (
    <AbsoluteFill style={{ backgroundColor: onColor ? accent : palette.paper, color: ink, overflow: "hidden" }}>
      {/* Drifting color blobs */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          left: -420,
          top: -560,
          background: `radial-gradient(circle, ${onColor ? "rgba(255,255,255,0.22)" : tint(accent, 0.22)} 0%, rgba(255,255,255,0) 62%)`,
          translate: `${interpolate(frame, [0, durationInFrames], [0, 90])}px ${interpolate(frame, [0, durationInFrames], [0, 50])}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          right: -420,
          bottom: -520,
          background: `radial-gradient(circle, ${onColor ? "rgba(0,0,0,0.12)" : tint(palette.gold, 0.2)} 0%, rgba(255,255,255,0) 62%)`,
          translate: `${interpolate(frame, [0, durationInFrames], [0, -70])}px 0px`,
        }}
      />
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${onColor ? "rgba(255,255,255,0.18)" : "rgba(11,31,42,0.09)"} 1.6px, transparent 1.6px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {backdrop}

      {!hideChrome && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, backgroundColor: onColor ? "rgba(255,255,255,0.25)" : tint(accent, 0.15) }}>
            <div style={{ height: "100%", width: `${globalProgress * 100}%`, backgroundColor: onColor ? palette.white : accent }} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 42,
              left: 96,
              padding: "10px 20px",
              borderRadius: 999,
              backgroundColor: onColor || leftOnColor ? "rgba(255,255,255,0.22)" : accent,
              color: palette.white,
              fontSize: 21,
              fontWeight: 800,
              letterSpacing: 2,
              opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            PSWDO · JANUARY – OCTOBER 2026
          </div>
          <div
            style={{
              position: "absolute",
              top: 42,
              right: 96,
              padding: "10px 20px",
              borderRadius: 999,
              border: `2px solid ${onColor ? "rgba(255,255,255,0.5)" : tint(accent, 0.5)}`,
              backgroundColor: onColor ? "transparent" : "rgba(247,249,251,0.9)",
              fontSize: 21,
              fontWeight: 800,
              color: onColor ? palette.white : accent,
              opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            {scene.chapter}
          </div>
          <div style={{ position: "absolute", bottom: 34, left: 96, fontSize: 20, fontWeight: 800, letterSpacing: 3, color: onColor || leftOnColor ? "rgba(255,255,255,0.85)" : accent }}>
            SERBISYONG MAY PUSO
          </div>
          <div style={{ position: "absolute", bottom: 34, right: 96, fontSize: 20, fontWeight: 700, color: ink3, letterSpacing: 1 }}>PROVINCE OF ROMBLON</div>
        </>
      )}

      <div style={{ position: "absolute", left: 96, right: 96, top: 120, bottom: 250 }}>{children}</div>
    </AbsoluteFill>
  );
};
