import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | longcut.ink",
    default: "longcut.ink",
  },
  description: "Cinematic long-form journalism. The long game, in ink.",
  openGraph: {
    title: "longcut.ink",
    description: "Cinematic long-form journalism. The long game, in ink.",
    siteName: "longcut.ink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${garamond.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
