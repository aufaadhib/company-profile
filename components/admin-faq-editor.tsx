"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { faqWorkflowAction, saveFaqItemAction, type FaqActionState } from "@/app/actions/faq";
import { AdminStatus } from "@/components/admin-status";
import type { CmsRole } from "@/lib/auth-permissions";
import type { FaqEditorData } from "@/lib/faq-service";
import type { FaqLocale, FaqRevisionPayload } from "@/lib/faq-validation";

const initialActionState: FaqActionState = { status: "idle" };
const emptyPayload: FaqRevisionPayload = {
  translations: {
    id: { question: "", answer: "" },
    en: { question: "", answer: "" },
  },
};

type CategoryOption = { id: string; titleId: string; titleEn: string };

function FieldError({ error }: { error?: string }) {
  return error ? <p className="mt-2 text-sm font-semibold text-[var(--accent-strong)]">{error}</p> : null;
}

function WorkflowPanel({ item, role }: { item: FaqEditorData; role: CmsRole }) {
  const [state, action, pending] = useActionState(faqWorkflowAction, initialActionState);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="faqItemId" value={item.id} />
      <input type="hidden" name="lockVersion" value={item.lockVersion} />
      {state.status === "error" ? <p role="alert" className="border border-[var(--accent)] p-3 text-sm leading-6 text-[var(--accent-strong)]">{state.message}</p> : null}
      {(item.status === "draft" || item.status === "changes") ? <button name="intent" value="review" disabled={pending} className="min-h-11 w-full border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">Ajukan review</button> : null}
      {role === "admin" && item.status === "review" ? <button name="intent" value="publish" disabled={pending} className="min-h-11 w-full bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-50">Terbitkan</button> : null}
      {role === "admin" && item.publishedRevisionId && item.status !== "archived" ? <button name="intent" value="unpublish" disabled={pending} className="min-h-11 w-full border border-[var(--line)] px-4 text-sm font-semibold hover:border-[var(--ink)] disabled:opacity-50">Batalkan terbit</button> : null}
      {role === "admin" && item.status !== "archived" ? <button name="intent" value="archive" disabled={pending} className="min-h-11 w-full px-4 text-sm font-semibold text-[var(--accent-strong)] hover:bg-white disabled:opacity-50">Arsipkan</button> : null}
      {role === "admin" && item.status === "archived" ? <button name="intent" value="restore" disabled={pending} className="min-h-11 w-full border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">Pulihkan FAQ</button> : null}
    </form>
  );
}

export function AdminFaqEditor({ item, categories, role }: { item: FaqEditorData | null; categories: CategoryOption[]; role: CmsRole }) {
  const payload = item?.payload ?? emptyPayload;
  const [activeLocale, setActiveLocale] = useState<FaqLocale>("id");
  const [translations, setTranslations] = useState(payload.translations);
  const [saveState, saveAction, saving] = useActionState(saveFaqItemAction, initialActionState);
  const completeness = {
    id: translations.id.question.length >= 8 && translations.id.answer.length >= 20,
    en: translations.en.question.length >= 8 && translations.en.answer.length >= 20,
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <form id="faq-save-form" action={saveAction} className="min-w-0 space-y-8">
        <input type="hidden" name="faqItemId" value={item?.id ?? ""} />
        <input type="hidden" name="lockVersion" value={item?.lockVersion ?? 0} />

        <section aria-label="Kelengkapan FAQ" className="border-y border-[var(--ink)] py-5">
          <div className="grid grid-cols-3 gap-4">
            {[["01", "Indonesia", completeness.id], ["02", "English", completeness.en], ["03", item?.status === "published" ? "Published" : item?.status === "review" ? "Review" : "Draft", item?.status === "published"]].map(([number, label, complete]) => (
              <div key={String(number)}>
                <span className={`block size-2 rounded-full ${complete ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`} />
                <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{number} / {label}</span>
              </div>
            ))}
          </div>
        </section>

        {saveState.status === "error" ? <div role="alert" className="border border-[var(--accent)] bg-white p-4 text-sm text-[var(--accent-strong)]">{saveState.message}</div> : null}

        <label className="block border-b border-[var(--line)] pb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Kategori</span>
          <select name="categoryId" defaultValue={item?.categoryId ?? ""} required className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]">
            <option value="" disabled>Pilih kategori</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.titleId} / {category.titleEn}</option>)}
          </select>
          <FieldError error={saveState.fieldErrors?.categoryId} />
        </label>

        <section>
          <div className="flex border-b border-[var(--line)]" role="tablist" aria-label="Bahasa FAQ">
            {(["id", "en"] as const).map((locale) => <button key={locale} type="button" role="tab" aria-selected={activeLocale === locale} onClick={() => setActiveLocale(locale)} className={`min-h-12 flex-1 border-b-2 px-4 text-sm font-semibold ${activeLocale === locale ? "border-[var(--accent)] text-[var(--ink)]" : "border-transparent text-[var(--muted)]"}`}>{locale === "id" ? "Indonesia" : "English"}</button>)}
          </div>
          {(["id", "en"] as const).map((locale) => (
            <div key={locale} hidden={activeLocale !== locale} role="tabpanel" className="space-y-6 pt-7">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Pertanyaan {locale === "id" ? "Indonesia" : "English"}</span>
                <textarea name={`${locale}Question`} value={translations[locale].question} onChange={(event) => setTranslations((current) => ({ ...current, [locale]: { ...current[locale], question: event.target.value } }))} maxLength={240} rows={3} className="mt-2 w-full resize-y border border-[var(--line)] bg-white p-4 text-lg font-semibold leading-7 outline-none focus:border-[var(--accent)]" />
                <FieldError error={saveState.fieldErrors?.[`${locale}.question`]} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Jawaban</span>
                <textarea name={`${locale}Answer`} value={translations[locale].answer} onChange={(event) => setTranslations((current) => ({ ...current, [locale]: { ...current[locale], answer: event.target.value } }))} maxLength={8000} rows={12} className="mt-2 w-full resize-y border border-[var(--line)] bg-white p-4 text-base leading-7 outline-none focus:border-[var(--accent)]" />
                <p className="mt-2 text-xs text-[var(--muted)]">Plain text. Baris baru akan dipertahankan di halaman publik.</p>
                <FieldError error={saveState.fieldErrors?.[`${locale}.answer`]} />
              </label>
            </div>
          ))}
        </section>
      </form>

      <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
        <div className="border border-[var(--line)] bg-white p-5">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Status</p>{item ? <AdminStatus status={item.status} /> : null}</div>
          <button type="submit" form="faq-save-form" disabled={saving || item?.status === "archived" || categories.length === 0} className="mt-5 min-h-12 w-full bg-[var(--ink)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50">{saving ? "Menyimpan…" : "Simpan draft"}</button>
          {categories.length === 0 ? <p className="mt-3 text-sm leading-6 text-[var(--accent-strong)]">Buat kategori aktif sebelum menulis FAQ.</p> : null}
          <Link href="/admin/faq/categories" className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-[var(--line)] px-4 text-sm font-semibold hover:border-[var(--ink)]">Kelola kategori</Link>
        </div>
        {item ? <div className="border-t border-[var(--ink)] pt-5"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Alur publikasi</p><WorkflowPanel item={item} role={role} /></div> : null}
      </aside>
    </div>
  );
}
