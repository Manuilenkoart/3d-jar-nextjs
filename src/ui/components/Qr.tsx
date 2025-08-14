'use client';

import { FC, memo, useEffect, useMemo, useState } from 'react';

import { debounce } from '@/lib/utils';

type Props = {
  isShow: boolean;
  clientId: string;
  light: string; // background color
  dark: string; // line color
};

export const Qr: FC<Props> = memo(({ isShow, clientId, light, dark }) => {
  const [src, setSrc] = useState('');

  const qrUrl = useMemo(
    () => `https://quickchart.io/qr?text=https://send.monobank.ua/jar/${clientId}&margin=0&light=${light}&dark=${dark}`,
    [clientId, light, dark],
  );
  const debounceUrl = debounce(setSrc, 1000);

  useEffect(() => {
    if (!isShow) return;

    debounceUrl(qrUrl);
  }, [qrUrl, isShow, debounceUrl]);

  if (isShow && !src) return <p>QR loading...</p>;
  if (!isShow) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="qr code"
      loading="lazy"
    />
  );
});

Qr.displayName = 'Qr';
