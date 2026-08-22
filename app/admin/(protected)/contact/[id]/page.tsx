import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ContactNotificationStatus } from "@/components/contact-notification-status";
import { ContactSubmissionActions } from "@/components/contact-submission-actions";
import { getCmsUser } from "@/lib/cms-auth";
import { getContactSubmission } from "@/lib/contact-service";

const topicLabels = {
  GENERAL: "Umum",
  ELECTRICAL_SOLUTIONS: "Solusi kelistrikan",
  PARTNERSHIP: "Kemitraan",
  PROCUREMENT: "Pengadaan",
  CAREER: "Karier",
  MEDIA: "Media & Informasi",
} as const;

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default async function AdminContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCmsUser();
  if (user?.role !== "admin") redirect("/admin");
  const { id } = await params;
  const submission = await getContactSubmission(id);
  if (!submission) notFound();
  const canResend = submission.notificationStatus === "FAILED" || submission.notificationStatus === "SKIPPED";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <header className="border-b border-[var(--line)] pb-8">
        <Link href="/admin/contact" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Kembali ke inbox</Link>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><h1 className="break-words font-display text-[clamp(2.25rem,6vw,4.25rem)] font-semibold leading-none tracking-[-0.04em]">{submission.name}</h1><p className="mt-4 break-all text-base text-[var(--muted)]">{submission.email}</p></div><ContactNotificationStatus status={submission.notificationStatus} /></div>
      </header>

      <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <article>
          <div className="grid gap-6 border-y border-[var(--line)] py-6 sm:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Topik</p><p className="mt-2 font-semibold">{topicLabels[submission.topic]}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Bahasa</p><p className="mt-2 font-semibold">{submission.locale === "en" ? "Inggris" : "Indonesia"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Telepon</p><p className="mt-2 font-semibold">{submission.phone ?? "Tidak diberikan"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Diterima</p><p className="mt-2 font-semibold tabular-nums">{formatDate(submission.createdAt)}</p></div>
          </div>
          <section aria-labelledby="message-title" className="py-9"><h2 id="message-title" className="font-display text-2xl font-semibold tracking-[-0.03em]">Pesan</h2><p className="mt-6 max-w-[72ch] whitespace-pre-wrap text-base leading-8 text-[var(--ink)]">{submission.message}</p></section>
          <ContactSubmissionActions submissionId={submission.id} isRead={Boolean(submission.readAt)} isArchived={Boolean(submission.archivedAt)} canResend={canResend} />
        </article>

        <aside aria-labelledby="delivery-title" className="border-t border-[var(--ink)]">
          <h2 id="delivery-title" className="py-5 font-display text-xl font-semibold tracking-[-0.03em]">Jejak pesan</h2>
          {[
            ["Persetujuan", formatDate(submission.consentAt)],
            ["Dibaca", formatDate(submission.readAt)],
            ["Percobaan email", String(submission.notificationAttempts)],
            ["Percobaan terakhir", formatDate(submission.lastNotificationAttemptAt)],
            ["Email terkirim", formatDate(submission.notifiedAt)],
            ["Batas retensi", formatDate(submission.expiresAt)],
            ["Arsip", formatDate(submission.archivedAt)],
          ].map(([label, value]) => <div key={label} className="border-b border-[var(--line)] py-4"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p><p className="mt-2 text-sm leading-6 tabular-nums">{value}</p></div>)}
        </aside>
      </div>
    </main>
  );
}
