import React, { useMemo, useState } from "react";
import { MapPin, X } from "lucide-react";
import geo from "../../data/romblon-geo.json";
import meta from "../../data/romblon-municipalities.json";
import data from "../../data/accomplishment.json";
import { fmt, useInView } from "../hooks";
import { Section } from "./Section";

type Town = (typeof geo.towns)[number] & { group: string; tag?: string; island?: string };

const groupsById = Object.fromEntries(meta.groups.map((g) => [g.id, g]));

/**
 * Province-wide interactive map. Island outlines and municipality centers come from
 * OpenStreetMap (see src/data/romblon-geo.json). Hover or tap a marker, or pick a
 * municipality from the list; filter by island group.
 */
export const MapSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [group, setGroup] = useState<string>("all");

  const towns = useMemo<Town[]>(
    () =>
      geo.towns.map((t) => {
        const m = meta.municipalities.find((x) => x.name === t.name);
        return { ...t, group: m?.group ?? "outer", tag: m && "tag" in m ? m.tag : undefined, island: m && "island" in m ? m.island : undefined };
      }),
    [],
  );

  const active = hover ?? selected;
  const activeTown = towns.find((t) => t.name === active) ?? null;
  const visible = (t: Town) => group === "all" || t.group === group;

  // Island-group labels sit just above the island that holds the group's municipalities
  // (for the scattered outer islands, above the centroid of their markers).
  const groupLabels = useMemo(() => {
    const inside = (x: number, y: number, ring: number[][]) => {
      let ok = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ok = !ok;
      }
      return ok;
    };
    return meta.groups.map((g) => {
      const pts = towns.filter((t) => t.group === g.id);
      const cx = pts.reduce((a, t) => a + t.x, 0) / pts.length;
      const cy = pts.reduce((a, t) => a + t.y, 0) / pts.length;
      const rings = geo.rings.filter((r) => pts.some((t) => inside(t.x, t.y, r)));
      if (g.id === "outer" || rings.length === 0) return { ...g, x: cx, y: cy - 60, anchor: "middle" as const };
      const all = rings.flat();
      const x = all.reduce((a, p) => a + p[0], 0) / all.length;
      const top = Math.min(...all.map((p) => p[1]));
      if (g.id === "romblon") {
        // Romblon Island sits between Tablas and Sibuyan: start its label at the island's
        // left edge so the text runs over open sea instead of a neighbor.
        const left = Math.min(...all.map((p) => p[0]));
        return { ...g, x: left - 10, y: top - 22, anchor: "start" as const };
      }
      return { ...g, x, y: top - 22, anchor: "middle" as const };
    });
  }, [towns]);

  const counts = Object.fromEntries(meta.groups.map((g) => [g.id, towns.filter((t) => t.group === g.id).length]));

  return (
    <Section
      id="map"
      eyebrow="Province-wide reach"
      title={
        <>
          One office, 17 municipalities, <span className="serif">3 major islands</span>
        </>
      }
      hook="PSWDO programs run across every municipality of Romblon. Hover or tap a marker to see where each one sits, or filter by island group."
    >
      <div className="map-tabs" role="tablist" aria-label="Island group">
        {[{ id: "all", name: "All municipalities" }, ...meta.groups].map((g) => (
          <button key={g.id} role="tab" aria-selected={group === g.id} className="map-tab" onClick={() => setGroup(g.id)}>
            {g.name}
            <span className="count">{g.id === "all" ? towns.length : counts[g.id]}</span>
          </button>
        ))}
      </div>

      <div className="map-grid" ref={ref}>
        <div className={`map-card reveal${inView ? " in" : ""}`}>
          <svg className="map-svg" viewBox={`0 0 ${geo.width} ${geo.height}`} role="img" aria-label="Map of Romblon province with its 17 municipalities">
            <defs>
              <filter id="island-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f766e" floodOpacity="0.18" />
              </filter>
            </defs>
            <g filter="url(#island-shadow)">
              {geo.rings.map((ring, i) => (
                <polygon key={i} className="island" points={ring.map(([x, y]) => `${x},${y}`).join(" ")} />
              ))}
            </g>
            {groupLabels.map((g) => (
              <text key={g.id} className={`group-label${group !== "all" && group !== g.id ? " dim" : ""}`} x={g.x} y={g.y} textAnchor={g.anchor}>
                {g.name.toUpperCase()}
              </text>
            ))}
            {towns.map((t) => {
              const isActive = t.name === active;
              const dim = !visible(t);
              return (
                <g
                  key={t.name}
                  className={`town${isActive ? " active" : ""}${dim ? " dim" : ""}`}
                  transform={`translate(${t.x} ${t.y})`}
                  role="button"
                  tabIndex={dim ? -1 : 0}
                  aria-label={`${t.name}, ${groupsById[t.group].name}`}
                  aria-pressed={selected === t.name}
                  onMouseEnter={() => setHover(t.name)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(t.name)}
                  onBlur={() => setHover(null)}
                  onClick={() => setSelected(selected === t.name ? null : t.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(selected === t.name ? null : t.name);
                    }
                  }}
                >
                  <circle className="halo" r={isActive ? 26 : 0} />
                  <circle className="hit" r={24} />
                  <circle className="dot" r={isActive ? 12 : 9} />
                  {(isActive || selected === t.name) && (
                    <text className="town-label" x={18} y={6}>
                      {t.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="map-credit">Map data © OpenStreetMap contributors</div>
        </div>

        <aside className="map-panel">
          {activeTown ? (
            <div className="bento-card flat map-detail" aria-live="polite">
              <div className="map-detail-head">
                <span className="icon-tile">
                  <MapPin size={18} />
                </span>
                <div>
                  <h3>{activeTown.name}</h3>
                  <div className="muted">{activeTown.island ?? groupsById[activeTown.group].name}</div>
                </div>
                {selected && (
                  <button className="icon-x" aria-label="Clear selection" onClick={() => setSelected(null)}>
                    <X size={16} />
                  </button>
                )}
              </div>
              {activeTown.tag && <div className="tag-line">{activeTown.tag}</div>}
              <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
                {groupsById[activeTown.group].note}
              </p>
              <dl className="map-facts">
                <div>
                  <dt>Programs available</dt>
                  <dd>{data.programs.length} provincial programs</dd>
                </div>
                <div>
                  <dt>Province-wide clients, Jan–Oct 2026</dt>
                  <dd>{fmt(data.headline.clients)}</dd>
                </div>
                <div>
                  <dt>Share of municipalities served</dt>
                  <dd>17 of 17</dd>
                </div>
              </dl>
              <p className="map-note">Per-municipality figures are not broken out in the January–October 2026 report.</p>
            </div>
          ) : (
            <div className="bento-card flat map-detail">
              <h3>Select a municipality</h3>
              <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
                Hover over a marker on the map or choose from the list to see where it sits in the province.
              </p>
            </div>
          )}

          <div className="town-list">
            {meta.groups
              .filter((g) => group === "all" || g.id === group)
              .map((g) => (
                <div key={g.id} className="town-group">
                  <div className="town-group-name">{g.name}</div>
                  <div className="town-chips">
                    {towns
                      .filter((t) => t.group === g.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((t) => (
                        <button
                          key={t.name}
                          className={`town-chip${t.name === active ? " active" : ""}`}
                          onMouseEnter={() => setHover(t.name)}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => setSelected(selected === t.name ? null : t.name)}
                          aria-pressed={selected === t.name}
                        >
                          {t.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </aside>
      </div>
    </Section>
  );
};
