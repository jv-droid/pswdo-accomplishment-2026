import React from "react";
import { Baby, HeartPulse, LifeBuoy, School, ShieldCheck, Sun } from "lucide-react";
import data from "../../data/accomplishment.json";
import { fmt, useInView } from "../hooks";
import { Reveal } from "./Section";

const ICONS = [ShieldCheck, HeartPulse, Sun, LifeBuoy, Baby, School];

/** Gradient statement band: the headline ratio and six impact points. */
export const Impact: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section id="impact" className="statement">
      <div className="container" ref={ref}>
        <div className={`section-head reveal${inView ? " in" : ""}`} style={{ marginBottom: 0 }}>
          <span className="eyebrow">What it means for Romblon</span>
          <h2 className="title">
            {data.romblon.municipalities} municipalities. {data.romblon.islands} islands. <span className="serif">One safety net.</span>
          </h2>
        </div>
        <div className={`big reveal${inView ? " in" : ""}`} style={{ transitionDelay: "120ms" }}>
          1 <span className="serif">in</span> {data.romblon.reachRatio.split(" ").pop()}
        </div>
        <p className={`lead reveal${inView ? " in" : ""}`} style={{ transitionDelay: "220ms" }}>
          Roughly one in every {data.romblon.reachRatioWord} Romblomanons was reached by a PSWDO service between January and October 2026, measured against a population of{" "}
          {fmt(data.romblon.population)} in the {data.romblon.populationNote}.
        </p>
        <div className="impact-points">
          {data.romblon.impactPoints.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={p.title} className="bento-card impact-point" delay={i * 60}>
                <span className="icon-tile" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <b>{p.title}</b>
                <span>{p.text}</span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
