'use client';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FC, memo } from 'react';
import { Avatar } from '@/lib/definitions';

type Props = {
  value: Avatar;
  options: { label: Capitalize<Avatar>; value: Avatar }[];
  onChange: (value: Avatar) => void;
};
export const Selector: FC<Props> = memo(({ value, options, onChange }) => (
  <Box>
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Model</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Model"
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(({ label, value }) => (
          <MenuItem
            key={label + value}
            value={value}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
));
