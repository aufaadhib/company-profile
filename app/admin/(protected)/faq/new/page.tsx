import Link from "next/link";

import { AdminFaqEditor } from "@/components/admin-faq-editor";
import { requireCmsUser } from "@/lib/cms-auth";
import { getActiveFaqCategories } from "@/lib/faq-service";

export default async function NewFaqPage() {
  const [user, categories] = await Promise.all([requireCmsUser(), getActiveFaqCategories()]);
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="border-b border-[var(--line)] pb-8">
        <Link href="/admin/faq" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Kembali ke FAQ</Link>
        <h1 className="mt-7 font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">FAQ baru</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">Simpan pertanyaan sebagai draft. Kedua bahasa wajib lengkap sebelum FAQ dapat diajukan untuk review.</p>
      </div>
      <div className="pt-8"><AdminFaqEditor item={null} categories={categories} role={user.role} /></div>
    </main>
  );
}
