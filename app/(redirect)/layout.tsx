import type { ReactNode } from "react";

import { lexend, sourceSans } from "@/app/fonts";
import "../globals.css";

export default function RedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${lexend.variable} ${sourceSans.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--paper)] font-sans text-[var(--ink)]">{children}</body>
    </html>
  );
}
