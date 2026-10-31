import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SceneRenderer, scenes } from "./SceneRenderer";
import voiceover from "./generated/voiceover.json";
import data from "../data/accomplishment.json";

const isProgram = (id: string) => data.scenes.some((s) => s.id === id && "program" in s && Boolean(s.program));

/**
 * The full accomplishment video: every narrated scene in order.
 * Program scenes slide in from the right; section changes cross-fade. A soft whoosh marks each cut.
 * Scene durations come from the generated narration so visuals always match the audio.
 */
export const PswdoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const items: React.ReactNode[] = [];
          if (i > 0) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${scene.id}`}
                presentation={isProgram(scene.id) ? slide({ direction: "from-right" }) : fade()}
                timing={
                  isProgram(scene.id)
                    ? springTiming({ config: { damping: 200 }, durationInFrames: voiceover.transitionFrames })
                    : linearTiming({ durationInFrames: voiceover.transitionFrames })
                }
              />,
            );
          }
          items.push(
            <TransitionSeries.Sequence key={scene.id} name={scene.title} durationInFrames={scene.frames}>
              <SceneRenderer sceneId={scene.id} />
            </TransitionSeries.Sequence>,
          );
          return items;
        })}
      </TransitionSeries>
      {scenes.slice(1).map((scene) => (
        <Sequence key={`sfx-${scene.id}`} name="Whoosh" from={scene.startFrame} durationInFrames={40} layout="none">
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
