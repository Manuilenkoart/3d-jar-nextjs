'use client';

import { useGLTF, useAnimations } from '@react-three/drei';
import React, { FC, memo, useEffect, useRef } from 'react';
import { Group } from 'three';

useGLTF.preload('/Mouse.glb');

type Props = {
  position: [x: number, y: number, z: number];
  animationIndex: number;
  isCastShadow?: boolean;
};

const Mouse: FC<Props> = ({ position, isCastShadow, animationIndex }) => {
  const group = useRef<Group>(null);

  const { nodes, materials, animations } = useGLTF('/Mouse.glb') as any;

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
        <group
          name="Armature"
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.016}
        >
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

export default memo(Mouse);
