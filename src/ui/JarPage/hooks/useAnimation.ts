'use client';

import { useEffect, useState } from 'react';

import { ANIMATIONS } from '@/lib/constants';
import { TJar } from '@/lib/definitions';
import { debounce } from '@/lib/utils';

export const useAnimation = (jarData: TJar, animationDuration: number) => {
  const [animationIndex, setAnimationIndex] = useState(ANIMATIONS.idle);
  const [newJarAmount, setNewJarAmount] = useState(0);

  const debounceAnimation = debounce(setAnimationIndex, 1000 * animationDuration);

  useEffect(() => {
    const { jarAmount } = jarData;

    if (jarAmount > newJarAmount) {
      setAnimationIndex(ANIMATIONS.dance);
      setNewJarAmount(jarAmount);
      debounceAnimation(ANIMATIONS.idle);
    }
  }, [debounceAnimation, jarData, newJarAmount]);

  return animationIndex;
};
