import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { BarCompare, BigNumber, DeltaBadge, IconBadge } from "../components/Infographics";
import { PROGRAM_META } from "../programMeta";
import { useNarrationFrame, useWordFrame } from "../SceneContext";
import { fadeLeft, fadeUp, fmt, settle } from "../anim";
import { palette, shade } from "../theme";
import data from "../../data/accomplishment.json";

type Program = (typeof data.programs)[number];

/** One scene per program: colored identity panel on the left, infographic on the right. */
export const ProgramScene: React.FC<{ programId: string }> = ({ programId }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const program = data.programs.find((p) => p.id === programId) as Program;
  const meta = PROGRAM_META[programId];
  const countAt = useWordFrame(fmt(program.y2026), 999);
  const fallbackCountAt = useNarrationFrame(0.5);
  const numberAt = countAt > 900 ? fallbackCountAt : countAt;
  const impactAt = useNarrationFrame(0.72);
  const whatAt = useNarrationFrame(0.1);
  const panel = settle(frame, 0, fps);

  return (
    <SceneShell
      accent={meta.color}
      leftOnColor
      backdrop={
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: -120,
              top: -100,
              width: 960,
              height: 1300,
              background: `linear-gradient(160deg, ${meta.color} 0%, ${shade(meta.color, 0.3)} 100%)`,
              clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
              translate: `${interpolate(panel, [0, 1], [-1000, 0])}px 0px`,
              boxShadow: "30px 0 80px rgba(11,31,42,0.18)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 560,
              top: 560,
              width: 700,
              height: 700,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              translate: `${interpolate(frame, [0, durationInFrames], [0, 60])}px 0px`,
            }}
          />
        </AbsoluteFill>
      }
    >
      <div style={{ display: "flex", gap: 90, height: "100%" }}>
        {/* Left: identity */}
        <div style={{ width: 640, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, color: palette.white }}>
          <IconBadge icon={meta.icon} color={meta.color} size={128} at={6} onColor />
          <div style={{ ...fadeLeft(frame, 10), fontSize: 100, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>{program.name}</div>
          <div style={{ ...fadeLeft(frame, 16), fontSize: 32, fontWeight: 700, lineHeight: 1.25, opacity: 0.95 }}>{program.full}</div>
          <div
            style={{
              ...fadeLeft(frame, 22),
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.7)",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            {program.hook}
          </div>
          <div style={{ ...fadeUp(frame, whatAt), fontSize: 27, lineHeight: 1.45, opacity: 0.92, fontWeight: 500 }}>{program.what}</div>
        </div>

        {/* Right: the numbers */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
          <div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 800, color: palette.ink3, ...fadeUp(frame, numberAt - 10) }}>
            {program.unit.toUpperCase()} SERVED · 2026
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 30, flexWrap: "wrap" }}>
            <BigNumber value={program.y2026} label="" at={numberAt} color={meta.color} size={190} />
            <div style={{ paddingBottom: 30 }}>
              <DeltaBadge change={program.change} at={numberAt + 30} size={32} />
            </div>
          </div>
          <div style={{ padding: "26px 30px", borderRadius: 26, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 16px 40px rgba(11,31,42,0.08)", ...fadeUp(frame, numberAt - 6) }}>
            <BarCompare
              rows={[
                { label: "2025", value: program.y2025, color: palette.amber },
                { label: "2026", value: program.y2026, color: meta.color },
              ]}
              at={numberAt - 2}
              height={34}
            />
          </div>
          <div style={{ ...fadeLeft(frame, impactAt), borderLeft: `8px solid ${meta.color}`, paddingLeft: 24, fontSize: 30, lineHeight: 1.4, fontWeight: 700, color: palette.ink }}>
            {program.impact}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
