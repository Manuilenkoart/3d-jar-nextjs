'use client';

import { Box, Checkbox, FormControlLabel, Slider, Stack } from '@mui/material';
import { FC, memo } from 'react';

import { ANIMATION_DURATION_CONFIGURATION } from '@/lib/constants';
import { Panel } from '@/ui/components';

type Props = {
  animationDuration: number;
  hasAvatarShadow: boolean;
  onAnimationDurationChange: (value: number) => void;
  onAvatarShadowToggle: () => void;
};
export const AvatarSettings: FC<Props> = memo(
  ({ animationDuration, hasAvatarShadow, onAnimationDurationChange, onAvatarShadowToggle }) => (
    <Panel title="Avatar">
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>Тривалість анімації: {animationDuration}сек</Box>
          <Slider
            sx={{ flex: 1 }}
            value={animationDuration}
            onChange={(_e, newValue) => onAnimationDurationChange(newValue as number)}
            min={ANIMATION_DURATION_CONFIGURATION.min}
            max={ANIMATION_DURATION_CONFIGURATION.max}
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={hasAvatarShadow}
              onChange={onAvatarShadowToggle}
            />
          }
          label="Тінь аватара"
        />
      </Stack>
    </Panel>
  ),
);
AvatarSettings.displayName = 'AvatarSettings';
