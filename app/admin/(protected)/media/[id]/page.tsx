import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminMediaEditor } from "@/components/admin-media-editor";
import { requireCmsUser } from "@/lib/cms-auth";
import { getCmsArticle } from "@/lib/cms-service";

export default async function EditMediaArticlePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; updated?: string }> }) {
  const { id } = await params;
  const [{ saved, updated }, user, article] = await Promise.all([searchParams, requireCmsUser(), getCmsArticle(id)]);
  if (!article) notFound();

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="border-b border-[var(--line)] pb-8">
        <Link href="/admin/media" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Kembali ke Media</Link>
        <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">{article.payload.translations.id.title || "Draft tanpa judul"}</h1>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Revision {article.lockVersion}</p>
        {saved || updated ? <p role="status" className="mt-5 border border-[#176b42] p-4 text-sm font-semibold text-[#176b42]">{saved ? "Draft tersimpan." : "Status artikel diperbarui."}</p> : null}
      </div>
      <div className="pt-8"><AdminMediaEditor article={article} role={user.role} /></div>
    </main>
  );
}
