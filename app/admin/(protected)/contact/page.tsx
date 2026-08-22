import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminContactTabs } from "@/components/admin-contact-tabs";
import { ContactNotificationStatus } from "@/components/contact-notification-status";
import { getCmsUser } from "@/lib/cms-auth";
import { getContactInbox, type ContactInboxFilters, type ContactInboxState } from "@/lib/contact-service";
import { contactTopics, type ContactTopicValue } from "@/lib/contact-validation";

const stateOptions: Array<{ value: ContactInboxState; label: string }> = [
  { value: "all", label: "Inbox aktif" },
  { value: "unread", label: "Belum dibaca" },
  { value: "sent", label: "Email terkirim" },
  { value: "failed", label: "Email gagal" },
  { value: "skipped", label: "Email dilewati" },
  { value: "archived", label: "Diarsipkan" },
];

const topicLabels: Record<ContactTopicValue, string> = {
  GENERAL: "Umum",
  ELECTRICAL_SOLUTIONS: "Solusi kelistrikan",
  PARTNERSHIP: "Kemitraan",
  PROCUREMENT: "Pengadaan",
  CAREER: "Karier",
  MEDIA: "Media & Informasi",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function parseFilters(params: { state?: string; topic?: string; q?: string; page?: string }): ContactInboxFilters {
  const state = stateOptions.some((option) => option.value === params.state) ? params.state as ContactInboxState : "all";
  const topic = contactTopics.includes(params.topic as ContactTopicValue) ? params.topic as ContactTopicValue : "all";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  return { state, topic, query: (params.q ?? "").trim().slice(0, 100), page };
}

function pageHref(filters: ContactInboxFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.state !== "all") params.set("state", filters.state);
  if (filters.topic !== "all") params.set("topic", filters.topic);
  if (filters.query) params.set("q", filters.query);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/contact?${query}` : "/admin/contact";
}

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; topic?: string; q?: string; page?: string }>;
}) {
  const user = await getCmsUser();
  if (user?.role !== "admin") redirect("/admin");
  const filters = parseFilters(await searchParams);
  const inbox = await getContactInbox(filters);
  if (filters.page > inbox.pageCount) redirect(pageHref(filters, inbox.pageCount));

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <header className="border-b border-[var(--line)] pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.04em]">Kontak</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">Tinjau pesan masuk, status notifikasi email, dan kanal Contact yang tampil pada website.</p></div>
          <Link href="/admin/contact/settings" className="inline-flex min-h-12 items-center justify-center border border-[var(--ink)] px-5 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white">Atur Contact</Link>
        </div>
        <AdminContactTabs active="inbox" />
      </header>

      <section aria-label="Ringkasan Contact" className="grid border-b border-[var(--line)] sm:grid-cols-3">
        {[["Belum dibaca", inbox.counts.unread], ["Email gagal", inbox.counts.failed], ["Hasil filter", inbox.total]].map(([label, value], index) => (
          <div key={String(label)} className={`py-6 ${index > 0 ? "sm:border-l sm:border-[var(--line)] sm:px-6" : ""}`}><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p><p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p></div>
        ))}
      </section>

      <form method="get" className="grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[minmax(0,1fr)_13rem_13rem_auto] md:items-end">
        <label className="text-sm font-semibold">Cari nama atau email<input name="q" defaultValue={filters.query} maxLength={100} className="mt-2 min-h-11 w-full border border-[var(--line)] bg-white px-3 outline-none focus:border-[var(--accent)]" /></label>
        <label className="text-sm font-semibold">Status<select name="state" defaultValue={filters.state} className="mt-2 min-h-11 w-full border border-[var(--line)] bg-white px-3 outline-none focus:border-[var(--accent)]">{stateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label className="text-sm font-semibold">Topik<select name="topic" defaultValue={filters.topic} className="mt-2 min-h-11 w-full border border-[var(--line)] bg-white px-3 outline-none focus:border-[var(--accent)]"><option value="all">Semua topik</option>{contactTopics.map((topic) => <option key={topic} value={topic}>{topicLabels[topic]}</option>)}</select></label>
        <button className="min-h-11 bg-[var(--ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent)]">Terapkan</button>
      </form>

      <section aria-label="Pesan Contact" className="py-8">
        <div className="hidden grid-cols-[1.2fr_1fr_.8fr_auto] gap-5 border-y border-[var(--ink)] py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] md:grid"><span>Pengirim</span><span>Topik</span><span>Diterima</span><span>Status</span></div>
        <div className="border-t border-[var(--ink)] md:border-t-0">
          {inbox.items.map((item) => (
            <Link key={item.id} href={`/admin/contact/${item.id}`} className={`grid min-h-24 gap-3 border-b border-[var(--line)] py-5 transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:grid-cols-[1.2fr_1fr_.8fr_auto] md:items-center md:gap-5 ${item.readAt ? "text-[var(--muted)]" : "text-[var(--ink)]"}`}>
              <span className="min-w-0"><span className="flex items-center gap-3"><span className={`size-2 shrink-0 rounded-full ${item.readAt ? "bg-[var(--line)]" : "bg-[var(--accent)]"}`} aria-hidden="true" /><strong className="truncate">{item.name}</strong></span><span className="mt-1 block truncate pl-5 text-sm">{item.email}</span></span>
              <span className="text-sm font-semibold">{topicLabels[item.topic]}</span>
              <time className="text-sm tabular-nums">{formatDate(item.createdAt)}</time>
              <ContactNotificationStatus status={item.notificationStatus} />
            </Link>
          ))}
          {inbox.items.length === 0 ? <div className="border-b border-[var(--line)] py-16"><h2 className="font-display text-2xl font-semibold">Tidak ada pesan pada tampilan ini.</h2><p className="mt-3 text-sm text-[var(--muted)]">Ubah filter atau tunggu submission Contact berikutnya.</p></div> : null}
        </div>

        {inbox.pageCount > 1 ? <nav aria-label="Pagination inbox" className="mt-8 flex items-center justify-between gap-4"><Link aria-disabled={inbox.page <= 1} tabIndex={inbox.page <= 1 ? -1 : undefined} href={pageHref(filters, Math.max(1, inbox.page - 1))} className={`inline-flex min-h-11 items-center border border-[var(--line)] px-4 text-sm font-semibold ${inbox.page <= 1 ? "pointer-events-none opacity-40" : "hover:border-[var(--ink)]"}`}>Sebelumnya</Link><span className="text-sm tabular-nums text-[var(--muted)]">Halaman {inbox.page} dari {inbox.pageCount}</span><Link aria-disabled={inbox.page >= inbox.pageCount} tabIndex={inbox.page >= inbox.pageCount ? -1 : undefined} href={pageHref(filters, Math.min(inbox.pageCount, inbox.page + 1))} className={`inline-flex min-h-11 items-center border border-[var(--line)] px-4 text-sm font-semibold ${inbox.page >= inbox.pageCount ? "pointer-events-none opacity-40" : "hover:border-[var(--ink)]"}`}>Berikutnya</Link></nav> : null}
      </section>
    </main>
  );
}
