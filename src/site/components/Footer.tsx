import React from "react";
import { ArrowUp } from "lucide-react";
import data from "../../data/accomplishment.json";
import { asset } from "../hooks";
import { NAV_LINKS } from "./Nav";

export const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={asset("images/pswdo-logo-512.png")} alt="PSWDO Romblon seal" />
          <div>
            <strong>{data.office.name}</strong>
            <p>
              {data.office.government}. Promoting social protection, upholding human dignity and enhancing the well-being of disadvantaged individuals, families and
              communities across Romblon.
            </p>
          </div>
        </div>
        <div>
          <p className="footer-label">On this page</p>
          <nav className="footer-links" aria-label="Footer">
            {NAV_LINKS.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="footer-label">Report</p>
          <p className="footer-cta-title">{data.office.tagline}</p>
          <div className="footer-links" style={{ marginTop: 16 }}>
            <a href={asset("docs/PSWDO-Accomplishment-Jan-Oct-2026.pdf")} target="_blank" rel="noreferrer">
              Source report (PDF)
            </a>
            <a href={asset("video/pswdo-accomplishment-2026.mp4")} download>
              Download the film (MP4)
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          {data.office.event} · {data.office.period} · Map data © OpenStreetMap contributors
        </span>
        <a className="to-top" href="#top">
          Back to top <ArrowUp size={14} />
        </a>
      </div>
    </div>
  </footer>
);
