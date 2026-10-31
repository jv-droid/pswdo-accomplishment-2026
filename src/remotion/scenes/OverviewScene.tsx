import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Activity, FolderKanban, Layers, Users } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { IconBadge } from "../components/Infographics";
import { PROGRAM_META } from "../programMeta";
import { useWordFrame } from "../SceneContext";
import { countUp, fadeUp, fmt, pop, settle } from "../anim";
import { palette, tint } from "../theme";
import data from "../../data/accomplishment.json";

const Tile: React.FC<{ value: number | string; label: string; at: number; color: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> }> = ({ value, label, at, color, icon: Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...pop(frame, at, fps), flex: 1, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 24, backgroundColor: palette.white, border: `1px solid ${palette.line}`, boxShadow: "0 12px 30px rgba(11,31,42,0.08)" }}>
      <div style={{ width: 70, height: 70, borderRadius: 20, backgroundColor: tint(color, 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={38} color={color} strokeWidth={2.4} />
      </div>
      <div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1, letterSpacing: -2, color }}>{typeof value === "number" ? fmt(countUp(frame, at, 40, value)) : value}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: palette.ink2, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
};

export const OverviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const programsAt = useWordFrame("7", 1.6);
  const projectsAt = useWordFrame("16", 2.4);
  const activitiesAt = useWordFrame("98", 3.4);
  const clientsAt = useWordFrame("22,513", 5);
  const chartAt = useWordFrame("Compared", 7.5);
  const max = Math.max(...data.programs.map((p) => Math.max(p.y2025, p.y2026)));

  return (
    <SceneShell accent={palette.teal}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ ...fadeUp(frame, 4), fontSize: 68, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, color: palette.ink }}>Accomplishments at a glance</div>
          <div style={{ ...fadeUp(frame, chartAt), display: "flex", gap: 24, fontSize: 22, fontWeight: 700, color: palette.ink2 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: palette.amber }} /> 2025
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: palette.teal }} /> 2026
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          <Tile value={data.headline.clients} label="Clients served" at={clientsAt} color={palette.teal} icon={Users} />
          <Tile value={data.headline.programs} label="Programs" at={programsAt} color={palette.violet} icon={Layers} />
          <Tile value={data.headline.projects} label="Projects" at={projectsAt} color={palette.coral} icon={FolderKanban} />
          <Tile value={data.headline.activities} label="Activities" at={activitiesAt} color={palette.gold} icon={Activity} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1, justifyContent: "center" }}>
          {data.programs.map((p, i) => {
            const at = chartAt + i * 3;
            const meta = PROGRAM_META[p.id];
            const up = p.change > 0;
            const flat = p.change === 0;
            const grow = Math.min(1, settle(frame, at, fps));
            return (
              <div key={p.id} style={{ ...fadeUp(frame, at, 14, 10), display: "flex", alignItems: "center", gap: 14 }}>
                <IconBadge icon={meta.icon} color={meta.color} size={38} at={at} />
                <div style={{ width: 320, fontSize: 23, fontWeight: 700, color: palette.ink, whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ height: 13, width: `${(p.y2025 / max) * 100 * grow}%`, backgroundColor: palette.amber, borderRadius: 4 }} />
                  <div style={{ height: 13, width: `${(p.y2026 / max) * 100 * grow}%`, backgroundColor: palette.teal, borderRadius: 4 }} />
                </div>
                <div style={{ width: 110, fontSize: 24, fontWeight: 800, textAlign: "right", color: palette.ink }}>{fmt(p.y2026)}</div>
                <div
                  style={{
                    width: 125,
                    fontSize: 19,
                    fontWeight: 800,
                    textAlign: "center",
                    padding: "4px 0",
                    borderRadius: 999,
                    color: flat ? palette.ink3 : up ? palette.emerald : palette.coral,
                    backgroundColor: flat ? "rgba(11,31,42,0.06)" : up ? tint(palette.emerald, 0.15) : tint(palette.coral, 0.15),
                  }}
                >
                  {flat ? "0.0%" : `${up ? "▲ +" : "▼ "}${p.change.toFixed(1)}%`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
