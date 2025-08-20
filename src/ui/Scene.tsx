'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC, memo, PropsWithChildren, Suspense } from 'react';

import { SceneEnvironment } from '@/lib/definitions';

import { ModelLoadingStatus } from './components';

type Props = PropsWithChildren & {
  sceneEnvironment: SceneEnvironment;
};

export const Scene: FC<Props> = memo(({ children, sceneEnvironment }) => (
  <Canvas
    camera={{
      position: [0, 2, 5],
      fov: 25,
    }}
    shadows
  >
    <Suspense fallback={<ModelLoadingStatus />}>
      <OrbitControls makeDefault />
      <Environment preset={sceneEnvironment} />
      {/* <ambientLight /> */}

      <directionalLight
        castShadow
        position={[-5, 5, 5]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
        shadow-normalBias={0.005}
      />

      <group position={[0, -1.2, 0]}>{children}</group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 1, 1]} />
        <shadowMaterial
          transparent
          opacity={0.2}
        />
      </mesh>
    </Suspense>
  </Canvas>
));

Scene.displayName = 'Scene';
