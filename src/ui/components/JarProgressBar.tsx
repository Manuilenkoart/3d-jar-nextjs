"use client";

import { TJar } from "@/lib/definitions";
import { Box, Stack } from "@mui/material";
import { FC, memo } from "react";

type Props = Pick<TJar, "jarAmount" | "jarGoal"> & {
  fixedAmount?: number;
  interfaceFontColor: string;
};

export const JarProgressBar: FC<Props> = memo(
  ({ jarAmount, jarGoal, interfaceFontColor, fixedAmount = 0 }) => {
    const amount = jarAmount / 100;
    const goal = jarGoal / 100;

    const percent = Math.floor((amount / goal) * 100) || 0;
    const adjustedAmount = amount - fixedAmount;
    const percentageIndicatorWidth = percent <= 100 ? percent : 100;
    return (
      <Stack
        direction="row"
        sx={{
          width: "500px",
          margin: "auto",
          gap: "24px",
          alignItems: "center",
          paddingBottom: "25px",
          color: interfaceFontColor,
        }}
      >
        ${amount}
        <Box
          sx={{
            width: "70%",
            border: `1px solid ${interfaceFontColor}`,
            borderRadius: "8px",
            padding: "4px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: `${percentageIndicatorWidth}%`,
              height: "10px",
              backgroundColor: interfaceFontColor,
              borderRadius: "6px",
              position: "relative",
            }}
          ></Box>
          <Box sx={{ position: "absolute", top: "-25px", left: "0" }}>
            %{percent}
          </Box>
          {adjustedAmount ? (
            <Box sx={{ position: "absolute", bottom: "-25px", right: "0" }}>
              +${adjustedAmount}
            </Box>
          ) : null}
        </Box>
        ${goal}
      </Stack>
    );
  },
);

JarProgressBar.displayName = "JarProgressBar";
