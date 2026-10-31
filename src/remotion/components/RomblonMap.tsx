import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import geo from "../../data/romblon-geo.json";
import { bounce, settle } from "../anim";
import { palette, tint } from "../theme";

const LABELLED = new Set(["Odiongan", "Romblon", "San Fernando", "Looc", "Cajidiocan", "Banton", "San Agustin"]);

/**
 * Romblon's islands (OpenStreetMap coastlines) with the 17 municipalities lighting up
 * one after another. `at` is the frame the drawing begins.
 */
export const RomblonMap: React.FC<{ at: number; width?: number; accent?: string; townColor?: string }> = ({
  at,
  width = 760,
  accent = palette.teal,
  townColor = palette.coral,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = width / geo.width;
  const height = geo.height * scale;
  const draw = Math.min(1, settle(frame, at, fps));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${geo.width} ${geo.height}`} style={{ overflow: "visible" }}>
      <defs>
        <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor={accent} floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#map-shadow)" opacity={draw}>
        {geo.rings.map((ring, i) => (
          <polygon
            key={i}
            points={ring.map(([x, y]) => `${x},${y}`).join(" ")}
            fill={accent}
            stroke={palette.white}
            strokeWidth={6}
            strokeLinejoin="round"
            style={{ transformOrigin: "center", scale: String(0.9 + 0.1 * draw) }}
          />
        ))}
      </g>
      {geo.towns.map((t, i) => {
        const tAt = at + 18 + i * 4;
        const s = Math.max(0, bounce(frame, tAt, fps, 10, 140));
        const pulse = interpolate((frame - tAt) % 60, [0, 60], [1, 2.4], { extrapolateLeft: "clamp" });
        return (
          <g key={t.name} transform={`translate(${t.x} ${t.y})`} opacity={frame >= tAt ? 1 : 0}>
            <circle r={16 * pulse} fill={tint(townColor, 0.25)} opacity={interpolate(pulse, [1, 2.4], [0.8, 0])} />
            <circle r={14 * s} fill={townColor} stroke={palette.white} strokeWidth={5} />
            {LABELLED.has(t.name) && (
              <text x={24} y={10} fontSize={30} fontWeight={800} fill={palette.ink} stroke={palette.paper} strokeWidth={8} paintOrder="stroke" opacity={s}>
                {t.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
