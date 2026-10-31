import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { BigNumber, Donut, Pictogram } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { fadeLeft, fadeUp } from "../anim";
import { palette } from "../theme";
import data from "../../data/accomplishment.json";

const UNIT_COLORS: Record<string, string> = {
  "Golden Life": palette.gold,
  "Bahay Pag-asa": palette.indigo,
  PSCB: palette.emerald,
  Permanent: palette.teal,
  RHAP: palette.sky,
  "Crisis Center for Women and Children": palette.rose,
  AICS: palette.orange,
  "Support Staff": palette.ink3,
  PAVE: palette.pink,
  HERO: palette.violet,
};
const EMPHASIS: Record<string, string> = { "Golden Life": "Twenty", "Bahay Pag-asa": "nineteen", PSCB: "sixteen", Permanent: "nine" };

export const PersonnelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalAt = useWordFrame("92", 2);
  const swAt = useWordFrame("12", 3.2);
  const permAt = useWordFrame("nine", 15);
  const gridAt = useWordFrame("spread", 5);
  const rows = [...data.personnel.distribution].sort((a, b) => b.count - a.count);
  const colors = rows.flatMap((r) => Array.from({ length: r.count }, () => UNIT_COLORS[r.unit]));
  const emphasisFrames = rows.map((r) => (EMPHASIS[r.unit] ? useWordFrame(EMPHASIS[r.unit], 999) : -1));

  return (
    <SceneShell accent={palette.indigo}>
      <div style={{ display: "flex", gap: 60, height: "100%" }}>
        {/* Left: who they are */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ ...fadeUp(frame, 4), fontSize: 72, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.0, color: palette.ink }}>
            The people behind the service
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
            <BigNumber value={data.personnel.total} label="total personnel" at={totalAt} color={palette.indigo} size={130} />
            <BigNumber value={data.personnel.socialWorkers} label="licensed social workers" at={swAt} color={palette.teal} size={130} />
          </div>
          <div style={{ ...fadeUp(frame, permAt), display: "flex", alignItems: "center", gap: 24, padding: "20px 26px", borderRadius: 24, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 12px 30px rgba(11,31,42,0.08)", alignSelf: "flex-start" }}>
            <Donut value={data.personnel.permanent / data.personnel.plantilla} size={150} thickness={18} color={palette.coral} at={permAt} label={`${Math.round((data.personnel.permanent / data.personnel.plantilla) * 100)}%`} />
            <div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.5, color: palette.ink }}>
                {data.personnel.permanent} of {data.personnel.plantilla}
              </div>
              <div style={{ fontSize: 24, color: palette.ink2, fontWeight: 600, marginTop: 4 }}>plantilla positions filled</div>
              <div style={{ fontSize: 22, color: palette.coral, fontWeight: 800, marginTop: 6 }}>{data.personnel.vacant} positions vacant</div>
            </div>
          </div>
        </div>

        {/* Right: pictogram of all 92 staff, colored by unit */}
        <div style={{ flex: 1.1, display: "flex", gap: 30, alignItems: "center" }}>
          <div style={{ ...fadeUp(frame, gridAt - 4), padding: 26, borderRadius: 28, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 16px 40px rgba(11,31,42,0.08)" }}>
            <Pictogram total={data.personnel.total} highlight={data.personnel.total} columns={12} color={palette.indigo} colors={colors} size={34} gap={9} at={gridAt} stagger={0.6} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {rows.map((r, i) => {
              const emphasized = emphasisFrames[i] >= 0 && frame >= emphasisFrames[i] && frame < emphasisFrames[i] + 80;
              return (
                <div key={r.unit} style={{ ...fadeLeft(frame, gridAt + 6 + i * 3, 16, 20), display: "flex", alignItems: "center", gap: 12, scale: emphasized ? "1.06" : "1", transformOrigin: "left center" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: UNIT_COLORS[r.unit], flexShrink: 0 }} />
                  <span style={{ fontSize: 22, fontWeight: emphasized ? 800 : 600, color: emphasized ? palette.ink : palette.ink2, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.unit}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: palette.ink, width: 40, textAlign: "right" }}>{r.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
