import React, { useEffect, useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Reveal, Section } from "./Section";
import { asset } from "../hooks";

type Chapter = { id: string; title: string; chapter: string; startSec: number };
type ChapterFile = { durationSec: number; chapters: Chapter[] };

const VIDEO = "video/pswdo-accomplishment-2026.mp4";
const POSTER = "video/poster.jpg";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** The generated Remotion film with chapter cards that seek the player. */
export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chapters, setChapters] = useState<ChapterFile | null>(null);
  const [time, setTime] = useState(0);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(asset("data/chapters.json"))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setChapters(j))
      .catch(() => undefined);
  }, []);

  const active = chapters ? [...chapters.chapters].reverse().find((c) => time >= c.startSec - 0.25) : undefined;

  const seek = (sec: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = sec;
    void v.play();
    v.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Section
      id="film"
      eyebrow="The film"
      title={
        <>
          Ten months of service, <span className="serif">told in six minutes</span>
        </>
      }
      hook="A narrated walkthrough of every program with subtitles, generated from the same figures as this page. Pick a chapter to jump straight to it."
    >
      <Reveal>
        <div className="video-frame">
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            poster={asset(POSTER)}
            src={asset(VIDEO)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onError={() => setMissing(true)}
          />
          {missing && (
            <div className="video-missing">
              <div>
                <b>The film has not been rendered yet.</b>
                <p style={{ marginTop: 8, opacity: 0.85 }}>
                  Run <code>npm run voiceover</code> then <code>npm run render</code> to generate it.
                </p>
              </div>
            </div>
          )}
        </div>
      </Reveal>
      <div className="video-meta">
        <span>1080p · 30 fps{chapters ? ` · ${mmss(chapters.durationSec)}` : ""}</span>
        <span>Narration with word-synced subtitles</span>
        <a className="more" href={asset(VIDEO)} download>
          <Download size={14} /> Download MP4
        </a>
        <a className="more" href={asset("docs/PSWDO-Accomplishment-Jan-Oct-2026.pdf")} target="_blank" rel="noreferrer">
          <FileText size={14} /> Original PDF report
        </a>
      </div>

      <div className="chapters">
        <h3>Chapters</h3>
        {!chapters && <p className="muted" style={{ textAlign: "center" }}>Loading chapters…</p>}
        {chapters && (
          <div className="chapter-grid">
            {chapters.chapters.map((c, i) => (
              <button key={c.id} className={`chapter${active?.id === c.id ? " active" : ""}`} onClick={() => seek(c.startSec)}>
                <span className="t">{mmss(c.startSec)}</span>
                <span>
                  {i + 1}. {c.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};
