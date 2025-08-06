"use client";

import { useIsClient } from "@/lib/useHooks";
import { FC } from "react";

interface HeaderProps {
  name: string;
  jarAmount?: number;
  jarGoal?: number;
  interfaceFontColor?: string;
}

export const Header: FC<HeaderProps> = ({
  name,
  jarAmount,
  jarGoal,
  interfaceFontColor,
}) => {
  const isClient = useIsClient();

  const headerStyle = {
    display: "grid",
    justifyContent: "center",
    gap: "16px",
    color: interfaceFontColor,
  };

  const nameStyle = {
    fontSize: "40px",
    textAlign: "center" as const,
  };

  const jarContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    gap: "32px",
  };

  const jarItemStyle = {
    textAlign: "center" as const,
  };

  if (!isClient) {
    return <div />;
  }

  return (
    <div style={headerStyle}>
      <div style={nameStyle}>{name}</div>
      {jarAmount && jarGoal ? (
        <div style={jarContainerStyle}>
          <div style={jarItemStyle}>
            <div>Rised</div>
            <div>{jarAmount / 100}</div>
          </div>
          <div style={jarItemStyle}>
            <div>Goal</div>
            <div>{jarGoal / 100}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
