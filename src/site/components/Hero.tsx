import React, { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import data from "../../data/accomplishment.json";
import { asset, fmt } from "../hooks";
import { Roll } from "./Section";

const WORDS: { text: string; serif?: boolean }[] = [
  { text: "Behind" },
  { text: "every" },
  { text: "number" },
  { text: "is" },
  { text: "a" },
  { text: "family", serif: true },
  { text: "in" },
  { text: "Romblon.", serif: true },
];

/** Full-height hero: word-by-word headline, faint guide lines, a glow that follows the pointer. */
export const Hero: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = glowRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="top" className="home-hero" onMouseMove={onMove}>
      <div ref={glowRef} className="hero-glow" aria-hidden="true" />
      <div className="hero-lines" aria-hidden="true">
        <svg viewBox="0 0 1440 640" preserveAspectRatio="none">
          {[160, 350, 540, 720, 900, 1090, 1280].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="640" />
          ))}
          <line className="beam" x1="540" y1="0" x2="540" y2="640" style={{ animationDelay: "0s" }} />
          <line className="beam" x1="900" y1="0" x2="900" y2="640" style={{ animationDelay: "-3s" }} />
        </svg>
      </div>

      <div className="container home-hero-inner">
        <span className="hero-tag">
          <img src={asset("images/pswdo-logo-512.png")} alt="" />
          {data.office.government} · {data.office.event}
        </span>
        <h1>
          {WORDS.map((w, i) => (
            <React.Fragment key={i}>
              <span className={`hero-word${w.serif ? " serif" : ""}`} style={{ ["--i" as string]: i }}>
                {w.text}
              </span>{" "}
            </React.Fragment>
          ))}
        </h1>
        <p className="hero-description">
          From January to October 2026 the Provincial Social Welfare and Development Office reached {fmt(data.headline.clients)} clients across {data.romblon.municipalities}{" "}
          municipalities and 3 major islands. Explore what every program delivered, where the money went, and what comes next.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#film">
            <Play size={16} />
            <Roll>Watch the film</Roll>
            <ArrowRight className="arrow" size={16} />
          </a>
          <a className="button button-light" href="#programs">
            <Roll>Explore the programs</Roll>
          </a>
        </div>
        <div className="hero-facts">
          <span>
            <b>{fmt(data.headline.clients)}</b> clients served
          </span>
          <span>
            <b>{data.headline.programs}</b> programs · <b>{data.headline.projects}</b> projects · <b>{data.headline.activities}</b> activities
          </span>
          <span>
            <b>{data.romblon.municipalities}</b> municipalities reached
          </span>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <i />
        Scroll to explore
      </div>
    </section>
  );
};
