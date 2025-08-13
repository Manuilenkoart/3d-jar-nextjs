import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Box, Stack } from '@mui/material';
import { FC, memo } from 'react';

import { TJar } from '@/lib/definitions';

type Props = {
  isLoading: boolean;
  jarAmount: TJar['jarAmount'];
  jarGoal: TJar['jarGoal'];
  fetchError: string;
};
export const StatusBar: FC<Props> = memo(({ isLoading, jarAmount, jarGoal, fetchError }) => (
  <Stack
    direction={'row'}
    sx={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      color: '#8894a5',
      padding: '12px',
    }}
  >
    <AutorenewIcon
      fontSize="small"
      sx={{
        transform: `rotate(${isLoading ? 360 : 0}deg)`,
        transition: 'transform 1s linear',
      }}
    />
    <Box>{!jarAmount && !jarGoal && !fetchError ? 'Loading...' : null}</Box>
    <Box>{fetchError ?? ''}</Box>
  </Stack>
));

StatusBar.displayName = 'StatusBar';
