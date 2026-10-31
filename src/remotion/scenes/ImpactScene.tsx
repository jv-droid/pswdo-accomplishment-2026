import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Baby, Heart, HeartPulse, LifeBuoy, ShieldCheck, Sun } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { IconBadge, Pictogram } from "../components/Infographics";
import { RomblonMap } from "../components/RomblonMap";
import { useWordFrame } from "../SceneContext";
import { fadeLeft, fadeUp, pop } from "../anim";
import { palette } from "../theme";
import data from "../../data/accomplishment.json";

const META = [
  { cue: "survivor", icon: ShieldCheck, color: palette.rose },
  { cue: "patient", icon: HeartPulse, color: palette.sky },
  { cue: "senior", icon: Sun, color: palette.gold },
  { cue: "solo", icon: LifeBuoy, color: palette.orange },
  { cue: "child", icon: Baby, color: palette.pink },
  { cue: "That", icon: Heart, color: palette.teal },
];

export const ImpactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapAt = useWordFrame("Across", 2);
  const ratioAt = useWordFrame("one", 6);
  const pointFrames = META.map((m, i) => useWordFrame(m.cue, 12 + i * 2.5));

  return (
    <SceneShell accent={palette.teal}>
      <div style={{ display: "flex", gap: 40, height: "100%", alignItems: "center" }}>
        {/* Map */}
        <div style={{ width: 560, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <RomblonMap at={mapAt} width={560} accent={palette.teal} townColor={palette.coral} />
        </div>

        {/* Headline + ratio */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ ...fadeUp(frame, 4), fontSize: 64, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: palette.ink }}>What it means for Romblon</div>
          <div style={{ ...fadeUp(frame, mapAt), fontSize: 26, color: palette.ink2, fontWeight: 700 }}>
            {data.romblon.municipalities} municipalities · {data.romblon.islands} islands · one safety net
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 6 }}>
            <div style={{ ...pop(frame, ratioAt, fps), transformOrigin: "left center", fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: -7, color: palette.coral }}>
              {data.romblon.reachRatio}
            </div>
            <div style={{ ...fadeUp(frame, ratioAt + 6) }}>
              <Pictogram total={Number(data.romblon.reachRatio.split(" ").pop())} highlight={1} columns={7} color={palette.coral} size={32} gap={6} at={ratioAt + 8} stagger={2} />
            </div>
          </div>
          <div style={{ ...fadeUp(frame, ratioAt + 12), fontSize: 27, lineHeight: 1.35, color: palette.ink2, fontWeight: 600, maxWidth: 620 }}>
            Romblomanons reached by a PSWDO service this year, based on the {data.romblon.populationNote}.
          </div>
        </div>

        {/* Impact points */}
        <div style={{ width: 560, display: "flex", flexDirection: "column", gap: 8 }}>
          {data.romblon.impactPoints.map((pt, i) => (
            <div key={pt.title} style={{ ...fadeLeft(frame, pointFrames[i], 20, 40), display: "flex", gap: 14, alignItems: "center", padding: "9px 14px", borderRadius: 16, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 10px 26px rgba(11,31,42,0.07)" }}>
              <IconBadge icon={META[i].icon} color={META[i].color} size={46} at={pointFrames[i] + 2} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: palette.ink }}>{pt.title}</div>
                <div style={{ fontSize: 17, color: palette.ink2, lineHeight: 1.25, marginTop: 1 }}>{pt.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
