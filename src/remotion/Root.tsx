import React from "react";
import { Composition, Folder } from "remotion";
import { PswdoVideo } from "./PswdoVideo";
import { SceneRenderer, scenes } from "./SceneRenderer";
import voiceover from "./generated/voiceover.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PswdoAccomplishment2026"
        component={PswdoVideo}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={voiceover.totalFrames}
      />
      <Folder name="Scenes">
        {scenes.map((scene) => (
          <Composition
            key={scene.id}
            id={`Scene-${scene.id}`}
            component={SceneRenderer}
            width={1920}
            height={1080}
            fps={30}
            durationInFrames={scene.frames}
            defaultProps={{ sceneId: scene.id }}
          />
        ))}
      </Folder>
    </>
  );
};
