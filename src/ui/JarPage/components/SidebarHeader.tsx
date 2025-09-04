'use client';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack } from '@mui/material';
import { FC, memo } from 'react';

type Props = {
  onClose: () => void;
};

export const SidebarHeader: FC<Props> = memo(({ onClose }) => (
  <Stack
    direction="row"
    sx={{
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <h2>Налаштування</h2>
    <IconButton
      aria-label="close"
      onClick={onClose}
    >
      <CloseIcon />
    </IconButton>
  </Stack>
));
SidebarHeader.displayName = 'SidebarHeader';
