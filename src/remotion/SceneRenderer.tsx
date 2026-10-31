import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { SceneProvider, type SceneData } from "./SceneContext";
import { font, palette } from "./theme";
import voiceover from "./generated/voiceover.json";
import data from "../data/accomplishment.json";
import { IntroScene } from "./scenes/IntroScene";
import { MandateScene } from "./scenes/MandateScene";
import { PersonnelScene } from "./scenes/PersonnelScene";
import { OverviewScene } from "./scenes/OverviewScene";
import { ProgramScene } from "./scenes/ProgramScene";
import { SystemsScene } from "./scenes/SystemsScene";
import { BudgetScene } from "./scenes/BudgetScene";
import { ChallengesScene } from "./scenes/ChallengesScene";
import { TargetsScene } from "./scenes/TargetsScene";
import { ImpactScene } from "./scenes/ImpactScene";
import { OutroScene } from "./scenes/OutroScene";

export const scenes = voiceover.scenes as SceneData[];

const STATIC_SCENES: Record<string, React.FC> = {
  intro: IntroScene,
  mandate: MandateScene,
  personnel: PersonnelScene,
  overview: OverviewScene,
  systems: SystemsScene,
  budget: BudgetScene,
  challenges: ChallengesScene,
  targets: TargetsScene,
  impact: ImpactScene,
  outro: OutroScene,
};

const SceneBody: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const Static = STATIC_SCENES[sceneId];
  if (Static) {
    return <Static />;
  }
  const programScene = data.scenes.find((s) => s.id === sceneId);
  if (programScene && "program" in programScene && programScene.program) {
    return <ProgramScene programId={programScene.program} />;
  }
  throw new Error(`No scene component registered for "${sceneId}"`);
};

/**
 * Renders one narrated scene: visuals + narration audio (after the lead-in) + subtitles.
 * Used both inside the full video and as a standalone composition per scene in the Studio.
 */
export const SceneRenderer: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const { fps } = useVideoConfig();
  const scene = scenes.find((s) => s.id === sceneId);
  if (!scene) {
    throw new Error(`Unknown scene "${sceneId}". Run \`npm run voiceover\` to regenerate narration.`);
  }
  const leadFrames = Math.round((voiceover.leadMs / 1000) * fps);

  return (
    <SceneProvider value={scene}>
      <AbsoluteFill style={{ fontFamily: font, backgroundColor: palette.navy }}>
        <SceneBody sceneId={sceneId} />
        <Sequence name="Narration" from={leadFrames} layout="none">
          <Audio src={staticFile(scene.audio)} />
        </Sequence>
        <Captions />
      </AbsoluteFill>
    </SceneProvider>
  );
};
