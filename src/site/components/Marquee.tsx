import React from "react";
import data from "../../data/accomplishment.json";
import { fmt } from "../hooks";

/** Endless strip of program figures; pauses on hover. */
export const Marquee: React.FC = () => {
  const items = data.programs.map((p) => (
    <span className="marquee-item" key={p.id}>
      <i />
      <b>{p.name}</b> {fmt(p.y2026)} {p.unit}
    </span>
  ));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items}
        {items.map((el, i) => React.cloneElement(el, { key: `dup-${i}` }))}
      </div>
    </div>
  );
};
