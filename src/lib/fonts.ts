import { Rubik_Mono_One, Inter } from "next/font/google";

export const rubikMonoOne = Rubik_Mono_One({
  weight: "400",
  variable: "--font-rubik-mono",
  subsets: ["latin", "cyrillic"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
