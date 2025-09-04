'use client';

import { Fab, Stack, TextField } from '@mui/material';
import { FC, memo } from 'react';

import { Panel } from '@/ui/components';

type Props = {
  inputJarId: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  fetchError: string | null;
  isDisabled: boolean;
};

export const JarSettings: FC<Props> = memo(({ inputJarId, onInputChange, onSubmit, fetchError, isDisabled }) => (
  <Panel title="Поточний збір">
    <Stack spacing={1}>
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
            value={inputJarId}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </Stack>

        <Fab
          color="primary"
          disabled={isDisabled}
          onClick={onSubmit}
        >
          GO
        </Fab>
      </Stack>
      {fetchError && <h3 style={{ color: 'red' }}>{fetchError}</h3>}
    </Stack>
  </Panel>
));
JarSettings.displayName = 'JarSettings';
