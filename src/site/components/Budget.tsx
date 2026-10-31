import React from "react";
import data from "../../data/accomplishment.json";
import { useCountUp, useInView } from "../hooks";
import { Reveal, Section } from "./Section";

const peso = (m: number) => `₱${m.toFixed(2)}M`;

const Donut: React.FC<{ pct: number; active: boolean }> = ({ pct, active }) => {
  const r = 46;
  const c = 2 * Math.PI * r;
  const shown = useCountUp(pct, active, 1200);
  return (
    <div className="donut" role="img" aria-label={`${pct}% utilized`}>
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle className="track" cx="56" cy="56" r={r} strokeWidth="11" fill="none" />
        <circle className="fill" cx="56" cy="56" r={r} strokeWidth="11" fill="none" strokeDasharray={c} strokeDashoffset={active ? c * (1 - pct / 100) : c} />
      </svg>
      <div className="lbl">
        <div>
          <b>{shown}%</b>
          <span>utilized</span>
        </div>
      </div>
    </div>
  );
};

/** Budget utilization: one summary bar, then one card per fund with a ring and plain amounts. */
export const Budget: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const b = data.budget;
  const remaining = b.totalFund - b.totalUtilized;
  const funds = [...b.funds].sort((x, y) => y.pct - x.pct);
  const top = funds[0].id;
  const total = useCountUp(Math.round(b.totalFund * 100), inView, 1200) / 100;
  const used = useCountUp(Math.round(b.totalUtilized * 100), inView, 1200) / 100;
  const left = useCountUp(Math.round(remaining * 100), inView, 1200) / 100;

  return (
    <Section
      id="budget"
      eyebrow="Budget utilization"
      title={
        <>
          Three funds, <span className="serif">three of every four pesos</span> put to work
        </>
      }
      hook="Each fund is money set aside by law for a specific group. Utilization is the share of that money already spent on services by October 2026."
      soft
    >
      <div ref={ref}>
        <Reveal className="bento-card flat budget-summary">
          <div className="stat">
            <b>{peso(total)}</b>
            <span>Allocated across three funds</span>
          </div>
          <div className="stat used">
            <b>{peso(used)}</b>
            <span>Utilized by October ({b.totalPct}%)</span>
          </div>
          <div className="stat left">
            <b>{peso(left)}</b>
            <span>Remaining for November to December</span>
          </div>
          <div className="stack">
            <div className="stack-bar" role="meter" aria-valuenow={b.totalPct} aria-valuemin={0} aria-valuemax={100} aria-label="Overall utilization">
              <div className="used" style={{ width: inView ? `${b.totalPct}%` : 0 }} />
            </div>
            <div className="stack-legend">
              <span>
                <i style={{ background: "var(--accent)" }} />
                Utilized {b.totalPct}%
              </span>
              <span>
                <i style={{ background: "var(--soft-2)", border: "1px solid var(--line)" }} />
                Remaining {(100 - b.totalPct).toFixed(1)}%
              </span>
            </div>
          </div>
        </Reveal>

        <div className="fund-grid">
          {funds.map((f, i) => (
            <Reveal className="bento-card fund" key={f.id} delay={i * 80}>
              <Donut pct={f.pct} active={inView} />
              <div>
                {f.id === top && <span className="badge">Highest utilization</span>}
                <h3>{f.name}</h3>
                <div className="muted" style={{ fontSize: 13 }}>
                  {f.full}
                </div>
                <p className="what">{f.plain}</p>
                <div className="amounts">
                  <div className="row">
                    <span>Allocated</span>
                    <b>{peso(f.fund)}</b>
                  </div>
                  <div className="row">
                    <span>Utilized</span>
                    <b style={{ color: "var(--accent-dark)" }}>{peso(f.utilized)}</b>
                  </div>
                  <div className="row">
                    <span>Remaining</span>
                    <b>{peso(f.fund - f.utilized)}</b>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="budget-note">
          GAD = Gender and Development; SC / PWD = Senior Citizens and Persons with Disability; LCPC = Local Council for the Protection of Children. Figures in millions of
          Philippine pesos, January to October 2026.
        </p>
      </div>
    </Section>
  );
};
