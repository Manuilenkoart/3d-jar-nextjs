import { Jar } from "@/lib/definitions";
import { useIsClient } from "@/lib/useHooks";
import { FC } from "react";

type Props = {
  description: Jar["description"];
  interfaceFontColor: string;
};
export const Footer: FC<Props> = ({ description, interfaceFontColor }) => {
  const isClient = useIsClient();
  if (!isClient) {
    return <div />;
  }
  return (
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
  );
};
