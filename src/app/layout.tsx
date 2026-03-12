import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MasterKey | AI-Powered Real Estate for Your Team",
  description:
    "One platform that orchestrates the best AI tools and market data to handle transactions, deep market research, and complex real estate projects.",
  openGraph: {
    title: "MasterKey | AI-Powered Real Estate for Your Team",
    description:
      "One platform that orchestrates the best AI tools and market data to handle transactions, deep market research, and complex real estate projects.",
    type: "website",
    url: "https://usemasterkey.com",
  },
  other: {
    generator: "Perplexity Computer",
    author: "Perplexity Computer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen font-body text-gray-900 bg-mk-cream antialiased">
        {children}
      </body>
    </html>
  );
}
