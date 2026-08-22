"use client";

import { useActionState } from "react";

import { inviteEditorAction, type AccountActionState } from "@/app/actions/cms";

const initialState: AccountActionState = { status: "idle" };

export function InviteEditorForm() {
  const [state, action, pending] = useActionState(inviteEditorAction, initialState);
  return (
    <form action={action} className="grid gap-5 border-t border-[var(--ink)] pt-6 sm:grid-cols-2" aria-busy={pending}>
      <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Nama Editor</span><input name="name" required minLength={2} maxLength={100} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" />{state.fieldErrors?.name ? <span className="mt-2 block text-sm text-[var(--accent-strong)]">{state.fieldErrors.name}</span> : null}</label>
      <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Email</span><input name="email" type="email" required maxLength={254} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" />{state.fieldErrors?.email ? <span className="mt-2 block text-sm text-[var(--accent-strong)]">{state.fieldErrors.email}</span> : null}</label>
      {state.message ? <p role="alert" className="border border-[var(--accent)] p-3 text-sm text-[var(--accent-strong)] sm:col-span-2">{state.message}</p> : null}
      <button disabled={pending} className="min-h-12 bg-[var(--ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50 sm:col-span-2 sm:w-fit">{pending ? "Mengirim…" : "Undang Editor"}</button>
    </form>
  );
}
