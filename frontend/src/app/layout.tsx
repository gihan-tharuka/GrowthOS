import type { Metadata } from "next";
import "./globals.css";

import { SiteNav } from "@/components/layout/site-nav";

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
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
