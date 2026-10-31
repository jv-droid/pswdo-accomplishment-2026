import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Building2, ClipboardCheck, FileCheck, Handshake, Network, Siren } from "lucide-react";
import { SceneShell } from "../components/SceneShell";
import { IconBadge } from "../components/Infographics";
import { useWordFrame } from "../SceneContext";
import { fadeUp, pop, progress } from "../anim";
import { palette, tint } from "../theme";
import data from "../../data/accomplishment.json";

const Highlight: React.FC<{ at: number; color: string; children: React.ReactNode }> = ({ at, color, children }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ position: "relative", whiteSpace: "nowrap" }}>
      <span
        style={{
          position: "absolute",
          left: -8,
          right: -8,
          bottom: -2,
          height: "55%",
          borderRadius: 8,
          backgroundColor: tint(color, 0.35),
          scale: `${progress(frame, at, 16)} 1`,
          transformOrigin: "left center",
        }}
      />
      <span style={{ position: "relative", fontWeight: 800, color: palette.ink }}>{children}</span>
    </span>
  );
};

const MFO = [
  { word: "approving", icon: FileCheck, color: palette.teal },
  { word: "implementing", icon: Network, color: palette.violet },
  { word: "running", icon: Building2, color: palette.sky },
  { word: "delivering", icon: Siren, color: palette.coral },
  { word: "providing", icon: Handshake, color: palette.gold },
  { word: "ensuring", icon: ClipboardCheck, color: palette.emerald },
];

export const MandateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const protectionAt = useWordFrame("protection,", 2.2);
  const dignityAt = useWordFrame("dignity,", 3.4);
  const wellbeingAt = useWordFrame("well-being", 4.6);
  const mfoAt = useWordFrame("Six", 9);
  const itemFrames = MFO.map((m, i) => useWordFrame(m.word, 11 + i * 2.2));

  return (
    <SceneShell accent={palette.violet}>
      <div style={{ display: "flex", gap: 70, height: "100%", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...fadeUp(frame, 4), fontSize: 22, letterSpacing: 4, fontWeight: 800, color: palette.violet, marginBottom: 18 }}>BRIEF OVERVIEW</div>
          <div style={{ ...fadeUp(frame, 10), fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1, marginBottom: 30, color: palette.ink }}>
            Our mandate
          </div>
          <div style={{ ...fadeUp(frame, 18), fontSize: 36, lineHeight: 1.5, color: palette.ink2, fontWeight: 500 }}>
            The PSWDO promotes <Highlight at={protectionAt} color={palette.teal}>social protection</Highlight>, upholds{" "}
            <Highlight at={dignityAt} color={palette.coral}>human dignity</Highlight>, and enhances the{" "}
            <Highlight at={wellbeingAt} color={palette.gold}>well-being</Highlight> of disadvantaged individuals, families, and communities through responsive,
            inclusive, and accessible social welfare services.
          </div>
        </div>

        <div style={{ flex: 1.05 }}>
          <div style={{ ...fadeUp(frame, mfoAt), fontSize: 22, letterSpacing: 4, fontWeight: 800, color: palette.violet, marginBottom: 20 }}>
            SIX MAJOR FINAL OUTPUTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {data.office.mfo.map((item, i) => (
              <div
                key={item}
                style={{
                  ...pop(frame, itemFrames[i], fps),
                  transformOrigin: "left center",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 20px",
                  borderRadius: 22,
                  backgroundColor: palette.white,
                  boxShadow: "0 12px 30px rgba(11,31,42,0.08)",
                  border: `1px solid ${palette.line}`,
                }}
              >
                <IconBadge icon={MFO[i].icon} color={MFO[i].color} size={66} at={itemFrames[i] + 3} />
                <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.2, color: palette.ink }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
