import { Stack } from "@mui/material";
import { FC } from "react";

type Props = {
  title: string;
  value: string;
  onChange: (color: string) => void;
};
export const Picker: FC<Props> = ({ title, value, onChange }) => (
  <Stack
    direction="row"
    spacing={1}
    sx={{
      alignItems: "center",
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
);
