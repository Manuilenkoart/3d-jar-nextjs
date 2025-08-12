import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { rubikMonoOne } from "@/lib/fonts";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Tanok - пітримка зборів",
  description:
    "Tanok – інструмент пітримки зборів, де після кожного внеску оживає танцюючий аватар. Підтримайте улюблених авторів та насолоджуйтеся веселим танцем!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubikMonoOne.className}>
        <AppRouterCacheProvider>
          {children}
          <GoogleAnalytics gaId="G-BZH05L6RN2" />
          <Analytics />
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
