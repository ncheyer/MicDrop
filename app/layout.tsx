import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/privacy/CookieConsent";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "MicDrop by Speak About AI - Speaker Landing Pages",
  description: "Build comprehensive landing pages for your talks and connect with your audience. Professional speaker platform powered by Speak About AI.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}