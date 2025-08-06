import { Box, Stack } from "@mui/material";
import { FC, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};
const Panel: FC<Props> = ({ title, children }) => {
  return (
    <Stack sx={{ border: "1px solid lightgrey", borderRadius: "4px" }}>
      <Box sx={{ padding: "8px", backgroundColor: "lightgrey" }}>{title}</Box>
      <Box sx={{ padding: "8px" }}>{children}</Box>
    </Stack>
  );
};

export default Panel;
