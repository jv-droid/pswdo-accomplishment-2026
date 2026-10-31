import React, { useState } from "react";
import { Plus } from "lucide-react";
import data from "../../data/accomplishment.json";
import { Reveal, Section } from "./Section";

export const Challenges: React.FC = () => {
  const [open, setOpen] = useState<string | null>(data.challenges[0].id);
  return (
    <Section
      id="challenges"
      eyebrow="Issues, gaps and challenges"
      title={
        <>
          Honest about <span className="serif">what holds the work back</span>
        </>
      }
      hook="Related concerns were grouped into three operational gaps. Open each one to see its service impact and the priority response."
    >
      <div className="faq-list">
        {data.challenges.map((c, i) => {
          const isOpen = open === c.id;
          return (
            <Reveal key={c.id} delay={i * 60} className="bento-card flat faq-item">
              <div data-open={isOpen} className="faq-item">
                <button className="faq-btn" aria-expanded={isOpen} aria-controls={`panel-${c.id}`} onClick={() => setOpen(isOpen ? null : c.id)}>
                  <span className="num">0{i + 1}</span>
                  <h3>{c.title}</h3>
                  <span className="faq-toggle">
                    <Plus size={16} />
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-panel" id={`panel-${c.id}`}>
                    <div>
                      <h4>Key concerns</h4>
                      <ul>
                        {c.concerns.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Service impact</h4>
                      <p>{c.impact}</p>
                    </div>
                    <div>
                      <h4>Priority response</h4>
                      <div className="resp">{c.response}</div>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};
