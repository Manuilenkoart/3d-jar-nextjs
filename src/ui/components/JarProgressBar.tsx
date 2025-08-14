'use client';

import { Box, Stack } from '@mui/material';
import { FC, memo, useMemo } from 'react';

import { TJar } from '@/lib/definitions';

type Props = Pick<TJar, 'jarAmount' | 'jarGoal'> & {
  interfaceFontColor: string;
  fixedAmount?: number;
  isFixAmount?: boolean;
};

export const JarProgressBar: FC<Props> = memo(
  ({ jarAmount, jarGoal, interfaceFontColor, fixedAmount = 0, isFixAmount = false }) => {
    const amount = useMemo(() => jarAmount / 100, [jarAmount]);
    const goal = useMemo(() => jarGoal / 100, [jarGoal]);

    const percent = useMemo(() => Math.floor((jarAmount / jarGoal) * 100) || 0, [jarAmount, jarGoal]);

    const adjustedAmount = useMemo(() => (jarAmount - fixedAmount) / 100, [fixedAmount, jarAmount]);

    const percentageIndicatorWidth = useMemo(() => (percent <= 100 ? percent : 100), [percent]);

    return (
      <Stack
        direction="row"
        sx={{
          gap: '24px',
          alignItems: 'center',
          paddingBottom: '25px',
          color: interfaceFontColor,
        }}
      >
        <Currency value={amount} />
        <Box
          sx={{
            width: '100%',
            border: `1px solid ${interfaceFontColor}`,
            borderRadius: '8px',
            padding: '4px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: `${percentageIndicatorWidth}%`,
              height: '10px',
              backgroundColor: interfaceFontColor,
              borderRadius: '6px',
              position: 'relative',
            }}
          ></Box>
          <Box sx={{ position: 'absolute', top: '-25px', left: '0' }}>%{percent}</Box>
          {isFixAmount ? (
            <Stack
              direction={'row'}
              sx={{
                position: 'absolute',
                bottom: '-25px',
                right: '0',
              }}
            >
              +{adjustedAmount}
            </Stack>
          ) : null}
        </Box>
        <Currency value={goal} />
      </Stack>
    );
  },
);

JarProgressBar.displayName = 'JarProgressBar';

const Currency: FC<{ value: number }> = ({ value }) => (
  <Stack
    direction={'row'}
    sx={{ alignItems: 'baseline' }}
  >
    <p style={{ fontSize: '10px' }}>&#x20b4;</p>
    <p>{value}</p>
  </Stack>
);
