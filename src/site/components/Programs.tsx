import React, { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import data from "../../data/accomplishment.json";
import { PROGRAM_META } from "../../remotion/programMeta";
import { fmt, useCountUp, useInView } from "../hooks";
import { Reveal, Section } from "./Section";

type Program = (typeof data.programs)[number];
type Sort = "report" | "reach" | "growth";

const Delta: React.FC<{ change: number; size?: "sm" | "lg" }> = ({ change, size = "sm" }) => {
  const cls = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const text = change === 0 ? "No change" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  return (
    <span className={`delta-pill ${cls} ${size}`}>
      <Icon size={size === "lg" ? 16 : 13} />
      {text}
      <span className="vs">vs 2025</span>
    </span>
  );
};

/** Big figure that re-counts whenever the selected program changes. */
const Figure: React.FC<{ value: number; unit: string }> = ({ value, unit }) => {
  const n = useCountUp(value, true, 900);
  return (
    <div className="feature-figure">
      <b>{fmt(n)}</b>
      <span>{unit} served, January–October 2026</span>
    </div>
  );
};

/** Program explorer: tabs, a featured panel and a ranked comparison chart. */
export const Programs: React.FC = () => {
  const [sort, setSort] = useState<Sort>("reach");
  const [selectedId, setSelectedId] = useState(data.programs[0].id);
  const rank = useInView<HTMLDivElement>(0.1);

  const ranked = useMemo(() => {
    const arr = [...data.programs];
    if (sort === "reach") arr.sort((a, b) => b.y2026 - a.y2026);
    if (sort === "growth") arr.sort((a, b) => b.change - a.change);
    return arr;
  }, [sort]);

  const max = Math.max(...data.programs.map((p) => Math.max(p.y2025, p.y2026)));
  const selected = (data.programs.find((p) => p.id === selectedId) ?? data.programs[0]) as Program;
  const selMax = Math.max(selected.y2025, selected.y2026);
  const SelIcon = PROGRAM_META[selected.id].icon;
  const diff = selected.y2026 - selected.y2025;
  const share = (selected.y2026 / data.headline.clients) * 100;

  const onKey = (e: React.KeyboardEvent) => {
    const i = data.programs.findIndex((p) => p.id === selectedId);
    if (e.key === "ArrowRight") setSelectedId(data.programs[(i + 1) % data.programs.length].id);
    if (e.key === "ArrowLeft") setSelectedId(data.programs[(i - 1 + data.programs.length) % data.programs.length].id);
  };

  return (
    <Section
      id="programs"
      eyebrow="Accomplishments"
      title={
        <>
          Nine programs, <span className="serif">22,513 clients</span>
        </>
      }
      hook="Pick a program to see what it does, who it reached, and how 2026 compares with the same period in 2025. The chart below ranks all nine on one scale."
    >
      {/* Program tabs */}
      <div className="prog-tabs" role="tablist" aria-label="Programs" onKeyDown={onKey}>
        {data.programs.map((p) => {
          const Icon = PROGRAM_META[p.id].icon;
          const active = p.id === selectedId;
          return (
            <button key={p.id} role="tab" aria-selected={active} tabIndex={active ? 0 : -1} className="prog-tab" onClick={() => setSelectedId(p.id)}>
              <Icon size={16} strokeWidth={2.2} />
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Featured program */}
      <div className="feature bento-card flat" key={selected.id} role="tabpanel">
        <div className="feature-copy">
          <div className="feature-head">
            <span className="icon-tile lg" style={{ background: `${PROGRAM_META[selected.id].color}1a`, color: PROGRAM_META[selected.id].color }}>
              <SelIcon size={26} strokeWidth={2} />
            </span>
            <div>
              <span className="kicker">{selected.hook}</span>
              <h3>{selected.name}</h3>
              <div className="full">{selected.full}</div>
            </div>
          </div>
          <p>{selected.what}</p>
          <div className="impact">{selected.impact}</div>
        </div>
        <div className="feature-data">
          <Figure value={selected.y2026} unit={selected.unit} />
          <Delta change={selected.change} size="lg" />
          <div className="compare">
            {[
              { y: "2025", v: selected.y2025, cls: "prev" },
              { y: "2026", v: selected.y2026, cls: "curr" },
            ].map((r) => (
              <div className="compare-row" key={r.y}>
                <span className="muted">{r.y}</span>
                <div className="track">
                  <div className={`fill ${r.cls}`} tabIndex={0} data-tip={`${r.y}: ${fmt(r.v)} ${selected.unit}`} style={{ width: `${Math.max(1.5, (r.v / selMax) * 100)}%` }} />
                </div>
                <span className="v">{fmt(r.v)}</span>
              </div>
            ))}
          </div>
          <dl className="feature-facts">
            <div>
              <dt>Change in people reached</dt>
              <dd>{diff === 0 ? "No change" : `${diff > 0 ? "+" : "−"}${fmt(Math.abs(diff))}`}</dd>
            </div>
            <div>
              <dt>Share of all 2026 clients</dt>
              <dd>{share.toFixed(1)}%</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Ranked comparison chart */}
      <Reveal className="rank bento-card flat">
        <div className="rank-head">
          <div>
            <h3>All programs on one scale</h3>
            <p className="muted">Clients served, 2025 vs 2026. Select a row to feature it above.</p>
          </div>
          <div className="rank-controls">
            <div className="seg" role="group" aria-label="Sort programs">
              {(["reach", "growth", "report"] as Sort[]).map((s) => (
                <button key={s} aria-pressed={sort === s} onClick={() => setSort(s)}>
                  {s === "reach" ? "By reach" : s === "growth" ? "By growth" : "Report order"}
                </button>
              ))}
            </div>
            <div className="legend" aria-hidden="true">
              <span>
                <i style={{ background: "var(--amber)" }} />
                2025
              </span>
              <span>
                <i style={{ background: "var(--accent)" }} />
                2026
              </span>
            </div>
          </div>
        </div>
        <div className="rank-list" ref={rank.ref}>
          {ranked.map((p, i) => {
            const Icon = PROGRAM_META[p.id].icon;
            const active = p.id === selectedId;
            return (
              <button key={p.id} className={`rank-row${active ? " active" : ""}`} onClick={() => setSelectedId(p.id)} aria-pressed={active} style={{ transitionDelay: `${i * 30}ms` }}>
                <span className="rank-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="rank-name">
                  <span className="icon-tile sm">
                    <Icon size={14} strokeWidth={2.2} />
                  </span>
                  {p.name}
                </span>
                <span className="rank-bars" aria-hidden="true">
                  <span className="bar y25" style={{ width: rank.inView ? `${(p.y2025 / max) * 100}%` : 0 }} />
                  <span className="bar y26" style={{ width: rank.inView ? `${(p.y2026 / max) * 100}%` : 0 }} />
                </span>
                <span className="rank-val">{fmt(p.y2026)}</span>
                <span className="rank-delta">
                  <Delta change={p.change} />
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
};
