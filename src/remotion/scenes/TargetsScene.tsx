import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Database, House, ShieldCheck, Sun, UserPlus } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { IconBadge } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { fadeUp, pop, settle } from "../anim";
import { palette } from "../theme";
import data from "../../data/accomplishment.json";

const META = [
  { cue: "Fully", icon: House, color: palette.indigo },
  { cue: "Operationalize", icon: ShieldCheck, color: palette.rose },
  { cue: "Open", icon: Sun, color: palette.gold },
  { cue: "Fill", icon: UserPlus, color: palette.emerald },
  { cue: "build", icon: Database, color: palette.sky },
];

export const TargetsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardFrames = META.map((m, i) => useWordFrame(m.cue, 3 + i * 4));
  const lastAt = cardFrames[cardFrames.length - 1];

  return (
    <SceneShell accent={palette.indigo}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 20 }}>
        <div style={{ ...fadeUp(frame, 4), fontSize: 68, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: palette.ink }}>CY 2027 targets and priorities</div>
        <div style={{ ...fadeUp(frame, 12), fontSize: 28, color: palette.ink2, fontWeight: 600 }}>Operationalize priority facilities and build the office for the long term</div>

        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 84, height: 8, backgroundColor: "rgba(11,31,42,0.08)", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${Math.min(1, settle(frame, cardFrames[0], fps)) * 0 + ((Math.min(frame, lastAt) - cardFrames[0]) / Math.max(1, lastAt - cardFrames[0])) * 100}%`, background: `linear-gradient(90deg, ${META[0].color}, ${META[4].color})`, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", gap: 18, width: "100%" }}>
            {data.targets2027.map((t, i) => (
              <div key={t.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ display: "flex", justifyContent: "center", height: 170, alignItems: "flex-end", paddingBottom: 40 }}>
                  <IconBadge icon={META[i].icon} color={META[i].color} size={88} at={cardFrames[i]} />
                </div>
                <div style={{ ...pop(frame, cardFrames[i] + 4, fps), transformOrigin: "center top", padding: "22px 22px", borderRadius: 24, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 14px 34px rgba(11,31,42,0.08)", minHeight: 330, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 3, color: META[i].color }}>PRIORITY {i + 1}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, minHeight: 66, color: palette.ink }}>{t.title}</div>
                  <div style={{ fontSize: 22, color: META[i].color, fontWeight: 800 }}>{t.goal}</div>
                  <div style={{ fontSize: 20, color: palette.ink2, lineHeight: 1.35 }}>{t.kpi}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
                    {t.resources.slice(0, 3).map((r) => (
                      <span key={r} style={{ fontSize: 16, padding: "4px 10px", borderRadius: 999, backgroundColor: palette.paper2, color: palette.ink2, fontWeight: 600 }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
