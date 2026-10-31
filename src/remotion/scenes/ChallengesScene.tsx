import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Coins, Hammer, Users } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { IconBadge } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { fadeUp, pop } from "../anim";
import { palette, tint } from "../theme";
import data from "../../data/accomplishment.json";

const META = [
  { cue: "First,", icon: Users, color: palette.coral },
  { cue: "Second,", icon: Hammer, color: palette.amber },
  { cue: "Third,", icon: Coins, color: palette.sky },
];

export const ChallengesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardFrames = META.map((m, i) => useWordFrame(m.cue, 4 + i * 7));
  const responseAt = useWordFrame("Each", 26);

  return (
    <SceneShell accent={palette.coral}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 22 }}>
        <div style={{ ...fadeUp(frame, 4), fontSize: 68, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: palette.ink }}>Issues, gaps and challenges</div>
        <div style={{ ...fadeUp(frame, 12), fontSize: 28, color: palette.ink2, fontWeight: 600 }}>Three operational gaps, each with a priority response</div>

        <div style={{ display: "flex", gap: 22, flex: 1 }}>
          {data.challenges.map((c, i) => {
            const m = META[i];
            return (
              <div key={c.id} style={{ ...pop(frame, cardFrames[i], fps), transformOrigin: "center bottom", flex: 1, borderRadius: 28, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 16px 40px rgba(11,31,42,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "22px 26px", backgroundColor: m.color, color: palette.white, display: "flex", alignItems: "center", gap: 18 }}>
                  <IconBadge icon={m.icon} color={m.color} size={64} at={cardFrames[i] + 4} onColor />
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 3, opacity: 0.85 }}>GAP 0{i + 1}</div>
                    <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15 }}>{c.title}</div>
                  </div>
                </div>
                <div style={{ padding: "20px 26px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {c.concerns.map((item, k) => (
                    <div key={item} style={{ ...fadeUp(frame, cardFrames[i] + 10 + k * 5, 14, 10), display: "flex", gap: 12, fontSize: 22, lineHeight: 1.3, color: palette.ink2, fontWeight: 500 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: m.color, marginTop: 10, flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                  <div style={{ ...fadeUp(frame, Math.min(responseAt, cardFrames[i] + 70), 18, 16), marginTop: "auto", padding: "16px 18px", borderRadius: 16, backgroundColor: tint(m.color, 0.12), borderLeft: `6px solid ${m.color}` }}>
                    <div style={{ fontSize: 16, letterSpacing: 3, fontWeight: 800, color: m.color, marginBottom: 6 }}>PRIORITY RESPONSE</div>
                    <div style={{ fontSize: 21, lineHeight: 1.35, color: palette.ink, fontWeight: 600 }}>{c.response}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
