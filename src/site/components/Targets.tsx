import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import data from "../../data/accomplishment.json";
import { Reveal, Section } from "./Section";

/** 2027 priorities: cards expand to list the resources each one needs. */
export const Targets: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section
      id="targets"
      eyebrow="CY 2027 targets and priorities"
      title={
        <>
          Where the office <span className="serif">goes next</span>
        </>
      }
      hook="Three residential and protective facilities to operationalize, critical positions to fill, and an information system so that every case is tracked. Open a card to see what each priority needs."
      soft
    >
      <div className="grid-5 targets-grid">
        {data.targets2027.map((t, i) => {
          const isOpen = open === t.id;
          return (
            <Reveal key={t.id} delay={i * 50}>
              <button className="bento-card target" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : t.id)} style={{ width: "100%" }}>
                <span className="num">0{i + 1}</span>
                <h3>{t.title}</h3>
                <span className="goal">{t.goal}</span>
                <span className="kpi">{t.kpi}</span>
                <span className="expand">
                  {isOpen ? "Hide resources" : "What it needs"} <ChevronDown size={14} />
                </span>
                {isOpen && (
                  <ul>
                    {t.resources.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
              </button>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};
