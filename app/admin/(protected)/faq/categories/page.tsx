import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminFaqCategories } from "@/components/admin-faq-categories";
import { getCmsUser } from "@/lib/cms-auth";
import { getFaqCategoriesAdmin } from "@/lib/faq-service";

export default async function FaqCategoriesPage({ searchParams }: { searchParams: Promise<{ saved?: string; updated?: string }> }) {
  const user = await getCmsUser();
  if (user?.role !== "admin") redirect("/admin/faq");
  const [{ saved, updated }, categories] = await Promise.all([searchParams, getFaqCategoriesAdmin()]);
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="border-b border-[var(--line)] pb-8">
        <Link href="/admin/faq" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Kembali ke FAQ</Link>
        <h1 className="mt-7 font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">Kategori FAQ</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">Kategori nonaktif beserta seluruh FAQ di dalamnya langsung disembunyikan dari website publik.</p>
        {saved || updated ? <p role="status" className="mt-5 border border-[#176b42] p-4 text-sm font-semibold text-[#176b42]">{saved ? "Kategori tersimpan." : "Status kategori diperbarui."}</p> : null}
      </div>
      <div className="pt-8"><AdminFaqCategories categories={categories} /></div>
    </main>
  );
}
