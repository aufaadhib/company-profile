import Link from "next/link";

import { reorderFaqItemAction } from "@/app/actions/faq";
import { AdminStatus } from "@/components/admin-status";
import { requireCmsUser } from "@/lib/cms-auth";
import { getCmsFaqItems } from "@/lib/faq-service";

export default async function AdminFaqPage() {
  const [items, user] = await Promise.all([getCmsFaqItems(), requireCmsUser()]);
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Knowledge desk</p><h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.04em]">FAQ</h1></div>
        <div className="flex flex-wrap gap-3">
          {user.role === "admin" ? <Link href="/admin/faq/categories" className="inline-flex min-h-12 items-center justify-center border border-[var(--ink)] px-5 text-sm font-semibold hover:bg-white">Kelola kategori</Link> : null}
          <Link href="/admin/faq/new" className="inline-flex min-h-12 items-center justify-center bg-[var(--ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent)]">Tulis FAQ</Link>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto border-t border-[var(--ink)]">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead><tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"><th className="py-4 pr-6">Pertanyaan</th><th className="px-4 py-4">Kategori</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Urutan</th><th className="py-4 pl-4 text-right">Aksi</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--line)]">
                <td className="max-w-xl py-5 pr-6"><p className="font-semibold leading-6">{item.question}</p><p className="mt-1 text-xs text-[var(--muted)]">Diperbarui {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.updatedAt))}</p></td>
                <td className="px-4 py-5 text-sm text-[var(--muted)]">{item.categoryTitle}</td>
                <td className="px-4 py-5"><AdminStatus status={item.status} /></td>
                <td className="px-4 py-5">
                  {user.role === "admin" && (item.status === "published" || item.status === "changes") ? <div className="flex gap-1">
                    <form action={reorderFaqItemAction}><input type="hidden" name="faqItemId" value={item.id} /><button name="direction" value="up" className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold">Naik</button></form>
                    <form action={reorderFaqItemAction}><input type="hidden" name="faqItemId" value={item.id} /><button name="direction" value="down" className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold">Turun</button></form>
                  </div> : <span className="text-sm text-[var(--muted)]">{item.sortOrder + 1}</span>}
                </td>
                <td className="py-5 pl-4 text-right"><Link href={`/admin/faq/${item.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold hover:text-[var(--accent)]">Buka</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? <p className="border-b border-[var(--line)] py-12 text-[var(--muted)]">Belum ada FAQ. Admin perlu membuat kategori sebelum FAQ pertama.</p> : null}
      </div>
    </main>
  );
}
