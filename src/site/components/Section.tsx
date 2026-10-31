import React from "react";
import { useInView } from "../hooks";

/** Text that rolls up on hover, revealing an accent copy (nav links, buttons). */
export const Roll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="roll">
    <span>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

/** Section wrapper with a centered eyebrow / title / hook header that blurs in on scroll. */
export const Section: React.FC<{
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  hook?: React.ReactNode;
  soft?: boolean;
  children: React.ReactNode;
}> = ({ id, eyebrow, title, hook, soft, children }) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section id={id} className={`section${soft ? " soft" : ""}`}>
      <div className="container">
        <div ref={ref} className={`section-head reveal${inView ? " in" : ""}`}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="title">{title}</h2>
          {hook && <p className="hook">{hook}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

/** Any block that blurs in when scrolled into view. */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" }> = ({
  children,
  className = "",
  delay = 0,
  as = "div",
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={`reveal${inView ? " in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
};
