import React, { useState } from "react";
import data from "../../data/accomplishment.json";
import { useCountUp, useInView } from "../hooks";
import { Reveal, Section } from "./Section";

const Stat: React.FC<{ value: number | string; label: string; accent?: boolean; active: boolean }> = ({ value, label, accent, active }) => {
  const n = useCountUp(typeof value === "number" ? value : 0, active, 1200);
  return (
    <div className={`bento-card stat${accent ? " accent" : ""}`}>
      <b>{typeof value === "number" ? n : value}</b>
      <span>{label}</span>
    </div>
  );
};

/** Personnel: counters plus a unit list where each row expands to explain the unit. */
export const Personnel: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const [open, setOpen] = useState<string | null>(null);
  const rows = [...data.personnel.distribution].sort((a, b) => b.count - a.count);
  const max = rows[0].count;
  return (
    <Section
      id="people"
      eyebrow="Personnel complement"
      title={
        <>
          92 people deliver <span className="serif">every program</span>
        </>
      }
      hook="Twelve licensed social workers and eighty other staff, most on contractual or job-order status. Only nine of 67 plantilla positions are filled, which is why staffing leads the 2027 agenda."
      soft
    >
      <div className="people" ref={ref}>
        <div className="people-stats">
          <Stat value={data.personnel.total} label="Total personnel" accent active={inView} />
          <Stat value={data.personnel.socialWorkers} label="Licensed social workers" active={inView} />
          <Stat value={`${data.personnel.permanent} / ${data.personnel.plantilla}`} label="Plantilla positions filled" active={inView} />
          <Stat value={data.personnel.vacant} label="Plantilla positions vacant" active={inView} />
        </div>
        <Reveal className="bento-card flat">
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Staff by program and service area
          </div>
          <div className="unit-list">
            {rows.map((r, i) => {
              const isOpen = open === r.unit;
              return (
                <button key={r.unit} className="unit" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.unit)}>
                  <span className="lbl">{r.unit}</span>
                  <span className="trk">
                    <span className="fl" style={{ display: "block", width: inView ? `${(r.count / max) * 100}%` : 0, transitionDelay: `${i * 40}ms` }} />
                  </span>
                  <span className="num">{r.count}</span>
                  {isOpen && <span className="unit-note">{r.note}</span>}
                </button>
              );
            })}
          </div>
          <p className="muted" style={{ marginTop: 14, fontSize: 13 }}>
            Tap a row to see what the unit does.
          </p>
        </Reveal>
      </div>
    </Section>
  );
};
