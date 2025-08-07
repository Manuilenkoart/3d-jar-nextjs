"use client";

import React, { FC, useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

useGLTF.preload("/Model.glb");

type Props = {
  position: [x: number, y: number, z: number];
  animationIndex: number;
  isCastShadow?: boolean;
};

export const Model: FC<Props> = ({
  position,
  isCastShadow,
  animationIndex,
}) => {
  const group = useRef<Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials, animations } = useGLTF("/Model.glb") as any;

  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
    return () => {
      actions[names[animationIndex]]?.fadeOut(0.5);
    };
  }, [actions, animationIndex, names]);

  return (
    <group
      ref={group}
      {...{ position, castShadow: isCastShadow }}
      dispose={null}
    >
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Ch14"
            geometry={nodes.Ch14.geometry}
            material={materials.Ch14_Body}
            skeleton={nodes.Ch14.skeleton}
            castShadow={isCastShadow}
            receiveShadow
          />

          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
};
