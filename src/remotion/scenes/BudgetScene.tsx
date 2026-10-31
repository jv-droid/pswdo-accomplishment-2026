import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Coins } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { Gauge, IconBadge } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { countUp, fadeUp, settle } from "../anim";
import { palette, tint } from "../theme";
import data from "../../data/accomplishment.json";

const ORDER = [
  { id: "lcpc", word: "Local", fallback: 11, color: palette.emerald },
  { id: "scpwd", word: "Senior", fallback: 16, color: palette.sky },
  { id: "gad", word: "Gender", fallback: 20, color: palette.violet },
];

export const BudgetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalAt = useWordFrame("44.78", 3);
  const usedAt = useWordFrame("33.76", 6);
  const fundFrames = ORDER.map((o) => useWordFrame(o.word, o.fallback));
  const used = Math.min(1, settle(frame, usedAt, fps));

  return (
    <SceneShell accent={palette.gold}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <IconBadge icon={Coins} color={palette.gold} size={80} at={2} />
          <div style={{ ...fadeUp(frame, 4), fontSize: 68, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: palette.ink }}>Budget utilization</div>
        </div>

        {/* Total vs utilized stacked bar */}
        <div style={{ ...fadeUp(frame, totalAt - 6), padding: "24px 30px", borderRadius: 26, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 14px 34px rgba(11,31,42,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 800, color: palette.ink3 }}>THREE KEY FUNDS</div>
              <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, color: palette.ink }}>₱{(countUp(frame, totalAt, 40, data.budget.totalFund * 100) / 100).toFixed(2)}M</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 800, color: palette.ink3 }}>UTILIZED</div>
              <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, color: palette.gold }}>
                ₱{(countUp(frame, usedAt, 40, data.budget.totalUtilized * 100) / 100).toFixed(2)}M
                <span style={{ fontSize: 30, color: palette.ink2, marginLeft: 14 }}>{Math.round(used * data.budget.totalPct)}%</span>
              </div>
            </div>
          </div>
          <div style={{ height: 30, borderRadius: 15, backgroundColor: tint(palette.gold, 0.18), overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${used * data.budget.totalPct}%`, background: `linear-gradient(90deg, ${palette.amber}, ${palette.gold})`, borderRadius: 15 }} />
          </div>
        </div>

        {/* Three gauges */}
        <div style={{ display: "flex", gap: 22, flex: 1 }}>
          {ORDER.map((o, i) => {
            const fund = data.budget.funds.find((f) => f.id === o.id)!;
            return (
              <div key={fund.id} style={{ ...fadeUp(frame, fundFrames[i] - 6), flex: 1, padding: "22px 24px 18px", borderRadius: 26, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 14px 34px rgba(11,31,42,0.08)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Gauge pct={fund.pct} color={o.color} size={330} at={fundFrames[i]} label={fund.name} sublabel={fund.full} />
                <div style={{ marginTop: "auto", fontSize: 21, color: palette.ink3, fontWeight: 700, paddingTop: 10 }}>
                  Fund ₱{fund.fund.toFixed(2)}M · Utilized ₱{fund.utilized.toFixed(2)}M
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
