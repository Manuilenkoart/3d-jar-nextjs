"use client";

import { TJar } from "@/lib/definitions";
import { Box } from "@mui/material";
import { FC, memo } from "react";

type HeaderProps = Pick<TJar, "name" | "jarAmount" | "jarGoal"> & {
  interfaceFontColor?: string;
};

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
            <div>Зібрано</div>
            <div>{jarAmount}</div>
          </Box>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <div>Ціль</div>
            <div>{jarGoal}</div>
          </Box>
        </Box>
      ) : null}
    </Box>
  ),
);

Header.displayName = "Header";
