"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { FC, memo, PropsWithChildren } from "react";

export const Scene: FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <Canvas
      camera={{
        position: [0, 2, 5],
        fov: 25,
      }}
      shadows
    >
      <OrbitControls makeDefault />
      <Environment preset="lobby" />
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

      <group position={[0, -1, 0]}>{children}</group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 1, 1]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </Canvas>
  );
});

Scene.displayName = "Scene";
