import Link from "next/link";

import { AdminMediaEditor } from "@/components/admin-media-editor";
import { requireCmsUser } from "@/lib/cms-auth";

export default async function NewMediaArticlePage() {
  const user = await requireCmsUser();
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="border-b border-[var(--line)] pb-8">
        <Link href="/admin/media" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Kembali ke Media</Link>
        <h1 className="mt-7 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em]">Tulis draft</h1>
      </div>
      <div className="pt-8"><AdminMediaEditor article={null} role={user.role} /></div>
    </main>
  );
}
