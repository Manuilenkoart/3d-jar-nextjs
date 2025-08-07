"use client";
import { TJar } from "@/lib/definitions";
import { FC, memo } from "react";

type Props = {
  description: TJar["description"];
  interfaceFontColor: string;
};
export const Footer: FC<Props> = memo(({ description, interfaceFontColor }) => (
  <div
    style={{
      maxWidth: "500px",
      margin: "auto",
      fontSize: "14px",
      color: interfaceFontColor,
    }}
  >
    {description}
  </div>
));

Footer.displayName = "Footer";
