import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteContent } from "@/content/site-content";
import { lexend, sourceSans } from "@/app/fonts";
import "./globals.css";

export default function NotFound() {
  return (
    <div className={`${lexend.variable} ${sourceSans.variable} font-sans text-[var(--ink)]`}>
      <SiteHeader locale="id" content={siteContent.id} solid />
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-white px-6 pt-20 text-center sm:px-10">
        <section aria-labelledby="not-found-title" className="max-w-3xl">
          <p className="font-display text-[clamp(4.5rem,10vw,7.5rem)] font-semibold leading-none tracking-[-0.08em] text-[var(--accent)]">
            404
          </p>
          <h1 id="not-found-title" className="mt-6 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight tracking-[-0.05em] text-[var(--ink)]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Halaman yang Anda cari mungkin telah dihapus atau tidak tersedia untuk sementara.
          </p>
          <Link
            href="/id"
            className="mx-auto mt-9 inline-flex min-h-14 items-center justify-center gap-4 rounded-full border border-[var(--accent)] px-8 text-sm font-semibold uppercase tracking-[0.04em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            Kembali ke halaman utama
            <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      </main>
      <SiteFooter locale="id" content={siteContent.id} />
    </div>
  );
}
