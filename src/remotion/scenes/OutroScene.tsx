import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { useWordFrame } from "../SceneContext";
import { bounce, fadeUp, pop } from "../anim";
import { palette } from "../theme";
import data from "../../data/accomplishment.json";

const CONFETTI = [palette.teal, palette.coral, palette.gold, palette.violet, palette.sky, palette.emerald, palette.pink, palette.orange];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const provinceAt = useWordFrame("Province", 3);
  const taglineAt = useWordFrame("Serbisyong", 5);
  const thanksAt = useWordFrame("Thank", 7);

  return (
    <SceneShell accent={palette.teal} hideChrome>
      {/* Colour dots bursting outward */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 420 + (i % 3) * 120;
        const s = bounce(frame, 4 + (i % 6) * 2, fps, 14, 90);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 18 + (i % 4) * 8,
              height: 18 + (i % 4) * 8,
              borderRadius: "50%",
              backgroundColor: CONFETTI[i % CONFETTI.length],
              opacity: 0.85 * Math.min(1, s),
              translate: `${Math.cos(angle) * dist * s}px ${Math.sin(angle) * dist * s * 0.6}px`,
            }}
          />
        );
      })}
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 22,
          opacity: interpolate(frame, [durationInFrames - 25, durationInFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Img name="PSWDO seal" src={staticFile("images/pswdo-logo.png")} style={{ ...pop(frame, 2, fps), width: 220, height: 220 }} />
        <div style={{ ...fadeUp(frame, 12), fontSize: 64, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1200, color: palette.ink }}>{data.office.name}</div>
        <div style={{ ...fadeUp(frame, provinceAt), fontSize: 30, color: palette.ink2, fontWeight: 800, letterSpacing: 5 }}>{data.office.province.toUpperCase()}</div>
        <div style={{ ...fadeUp(frame, taglineAt), fontSize: 72, fontWeight: 800, color: palette.teal, fontStyle: "italic", marginTop: 14 }}>{data.office.tagline}</div>
        <div style={{ ...fadeUp(frame, thanksAt), fontSize: 28, color: palette.ink3, fontWeight: 700 }}>
          Thank you · {data.office.event} · {data.office.period}
        </div>
      </div>
    </SceneShell>
  );
};
