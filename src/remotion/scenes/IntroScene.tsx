import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { BigNumber } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { fadeLeft, fadeUp, pop, settle } from "../anim";
import { palette } from "../theme";
import data from "../../data/accomplishment.json";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const numberAt = useWordFrame("22,513", 8);
  const behindAt = useWordFrame("Behind", 14);
  const panel = settle(frame, 0, fps);

  return (
    <SceneShell
      accent={palette.teal}
      backdrop={
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {/* Full-colour photo collage, slow push-in */}
          <Img
            name="Hero collage"
            src={staticFile("images/hero-collage.jpg")}
            style={{
              position: "absolute",
              left: 700,
              top: 0,
              width: 1220,
              height: 1080,
              objectFit: "cover",
              opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
              scale: String(interpolate(frame, [0, durationInFrames], [1.04, 1.16])),
            }}
          />
          {/* Angled paper panel sliding in from the left */}
          <div
            style={{
              position: "absolute",
              left: -200,
              top: -100,
              width: 1240,
              height: 1300,
              backgroundColor: "rgba(247,249,251,0.96)",
              clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)",
              translate: `${interpolate(panel, [0, 1], [-1300, 0])}px 0px`,
              boxShadow: "30px 0 80px rgba(11,31,42,0.25)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 1010,
              top: -100,
              width: 60,
              height: 1300,
              backgroundColor: palette.gold,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              rotate: "10.2deg",
              translate: `${interpolate(panel, [0, 1], [-1300, 0])}px 0px`,
            }}
          />
        </AbsoluteFill>
      }
    >
      <div style={{ position: "relative", height: "100%", width: 860, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        <div style={{ ...fadeLeft(frame, 8), display: "flex", alignItems: "center", gap: 16 }}>
          <Img name="PSWDO seal" src={staticFile("images/pswdo-logo-512.png")} style={{ ...pop(frame, 4, fps), width: 110, height: 110 }} />
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: palette.ink3, lineHeight: 1.3 }}>
            {data.office.government.toUpperCase()}
            <br />
            {data.office.event.toUpperCase()}
          </div>
        </div>

        <div style={{ ...fadeUp(frame, 14), fontSize: 88, fontWeight: 800, lineHeight: 1.0, letterSpacing: -3, color: palette.ink }}>
          Provincial Social Welfare &amp; Development Office
        </div>

        <div style={{ ...fadeUp(frame, 26), fontSize: 32, color: palette.ink2, fontWeight: 700 }}>
          Accomplishment Report · {data.office.period}
        </div>

        <div style={{ marginTop: 10 }}>
          <BigNumber value={data.headline.clients} label="clients served across Romblon" at={numberAt} color={palette.teal} size={170} />
        </div>

        <div style={{ ...fadeUp(frame, behindAt), fontSize: 40, fontStyle: "italic", color: palette.coral, fontWeight: 800 }}>
          Behind every number is a family.
        </div>
      </div>
    </SceneShell>
  );
};
