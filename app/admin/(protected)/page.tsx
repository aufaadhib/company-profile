import Link from "next/link";

import { AdminStatus } from "@/components/admin-status";
import { getCmsUser } from "@/lib/cms-auth";
import { getCmsDashboardData } from "@/lib/cms-service";
import { getContactDashboardCounts } from "@/lib/contact-service";
import { getCmsFaqItems } from "@/lib/faq-service";

const activityLabels: Record<string, string> = {
  ARTICLE_CREATED: "membuat artikel",
  DRAFT_SAVED: "menyimpan draft",
  REVIEW_REQUESTED: "mengajukan review",
  ARTICLE_PUBLISHED: "menerbitkan artikel",
  ARTICLE_UNPUBLISHED: "membatalkan publikasi",
  ARTICLE_ARCHIVED: "mengarsipkan artikel",
  ARTICLE_RESTORED: "memulihkan artikel",
  EDITOR_INVITED: "mengundang Editor",
  EDITOR_DISABLED: "menonaktifkan Editor",
  EDITOR_ENABLED: "mengaktifkan Editor",
  EDITOR_INVITE_RESENT: "mengirim ulang akses Editor",
  CONTACT_SETTINGS_UPDATED: "memperbarui pengaturan Contact",
  CONTACT_READ: "menandai pesan Contact sudah dibaca",
  CONTACT_UNREAD: "menandai pesan Contact belum dibaca",
  CONTACT_ARCHIVE: "mengarsipkan pesan Contact",
  CONTACT_RESTORE: "memulihkan pesan Contact",
  CONTACT_NOTIFICATION_RESENT: "mengirim ulang notifikasi Contact",
  CONTACT_NOTIFICATION_RETRY_FAILED: "gagal mengirim ulang notifikasi Contact",
  CONTACT_TEST_EMAIL_SENT: "mengirim email uji Contact",
  CONTACT_TEST_EMAIL_FAILED: "gagal mengirim email uji Contact",
  FAQ_CREATED: "membuat FAQ",
  FAQ_DRAFT_SAVED: "menyimpan draft FAQ",
  FAQ_REVIEW_REQUESTED: "mengajukan review FAQ",
  FAQ_PUBLISHED: "menerbitkan FAQ",
  FAQ_UNPUBLISHED: "membatalkan publikasi FAQ",
  FAQ_ARCHIVED: "mengarsipkan FAQ",
  FAQ_RESTORED: "memulihkan FAQ",
  FAQ_REORDERED: "mengubah urutan FAQ",
  FAQ_CATEGORY_CREATED: "membuat kategori FAQ",
  FAQ_CATEGORY_UPDATED: "memperbarui kategori FAQ",
  FAQ_CATEGORY_ARCHIVED: "menonaktifkan kategori FAQ",
  FAQ_CATEGORY_RESTORED: "mengaktifkan kategori FAQ",
  FAQ_CATEGORY_REORDERED: "mengubah urutan kategori FAQ",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const [data, user, faqItems] = await Promise.all([getCmsDashboardData(), getCmsUser(), getCmsFaqItems()]);
  const contactCounts = user?.role === "admin" ? await getContactDashboardCounts() : null;
  const metrics: Array<[string, number]> = [
    ["Menunggu review", data.counts.review],
    ["Draft aktif", data.counts.draft],
    ["Published", data.counts.published],
    ["Editor aktif", data.editorCount],
    ["FAQ menunggu review", faqItems.filter((item) => item.status === "review").length],
    ["FAQ published", faqItems.filter((item) => item.status === "published" || item.status === "changes").length],
  ];
  if (contactCounts) metrics.push(["Pesan belum dibaca", contactCounts.unread], ["Email Contact gagal", contactCounts.failed]);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.04em]">Dashboard</h1>
        </div>
        <Link href="/admin/media/new" className="inline-flex min-h-12 items-center justify-center bg-[var(--ink)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Tulis artikel</Link>
      </div>

      <section aria-label="Ringkasan dashboard" className="grid border-b border-[var(--line)] sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value], index) => (
          <div key={String(label)} className={`py-7 sm:px-6 ${index > 0 ? "sm:border-l sm:border-[var(--line)]" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
            <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] tabular-nums">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-12 py-10 xl:grid-cols-[1.35fr_.65fr] xl:gap-16">
        <section aria-labelledby="queue-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="queue-title" className="font-display text-2xl font-semibold tracking-[-0.04em]">Antrean konten</h2>
            <Link href="/admin/media" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Lihat semua</Link>
          </div>
          <div className="mt-6 border-t border-[var(--ink)]">
            {data.articles.slice(0, 8).map((article) => (
              <Link key={article.id} href={`/admin/media/${article.id}`} className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-5 border-b border-[var(--line)] py-4 transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:grid-cols-[1fr_auto_auto]">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{article.title}</p>
                  <p className="mt-1 truncate text-sm text-[var(--muted)]">/{article.slug}</p>
                </div>
                <AdminStatus status={article.status} />
                <span className="hidden text-sm text-[var(--muted)] sm:block">{formatDate(article.updatedAt)}</span>
              </Link>
            ))}
            {data.articles.length === 0 ? <p className="border-b border-[var(--line)] py-10 text-[var(--muted)]">Belum ada artikel. Mulai dari artikel pertama.</p> : null}
          </div>
        </section>

        <section aria-labelledby="activity-title">
          <h2 id="activity-title" className="font-display text-2xl font-semibold tracking-[-0.04em]">Aktivitas</h2>
          <ol className="mt-6 border-t border-[var(--ink)]">
            {data.activity.map((entry) => (
              <li key={entry.id} className="border-b border-[var(--line)] py-4">
                <p className="text-sm leading-6"><strong>{entry.actor}</strong> {activityLabels[entry.action] ?? entry.action.toLowerCase()}.</p>
                <time className="mt-1 block text-xs text-[var(--muted)]">{formatDate(entry.createdAt)}</time>
              </li>
            ))}
            {data.activity.length === 0 ? <li className="border-b border-[var(--line)] py-10 text-sm text-[var(--muted)]">Aktivitas akan muncul setelah konten mulai dikelola.</li> : null}
          </ol>
        </section>
      </div>
    </main>
  );
}
