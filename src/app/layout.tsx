import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buildbridge.ng';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BuildBridge — Fund a Skilled Artisan',
    template: '%s | BuildBridge',
  },
  description: 'BuildBridge connects you with verified Nigerian artisans who need a small boost to keep building. Fund a tool, fund a future.',
  keywords: ['artisan', 'Nigeria', 'crowdfunding', 'tradesperson', 'donate', 'community'],
  authors: [{ name: 'BuildBridge' }],
  icons: {
    icon: '/buildbridge-favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName: 'BuildBridge',
    title: 'BuildBridge — Fund a Skilled Artisan',
    description: 'BuildBridge connects you with verified Nigerian artisans who need a small boost to keep building.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BuildBridge — Fund a Skilled Artisan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildBridge — Fund a Skilled Artisan',
    description: 'BuildBridge connects you with verified Nigerian artisans who need a small boost to keep building.',
    images: ['/og-image.png'],
  },
};

import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Providers } from "@/components/Providers";
import { NetworkFailureBanner } from "@/components/ui/NetworkFailureBanner";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieConsent } from "@/components/ui/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,700;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white font-sans" style={{ fontFamily: "'Roboto', sans-serif" }} suppressHydrationWarning>
         <Providers>
            <ScrollToTop />
            <ConditionalNavbar />
            <NetworkFailureBanner />
            <main className="flex-grow">
              {children}
            </main>
            <ConditionalFooter />
            <CookieConsent />
         </Providers>
      </body>
    </html>
  );
}