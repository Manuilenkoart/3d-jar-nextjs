import { Stack } from '@mui/material';
import { FC, memo } from 'react';

type Props = {
  title: string;
  value: string;
  onChange: (_color: string) => void;
};
export const Picker: FC<Props> = memo(({ title, value, onChange }) => (
  <Stack
    direction="row"
    spacing={1}
    sx={{
      alignItems: 'center',
    }}
  >
    <label htmlFor={title}>{title}</label>
    <input
      type="color"
      id={title}
      defaultValue={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      }}
    />
  </Stack>
));

Picker.displayName = 'Picker';
