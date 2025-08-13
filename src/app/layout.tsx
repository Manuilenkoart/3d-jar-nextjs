import './globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { rubikMonoOne } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Tanok - пітримка зборів',
  description:
    'Tanok – інструмент пітримки зборів, де після кожного внеску оживає танцюючий аватар. Підтримайте улюблених авторів та насолоджуйтеся веселим танцем!',
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
