import React, { useMemo } from "react";
import { createTikTokStyleCaptions, type TikTokPage } from "@remotion/captions";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useScene } from "../SceneContext";
import { palette } from "../theme";

const SWITCH_CAPTIONS_EVERY_MS = 1700;

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          marginBottom: 96,
          maxWidth: 1480,
          padding: "14px 30px",
          borderRadius: 18,
          backgroundColor: "rgba(11, 31, 42, 0.86)",
          color: palette.white,
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.3,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          opacity: interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" }),
          scale: String(interpolate(frame, [0, 6], [0.97, 1], { extrapolateRight: "clamp" })),
        }}
      >
        {page.tokens.map((token, i) => {
          const active = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          return (
            <span
              key={`${token.fromMs}-${i}`}
              style={{ color: active ? palette.gold : palette.white }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Word-synced subtitles for the current scene's narration. */
export const Captions: React.FC = () => {
  const { captions } = useScene();
  const { fps } = useVideoConfig();

  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS }),
    [captions],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const next = pages[index + 1];
        const lastToken = page.tokens[page.tokens.length - 1];
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : lastToken.toMs + 900;
        const durationInFrames = Math.round((endMs / 1000) * fps) - startFrame;
        if (durationInFrames <= 0) {
          return null;
        }
        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationInFrames} layout="none">
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
