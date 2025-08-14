'use client';

import { Html, useProgress } from '@react-three/drei';

import CircularProgressWithLabel from './CircularProgressWithLabel';

function ModelLoadingStatus() {
  const data = useProgress();

  return (
    <Html center>
      <CircularProgressWithLabel
        value={data.progress}
        size="190px"
      />
    </Html>
  );
}

export default ModelLoadingStatus;
