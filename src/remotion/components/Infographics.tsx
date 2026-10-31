import React from "react";
import type { LucideIcon } from "lucide-react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { bounce, countUp, fadeUp, fmt, pop, settle } from "../anim";
import { palette, tint } from "../theme";

/* ------------------------------------------------------------------ */
/* Icon badge: colored circle with a lucide icon, springs in.          */
/* ------------------------------------------------------------------ */
export const IconBadge: React.FC<{ icon: LucideIcon; color: string; size?: number; at: number; onColor?: boolean }> = ({
  icon: Icon,
  color,
  size = 120,
  at,
  onColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...pop(frame, at, fps),
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: onColor ? "rgba(255,255,255,0.22)" : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: onColor ? "none" : `0 18px 40px ${tint(color, 0.35)}`,
        flexShrink: 0,
      }}
    >
      <Icon size={size * 0.52} color={palette.white} strokeWidth={2.2} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Donut: ring that fills to `value` (0..1) with a figure inside.      */
/* ------------------------------------------------------------------ */
export const Donut: React.FC<{
  value: number;
  size?: number;
  thickness?: number;
  color: string;
  track?: string;
  at: number;
  label: React.ReactNode;
  sublabel?: string;
  ink?: string;
}> = ({ value, size = 260, thickness = 26, color, track, at, label, sublabel, ink = palette.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, settle(frame, at, fps)) * value;
  return (
    <div style={{ ...pop(frame, at - 6, fps), position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ rotate: "-90deg" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track ?? tint(color, 0.18)} strokeWidth={thickness} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: ink }}>
        <div style={{ fontSize: size * 0.2, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>{label}</div>
        {sublabel && <div style={{ fontSize: size * 0.075, fontWeight: 700, color: palette.ink3, marginTop: 6 }}>{sublabel}</div>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pictogram: grid of people icons; the first `highlight` are colored. */
/* ------------------------------------------------------------------ */
const Person: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 24 30" fill={color}>
    <circle cx="12" cy="6" r="5" />
    <path d="M4 30v-9a8 8 0 0 1 16 0v9z" />
  </svg>
);

export const Pictogram: React.FC<{
  total: number;
  highlight: number;
  columns: number;
  color: string;
  muted?: string;
  size?: number;
  gap?: number;
  at: number;
  stagger?: number;
  /** Optional per-person colors (overrides color/highlight). */
  colors?: string[];
}> = ({ total, highlight, columns, color, muted = "rgba(11,31,42,0.14)", size = 34, gap = 10, at, stagger = 1, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, ${size}px)`, gap }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ scale: String(Math.max(0, Math.min(1.15, bounce(frame, at + i * stagger, fps, 14, 160)))), opacity: frame >= at + i * stagger ? 1 : 0 }}>
          <Person size={size} color={colors ? colors[i] ?? muted : i < highlight ? color : muted} />
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Gauge: half-circle arc filled to pct (0..100).                      */
/* ------------------------------------------------------------------ */
export const Gauge: React.FC<{ pct: number; color: string; size?: number; at: number; label: string; sublabel?: string }> = ({
  pct,
  color,
  size = 300,
  at,
  label,
  sublabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const thickness = size * 0.1;
  const r = (size - thickness) / 2;
  const half = Math.PI * r;
  const p = Math.min(1, settle(frame, at, fps)) * (pct / 100);
  const shown = Math.round(Math.min(1, settle(frame, at, fps)) * pct);
  return (
    <div style={{ ...fadeUp(frame, at - 6), width: size, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size / 2 + thickness / 2} viewBox={`0 0 ${size} ${size / 2 + thickness / 2}`}>
        <path
          d={`M ${thickness / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - thickness / 2} ${size / 2}`}
          stroke={tint(color, 0.18)}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${thickness / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - thickness / 2} ${size / 2}`}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={half}
          strokeDashoffset={half * (1 - p)}
        />
      </svg>
      <div style={{ marginTop: -size * 0.22, fontSize: size * 0.24, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: palette.ink }}>{shown}%</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 14, color: palette.ink }}>{label}</div>
      {sublabel && <div style={{ fontSize: 21, color: palette.ink3, fontWeight: 600, marginTop: 4, textAlign: "center" }}>{sublabel}</div>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* BarCompare: two horizontal bars (2025 vs 2026) with values.         */
/* ------------------------------------------------------------------ */
export const BarCompare: React.FC<{
  rows: { label: string; value: number; color: string }[];
  at: number;
  height?: number;
  labelWidth?: number;
  valueWidth?: number;
  fontSize?: number;
}> = ({ rows, at, height = 30, labelWidth = 90, valueWidth = 150, fontSize = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {rows.map((r, i) => {
        const p = Math.min(1, settle(frame, at + i * 8, fps));
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: labelWidth, fontSize: fontSize * 0.85, fontWeight: 800, color: palette.ink2 }}>{r.label}</div>
            <div style={{ flex: 1, height, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backgroundColor: tint(r.color, 0.12), borderRadius: 6 }} />
              <div style={{ height: "100%", width: `${Math.max(1.5, (r.value / max) * 100) * p}%`, backgroundColor: r.color, borderRadius: 6 }} />
            </div>
            <div style={{ width: valueWidth, fontSize, fontWeight: 800, textAlign: "right", color: palette.ink, letterSpacing: -1 }}>{fmt(Math.round(r.value * p))}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* BigNumber: large count-up figure with label.                        */
/* ------------------------------------------------------------------ */
export const BigNumber: React.FC<{ value: number; label: string; at: number; color?: string; size?: number; prefix?: string; suffix?: string; dur?: number }> = ({
  value,
  label,
  at,
  color = palette.ink,
  size = 150,
  prefix = "",
  suffix = "",
  dur = 45,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...pop(frame, at, fps), transformOrigin: "left center" }}>
      <div style={{ fontSize: size, fontWeight: 800, lineHeight: 0.95, letterSpacing: -size * 0.04, color }}>
        {prefix}
        {fmt(countUp(frame, at, dur, value))}
        {suffix}
      </div>
      <div style={{ fontSize: Math.max(24, size * 0.2), fontWeight: 700, color: palette.ink2, marginTop: 10 }}>{label}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* DeltaBadge: ▲ +160.6% vs 2025                                       */
/* ------------------------------------------------------------------ */
export const DeltaBadge: React.FC<{ change: number; at: number; size?: number }> = ({ change, at, size = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flat = change === 0;
  const up = change > 0;
  const color = flat ? palette.ink3 : up ? palette.emerald : palette.coral;
  return (
    <div
      style={{
        ...pop(frame, at, fps),
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: `${size * 0.35}px ${size * 0.7}px`,
        borderRadius: 999,
        backgroundColor: tint(color, 0.15),
        color,
        fontSize: size,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {flat ? "No change" : `${up ? "▲ +" : "▼ "}${change.toFixed(1)}%`}
      <span style={{ color: palette.ink3, fontWeight: 700, fontSize: size * 0.8 }}>vs 2025</span>
    </div>
  );
};
