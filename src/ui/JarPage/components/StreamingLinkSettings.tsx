'use client';

import { Box, Button } from '@mui/material';
import { FC, memo } from 'react';

import { Panel } from '@/ui/components';

type Props = {
  windowLocationOrigin: string;
  pathname: string;
  makeSearchParams: string;
};

export const StreamingLinkSettings: FC<Props> = memo(({ windowLocationOrigin, pathname, makeSearchParams }) => (
  <Panel
    title="Streaming link"
    actions={
      <Button
        variant="outlined"
        onClick={() => navigator.clipboard.writeText(windowLocationOrigin + pathname + makeSearchParams)}
      >
        copy
      </Button>
    }
  >
    <Box sx={{ maxWidth: '500px' }}>
      <p>{windowLocationOrigin + pathname + makeSearchParams}</p>
    </Box>
  </Panel>
));
StreamingLinkSettings.displayName = 'StreamingLinkSettings';
