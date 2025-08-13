'use client';
import { Fab, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import { setCookie, getCookie } from '@/lib/utils';

export const RedirectForm: FC = () => {
  const router = useRouter();
  const [textFieldValue, setTextFieldValue] = useState('');

  useEffect(() => {
    const jarId = getCookie('jarId') ?? '';
    setTextFieldValue(jarId);
  }, []);

  const handleSubmit = () => {
    setCookie('jarId', textFieldValue);

    router.push(`/jars/${textFieldValue}`);
  };

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        <p>https://send.monobank.ua/jar/</p>
        <TextField
          id="outlined-basic"
          label="jar id"
          variant="outlined"
          value={textFieldValue}
          name="jarId"
          onChange={(e) => setTextFieldValue(e.target.value)}
        />
      </Stack>

      <Fab
        color="primary"
        disabled={textFieldValue.length < 7}
        onClick={handleSubmit}
      >
        GO
      </Fab>
    </Stack>
  );
};
