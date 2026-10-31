import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BadgeCheck, ClipboardCheck, Handshake, House, Send } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { Donut, IconBadge } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { countUp, fadeUp, pop, settle } from "../anim";
import { palette } from "../theme";
import data from "../../data/accomplishment.json";

export const SystemsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cd = data.childDevelopment;
  const assessedAt = useWordFrame("76", 4);
  const endorsedAt = useWordFrame("endorsed,", 6);
  const accreditedAt = useWordFrame("78", 7.5);
  const totalAt = useWordFrame("209", 10);
  const centersAt = useWordFrame("Bahay", 15);
  const partnersAt = useWordFrame("Ruel", 20);
  const ratio = cd.accreditedTotal / cd.centersTotal;

  const steps = [
    { label: "Assessed", value: cd.assessed, at: assessedAt, icon: ClipboardCheck, color: palette.sky },
    { label: "Endorsed", value: cd.endorsed, at: endorsedAt, icon: Send, color: palette.violet },
    { label: "Accredited 2026", value: cd.accredited2026, at: accreditedAt, icon: BadgeCheck, color: palette.emerald },
  ];

  return (
    <SceneShell accent={palette.emerald}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 22 }}>
        <div style={{ ...fadeUp(frame, 4), fontSize: 68, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: palette.ink }}>Strengthening the system itself</div>
        <div style={{ ...fadeUp(frame, 12), fontSize: 28, color: palette.ink2, fontWeight: 600 }}>Child Development Centers and workers · accreditation drive 2026</div>

        <div style={{ display: "flex", gap: 40, alignItems: "center", flex: 1 }}>
          {/* Flow: assessed -> endorsed -> accredited */}
          <div style={{ flex: 1.4, display: "flex", alignItems: "center", gap: 0 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div style={{ ...pop(frame, s.at, fps), flex: 1, padding: "26px 22px", borderRadius: 26, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 14px 34px rgba(11,31,42,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <IconBadge icon={s.icon} color={s.color} size={84} at={s.at + 2} />
                  <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color: s.color }}>{countUp(frame, s.at, 35, s.value)}</div>
                  <div style={{ fontSize: 23, fontWeight: 700, color: palette.ink2, textAlign: "center" }}>{s.label}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 70, height: 10, position: "relative", flexShrink: 0 }}>
                    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11,31,42,0.08)", borderRadius: 5 }} />
                    <div style={{ height: "100%", width: `${Math.min(1, settle(frame, steps[i + 1].at - 12, fps)) * 100}%`, backgroundColor: steps[i + 1].color, borderRadius: 5 }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Province-wide donut */}
          <div style={{ ...fadeUp(frame, totalAt - 6), flex: 1, display: "flex", alignItems: "center", gap: 28, padding: "26px 30px", borderRadius: 26, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 14px 34px rgba(11,31,42,0.08)" }}>
            <Donut value={ratio} size={230} thickness={26} color={palette.gold} at={totalAt} label={`${Math.round(ratio * 100)}%`} sublabel="accredited" />
            <div>
              <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color: palette.ink }}>
                {countUp(frame, totalAt, 45, cd.accreditedTotal)}
                <span style={{ fontSize: 36, color: palette.ink3, fontWeight: 700 }}> / {cd.centersTotal}</span>
              </div>
              <div style={{ fontSize: 24, color: palette.ink2, fontWeight: 700, marginTop: 8, lineHeight: 1.25 }}>accredited Child Development Centers provincewide</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {[
            { label: "CENTERS IN OPERATION", items: cd.centers, at: centersAt, color: palette.teal, icon: House },
            { label: "PARTNERSHIPS", items: cd.partnerships, at: partnersAt, color: palette.gold, icon: Handshake },
          ].map((group) => (
            <div key={group.label} style={{ ...fadeUp(frame, group.at), flex: 1, display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 24, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 14px 34px rgba(11,31,42,0.08)" }}>
              <IconBadge icon={group.icon} color={group.color} size={64} at={group.at + 2} />
              <div>
                <div style={{ fontSize: 18, letterSpacing: 3, fontWeight: 800, color: palette.ink3, marginBottom: 8 }}>{group.label}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {group.items.map((item, i) => (
                    <div key={item} style={{ ...pop(frame, group.at + 6 + i * 6, fps), padding: "8px 18px", borderRadius: 12, backgroundColor: group.color, color: group.color === palette.gold ? palette.ink : palette.white, fontSize: 25, fontWeight: 800 }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
