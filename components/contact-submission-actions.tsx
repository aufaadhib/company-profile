"use client";

import { useActionState } from "react";

import { contactSubmissionAction, type ContactAdminActionState } from "@/app/actions/contact-admin";

const initialState: ContactAdminActionState = { status: "idle" };

export function ContactSubmissionActions({
  submissionId,
  isRead,
  isArchived,
  canResend,
}: {
  submissionId: string;
  isRead: boolean;
  isArchived: boolean;
  canResend: boolean;
}) {
  const [state, action, pending] = useActionState(contactSubmissionAction, initialState);
  return (
    <form action={action} aria-busy={pending} className="border-t border-[var(--ink)] pt-5">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div className="flex flex-wrap gap-3">
        {isArchived ? (
          <button name="intent" value="restore" disabled={pending} className="min-h-11 bg-[var(--ink)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50">Pulihkan pesan</button>
        ) : (
          <>
            <button name="intent" value={isRead ? "unread" : "read"} disabled={pending} className="min-h-11 border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-white disabled:opacity-50">{isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}</button>
            {canResend ? <button name="intent" value="resend" disabled={pending} className="min-h-11 bg-[var(--ink)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50">Kirim notifikasi</button> : null}
            <button name="intent" value="archive" disabled={pending} className="min-h-11 px-4 text-sm font-semibold text-[var(--accent-strong)] hover:bg-white disabled:opacity-50">Arsipkan</button>
          </>
        )}
      </div>
      <p className={`mt-4 min-h-5 text-sm ${state.status === "error" ? "text-[var(--accent-strong)]" : "text-[#176b42]"}`} role="status" aria-live="polite">{pending ? "Memproses…" : state.message}</p>
    </form>
  );
}
