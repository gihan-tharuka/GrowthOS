import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowthOS",
  description: "A personal operating system for intentional growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
