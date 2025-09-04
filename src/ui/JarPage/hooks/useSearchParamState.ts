'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { read } from '@/lib/utils';

export const useSearchParamState = <T>(paramKey: string, storageKey: string, defaultValue: T) => {
  const searchParams = useSearchParams();

  const [state, setState] = useState<T>(() => {
    const param = searchParams.get(paramKey);
    const storage = read(storageKey);

    if (param !== null) {
      return typeof defaultValue === 'boolean' ? JSON.parse(param) : param;
    }

    return storage ?? defaultValue;
  });

  return [state, setState] as const;
};
