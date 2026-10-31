import React, { useState } from "react";
import { Plus } from "lucide-react";
import data from "../../data/accomplishment.json";
import { Reveal, Section } from "./Section";

const MFO_DETAIL: Record<string, string> = {
  "Policies and plans approved": "Social welfare policies, program plans and budgets drafted by the office and approved by the provincial government.",
  "Social protection PPAs implemented": "Programs, projects and activities such as PAVE, HERO, Golden Life, AICS and RHAP delivered directly to clients.",
  "Center- and institution-based services implemented": "Residential and training centers like Bahay Pag-asa and PSCB, run day to day by the office's staff.",
  "Special operations services implemented": "Rapid response in emergencies and crises, including disaster relief and protective custody.",
  "Technical assistance and resource augmentation provided": "Guidance, training and resources extended to municipal social welfare offices and Child Development Centers.",
  "Compliance with PGR rules and regulations": "Reporting, auditing and administrative compliance with Provincial Government of Romblon requirements.",
};

export const Mandate: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section
      id="mandate"
      eyebrow="Brief overview"
      title={
        <>
          Our <span className="serif">mandate</span>
        </>
      }
      soft
    >
      <div className="mandate">
        <Reveal>
          <blockquote>
            The PSWDO promotes <span className="serif">social protection</span>, upholds <span className="serif">human dignity</span>, and enhances the{" "}
            <span className="serif">well-being</span> of disadvantaged individuals, families, and communities through responsive, inclusive, and accessible social
            welfare services.
          </blockquote>
        </Reveal>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Six major final outputs
          </div>
          <div className="mfo-acc">
            {data.office.mfo.map((m, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={m} delay={i * 50} className="mfo-item" as="div">
                  <div data-open={isOpen} className="mfo-item" style={{ border: 0 }}>
                    <button className="mfo-btn" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                      <span className="num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="label">{m}</span>
                      <span className="toggle">
                        <Plus size={14} />
                      </span>
                    </button>
                    {isOpen && <div className="mfo-body">{MFO_DETAIL[m]}</div>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};
