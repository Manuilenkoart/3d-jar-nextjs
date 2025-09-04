'use client';

import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { RE_FETCH_INTERVAL } from '@/lib/constants';
import { TJar } from '@/lib/definitions';
import { fetcher, fetchWidgetJarInfo } from '@/lib/hooks';

export const useJarData = (clientId: string) => {
  const {
    data: mainJarInfo,
    error: mainJarInfoError,
    isLoading: mainJarInfoIsLoading,
  } = useSWR<TJar>(`/api/jar?clientId=${clientId}`, fetcher, {
    revalidateOnFocus: false,
  });

  const [jarData, setJarData] = useState<TJar>({
    description: '',
    extJarId: '',
    jarAmount: 0,
    jarGoal: 0,
    name: '',
  });

  const [isLoading, setIsLoading] = useState(mainJarInfoIsLoading);
  const [fetchError, setFetchError] = useState<string | null>(mainJarInfoError);

  const checkResponse = useCallback(
    (jar: TJar) => {
      const keys = Object.keys(jar);

      if (['description', 'jarGoal', 'jarAmount', 'name'].every((k) => keys.includes(k))) {
        setJarData((prev) => ({ ...prev, ...jar }));
        return;
      }

      if (keys.includes('errCode')) {
        if (jar.errCode === '7014') {
          setFetchError('Схоже, банки з таким ID не існує');
          console.error(`${clientId}: errCode - 7014`);
          return;
        }
        if (jar.errCode === 'TMR') {
          setFetchError('Забагато запитів. Спробуйте пізніше.');
          console.error(`${clientId}: errCode - TMR`);
          return;
        }
      }
    },
    [clientId],
  );

  useEffect(() => {
    if (mainJarInfo) {
      checkResponse(mainJarInfo);
    }
    setIsLoading(false);
  }, [mainJarInfo, checkResponse]);

  const makefetchJarData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!jarData.extJarId) return;

      const data = await fetchWidgetJarInfo(jarData.extJarId);
      checkResponse(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [jarData.extJarId, checkResponse]);

  useEffect(() => {
    const intervalId = setInterval(makefetchJarData, 1000 * RE_FETCH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [makefetchJarData]);

  return { jarData, isLoading, fetchError, setFetchError };
};
