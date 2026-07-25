import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadDesk Mini — Capture Every Lead. Miss Nothing.",
  description:
    "The lightweight CRM for solopreneurs and agencies who need pipeline clarity without the enterprise bloat. Start capturing leads in under 2 minutes.",
  keywords: ["CRM", "lead capture", "pipeline", "sales", "solopreneur"],
  openGraph: {
    title: "LeadDesk Mini — Capture Every Lead. Miss Nothing.",
    description:
      "The lightweight CRM for solopreneurs and agencies who need pipeline clarity without the enterprise bloat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
