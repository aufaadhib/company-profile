import Link from "next/link";

import { AdminStatus } from "@/components/admin-status";
import { getCmsMediaArticles } from "@/lib/cms-service";

export default async function AdminMediaPage() {
  const articles = await getCmsMediaArticles();

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.04em]">Artikel</h1>
        </div>
        <Link href="/admin/media/new" className="inline-flex min-h-12 items-center justify-center bg-[var(--ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Tulis artikel</Link>
      </div>

      <div className="mt-10 overflow-x-auto border-t border-[var(--ink)]">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead><tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"><th className="py-4 pr-6">Konten</th><th className="px-4 py-4">Kategori</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Sorotan</th><th className="py-4 pl-4 text-right">Aksi</th></tr></thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-[var(--line)]">
                <td className="py-5 pr-6"><p className="font-semibold">{article.title}</p><p className="mt-1 text-sm text-[var(--muted)]">/{article.slug}</p></td>
                <td className="px-4 py-5 text-sm capitalize text-[var(--muted)]">{article.category}</td>
                <td className="px-4 py-5"><AdminStatus status={article.status} /></td>
                <td className="px-4 py-5 text-sm text-[var(--muted)]">{article.isFeatured ? "Ya" : "—"}</td>
                <td className="py-5 pl-4 text-right"><Link href={`/admin/media/${article.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Buka</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 ? <p className="border-b border-[var(--line)] py-12 text-[var(--muted)]">Belum ada artikel Media.</p> : null}
      </div>
    </main>
  );
}
