'use client';

import { Html, useProgress } from '@react-three/drei';

import CircularProgressWithLabel from './CircularProgressWithLabel';

function ModelLoadingStatus() {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { active, progress, errors, item, loaded, total } = useProgress();

  return (
    <Html center>
      <CircularProgressWithLabel
        value={progress}
        size="190px"
      />
    </Html>
  );
}

export default ModelLoadingStatus;
