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
  const debounceUrl = debounce(setSrc, 500);

  useEffect(() => {
    if (!isShow) return;

    debounceUrl(qrUrl);
  }, [qrUrl, isShow, debounceUrl]);

  return isShow && src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="qr code"
      loading="lazy"
    />
  ) : null;
});

Qr.displayName = 'Qr';
