'use client';

import { Box, Checkbox, FormControlLabel, Slider, Stack } from '@mui/material';
import { FC, memo } from 'react';

import { ANIMATION_DURATION_CONFIGURATION } from '@/lib/constants';
import { Panel, Selector } from '@/ui/components';
import { Avatar } from '@/lib/definitions';

type Props = {
  animationDuration: number;
  hasAvatarShadow: boolean;
  avatarOption: Avatar;
  onAvatarChange: (value: Avatar) => void;
  onAnimationDurationChange: (value: number) => void;
  onAvatarShadowToggle: () => void;
};
export const AvatarSettings: FC<Props> = memo(
  ({
    animationDuration,
    hasAvatarShadow,
    avatarOption,
    onAvatarChange,
    onAnimationDurationChange,
    onAvatarShadowToggle,
  }) => (
    <Panel title="Avatar">
      <Stack spacing={3}>
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

        <Selector
          value={avatarOption}
          onChange={onAvatarChange}
          options={[
            { label: 'Pumpkin', value: 'pumpkin' },
            { label: 'Bender', value: 'bender' },
            { label: 'Mouse', value: 'mouse' },
            { label: 'Sorceress', value: 'sorceress' },
            { label: 'Robot', value: 'robot' },
          ]}
        />
      </Stack>
    </Panel>
  ),
);
AvatarSettings.displayName = 'AvatarSettings';
