'use client';

import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { FC, memo } from 'react';

import { ProgressBarState } from '@/lib/definitions';
import { Panel } from '@/ui/components';

type Props = {
  progressBar: ProgressBarState;
  onProgressBarChange: (value: boolean | number, field: keyof ProgressBarState) => void;
};
export const ProgressBarSettings: FC<Props> = memo(({ progressBar, onProgressBarChange }) => (
  <Panel
    title="Progress bar"
    isShow={progressBar.isShow}
  >
    <Stack
      direction="row"
      spacing={1}
      sx={{ justifyContent: 'space-between' }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={progressBar.isFixAmount}
            onChange={(e) => onProgressBarChange(e.target.checked, 'isFixAmount')}
          />
        }
        label="Зафіксувати суму"
      />

      <TextField
        id="outlined-basic"
        label="Відлік від суми"
        variant="outlined"
        defaultValue={progressBar.fixAmount / 100}
        onChange={(e) => {
          onProgressBarChange(+e.target.value, 'fixAmount');
        }}
      />
    </Stack>
  </Panel>
));
ProgressBarSettings.displayName = 'ProgressBarSettings';
