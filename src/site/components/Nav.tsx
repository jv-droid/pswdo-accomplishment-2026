import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { asset, useScrollProgress, useScrollSpy } from "../hooks";
import { Roll } from "./Section";

export const NAV_LINKS: readonly (readonly [string, string])[] = [
  ["film", "Film"],
  ["programs", "Programs"],
  ["map", "Map"],
  ["people", "People"],
  ["budget", "Budget"],
  ["challenges", "Challenges"],
  ["targets", "2027"],
  ["impact", "Impact"],
];

export const Nav: React.FC = () => {
  const active = useScrollSpy(NAV_LINKS.map(([id]) => id));
  const progress = useScrollProgress();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };
  // Close the mobile menu on an outside tap, on scroll, or on Escape.
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const el = menuRef.current;
      if (el?.open && !el.contains(e.target as Node)) el.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onScroll = () => {
      if (menuRef.current?.open) menuRef.current.open = false;
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  // Frosted bar once scrolled; on the way down the whole bar slides away, on the way up it returns.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 140 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y <= 140) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <i style={{ ["--p" as string]: `${progress}%` }} />
      </div>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}>
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="PSWDO Romblon home">
            <img src={asset("images/pswdo-logo-512.png")} alt="" />
            <span>
              <strong>PSWDO Romblon</strong>
              <small>Serbisyong May Puso</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Sections">
            {NAV_LINKS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? "is-active" : ""} aria-current={active === id ? "true" : undefined}>
                <Roll>{label}</Roll>
              </a>
            ))}
          </nav>
          <a className="button button-small button-dark nav-cta" href="#film">
            <Roll>Watch the film</Roll>
            <ArrowUpRight className="arrow" size={16} />
          </a>
          <details className="mobile-menu" ref={menuRef}>
            <summary aria-label="Open navigation">
              <span />
              <span />
              <span />
            </summary>
            <div className="mobile-menu-panel">
              <nav aria-label="Mobile navigation">
                {NAV_LINKS.map(([id, label], i) => (
                  <a key={id} href={`#${id}`} style={{ ["--i" as string]: i }} onClick={closeMenu}>
                    <small aria-hidden="true">{String(i + 1).padStart(2, "0")}</small>
                    <span>{label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </header>
    </>
  );
};
