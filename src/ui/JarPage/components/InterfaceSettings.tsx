'use client';

import { Box, Button, Checkbox, FormControlLabel, Stack } from '@mui/material';
import { ChangeEvent, FC, memo } from 'react';

import { ProgressBarState } from '@/lib/definitions';
import { Panel } from '@/ui/components';
import { Picker } from '@/ui/Picker';

type Props = {
  bcColor: string;
  isTransparent: boolean;
  interfaceFontColor: string;
  isShowText: boolean;
  progressBar: ProgressBarState;
  isShowQr: boolean;
  jarAmount: number;
  jarGoal: number;
  onBcColorChange: (color: string) => void;
  onTransparentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFontColorChange: (color: string) => void;
  onShowTextToggle: () => void;
  onProgressBarChange: (value: boolean, field: 'isShow') => void;
  onShowQrChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export const InterfaceSettings: FC<Props> = memo(
  ({
    bcColor,
    isTransparent,
    interfaceFontColor,
    isShowText,
    progressBar,
    isShowQr,
    jarAmount,
    jarGoal,
    onBcColorChange,
    onTransparentChange,
    onFontColorChange,
    onShowTextToggle,
    onProgressBarChange,
    onShowQrChange,
  }) => (
    <Panel title="Interface">
      <Stack spacing={1}>
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Picker
            title="Background color"
            value={bcColor}
            onChange={onBcColorChange}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isTransparent}
                onChange={onTransparentChange}
              />
            }
            label="Background transparent"
          />
        </Box>

        {jarAmount && jarGoal ? (
          <>
            <Picker
              title="Font color"
              value={interfaceFontColor}
              onChange={onFontColorChange}
            />

            <Button
              variant="outlined"
              onClick={onShowTextToggle}
            >
              {`${isShowText ? 'Hide' : 'Show'} interface text`}
            </Button>
          </>
        ) : null}

        <Stack
          direction={'row'}
          sx={{ gap: '8px', justifyContent: 'space-between' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={progressBar.isShow}
                onChange={(e) => onProgressBarChange(e.target.checked, 'isShow')}
              />
            }
            label="Progress bar"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isShowQr}
                onChange={onShowQrChange}
              />
            }
            label="QR code"
          />
        </Stack>
      </Stack>
    </Panel>
  ),
);
InterfaceSettings.displayName = 'InterfaceSettings';
