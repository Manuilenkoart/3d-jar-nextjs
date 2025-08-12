import { Box, Stack } from "@mui/material";
import { FC, memo, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  isShow?: boolean;
};
const Panel: FC<Props> = ({ title, children, actions, isShow = true }) => {
  return isShow ? (
    <Stack sx={{ border: "1px solid #cfd8dc", borderRadius: "4px" }}>
      <Stack
        direction="row"
        sx={{
          padding: "12px 8px",
          backgroundColor: "#cfd8dc",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4>{title}</h4>
        {actions}
      </Stack>
      <Box sx={{ padding: "8px" }}>{children}</Box>
    </Stack>
  ) : null;
};

export default memo(Panel);
