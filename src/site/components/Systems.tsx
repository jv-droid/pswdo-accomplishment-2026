import React from "react";
import { ArrowRight } from "lucide-react";
import data from "../../data/accomplishment.json";
import { useCountUp, useInView } from "../hooks";
import { Reveal, Section } from "./Section";

export const Systems: React.FC = () => {
  const cd = data.childDevelopment;
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const assessed = useCountUp(cd.assessed, inView, 1200);
  const endorsed = useCountUp(cd.endorsed, inView, 1200);
  const accredited = useCountUp(cd.accredited2026, inView, 1200);
  const ratio = cd.accreditedTotal / cd.centersTotal;
  const r = 54;
  const c = 2 * Math.PI * r;

  const steps = [
    { n: assessed, label: "Assessed", desc: "Centers visited and evaluated against national standards." },
    { n: endorsed, label: "Endorsed", desc: "Centers recommended to the accrediting body." },
    { n: accredited, label: "Accredited", desc: "Centers granted accreditation in 2026.", accent: true },
  ];

  return (
    <Section
      id="systems"
      eyebrow="Centers, accreditation and partners"
      title={
        <>
          Strengthening <span className="serif">the system itself</span>
        </>
      }
      hook="In 2026 the office assessed, endorsed and accredited Child Development Centers across the province, and kept two residential and training centers running with partners."
    >
      <div ref={ref} className="grid-2">
        <Reveal className="bento-card">
          <div className="eyebrow">Child Development Center accreditation, 2026</div>
          <div className="flow" style={{ marginTop: 20 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className={`step stat${s.accent ? " accent" : ""}`}>
                  <b>{s.n}</b>
                  <span>{s.label}</span>
                  <small>{s.desc}</small>
                </div>
                {i < steps.length - 1 && <ArrowRight className="arrow" size={20} />}
              </React.Fragment>
            ))}
          </div>
        </Reveal>
        <Reveal className="bento-card" delay={80}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div className="ring">
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle className="bg" cx="64" cy="64" r={r} strokeWidth="12" fill="none" />
                <circle className="fg" cx="64" cy="64" r={r} strokeWidth="12" fill="none" strokeDasharray={c} strokeDashoffset={inView ? c * (1 - ratio) : c} />
              </svg>
              <div className="lbl">{Math.round(ratio * 100)}%</div>
            </div>
            <div className="stat">
              <b>
                {cd.accreditedTotal}
                <span style={{ display: "inline", fontSize: 18, color: "var(--muted)", marginLeft: 6 }}>/ {cd.centersTotal}</span>
              </b>
              <span>Accredited Child Development Centers provincewide</span>
            </div>
          </div>
          <div className="grid-2" style={{ marginTop: 24, gap: 24 }}>
            <div>
              <div className="eyebrow">Centers in operation</div>
              <div className="pill-list">
                {cd.centers.map((x) => (
                  <span key={x} className="pill" title={x === "PSCB" ? "Productivity Skills and Capability Building center" : "Youth rehabilitation center for children in conflict with the law"}>
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow">Partnerships</div>
              <div className="pill-list">
                {cd.partnerships.map((x) => (
                  <span key={x} className="pill">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};
