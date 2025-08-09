"use client";

import { Box } from "@mui/material";
import { FC, memo } from "react";

interface HeaderProps {
  name: string;
  jarAmount?: number;
  jarGoal?: number;
  interfaceFontColor?: string;
}

export const Header: FC<HeaderProps> = memo(
  ({ name, jarAmount, jarGoal, interfaceFontColor }) => (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        gap: "16px",
        color: interfaceFontColor,
      }}
    >
      <Box
        sx={{
          fontSize: "40px",
          textAlign: "center",
        }}
      >
        {name}
      </Box>
      {jarAmount ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: "32px",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <div>Rised</div>
            <div>{jarAmount / 100}</div>
          </Box>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <div>Goal</div>
            <div>{jarGoal ? jarGoal / 100 : 0}</div>
          </Box>
        </Box>
      ) : null}
    </Box>
  ),
);

Header.displayName = "Header";
