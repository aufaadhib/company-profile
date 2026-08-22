import type { Metadata } from "next";

import { lexend, sourceSans } from "@/app/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Afana Control",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${lexend.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

