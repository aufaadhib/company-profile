"use client";

import { useActionState } from "react";

import {
  faqCategoryStateAction,
  reorderFaqCategoryAction,
  saveFaqCategoryAction,
  type FaqActionState,
} from "@/app/actions/faq";
import type { FaqCategoryAdminData } from "@/lib/faq-service";

const initialState: FaqActionState = { status: "idle" };

function CategoryForm({ category }: { category?: FaqCategoryAdminData }) {
  const [state, action, pending] = useActionState(saveFaqCategoryAction, initialState);
  return (
    <form action={action} className="grid gap-4 border-b border-[var(--line)] py-6 lg:grid-cols-[1fr_1fr_.8fr_auto] lg:items-start">
      <input type="hidden" name="categoryId" value={category?.id ?? ""} />
      <input type="hidden" name="lockVersion" value={category?.lockVersion ?? 0} />
      <label><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Indonesia</span><input name="titleId" defaultValue={category?.titleId ?? ""} maxLength={100} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" /><span className="mt-1 block text-xs text-[var(--accent-strong)]">{state.fieldErrors?.titleId}</span></label>
      <label><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">English</span><input name="titleEn" defaultValue={category?.titleEn ?? ""} maxLength={100} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" /><span className="mt-1 block text-xs text-[var(--accent-strong)]">{state.fieldErrors?.titleEn}</span></label>
      <label><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Slug filter</span><input name="slug" defaultValue={category?.slug ?? ""} maxLength={100} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" /><span className="mt-1 block text-xs text-[var(--accent-strong)]">{state.fieldErrors?.slug}</span></label>
      <button disabled={pending} className="min-h-12 bg-[var(--ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50 lg:mt-[1.65rem]">{pending ? "Menyimpan…" : category ? "Simpan" : "Tambah"}</button>
      {state.status === "error" ? <p role="alert" className="text-sm text-[var(--accent-strong)] lg:col-span-4">{state.message}</p> : null}
    </form>
  );
}

function CategoryActions({ category, first, last }: { category: FaqCategoryAdminData; first: boolean; last: boolean }) {
  const [state, action, pending] = useActionState(faqCategoryStateAction, initialState);
  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 lg:justify-end lg:pt-0">
      <form action={reorderFaqCategoryAction}><input type="hidden" name="categoryId" value={category.id} /><button name="direction" value="up" disabled={first} className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold disabled:opacity-30" aria-label={`Naikkan kategori ${category.titleId}`}>Naik</button></form>
      <form action={reorderFaqCategoryAction}><input type="hidden" name="categoryId" value={category.id} /><button name="direction" value="down" disabled={last} className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold disabled:opacity-30" aria-label={`Turunkan kategori ${category.titleId}`}>Turun</button></form>
      <form action={action}>
        <input type="hidden" name="categoryId" value={category.id} /><input type="hidden" name="lockVersion" value={category.lockVersion} />
        <button name="intent" value={category.archived ? "restore" : "archive"} disabled={pending} className={`min-h-11 px-3 text-sm font-semibold ${category.archived ? "border border-[var(--ink)]" : "text-[var(--accent-strong)]"}`}>{category.archived ? "Aktifkan" : "Nonaktifkan"}</button>
      </form>
      {state.status === "error" ? <p role="alert" className="basis-full text-sm text-[var(--accent-strong)]">{state.message}</p> : null}
    </div>
  );
}

export function AdminFaqCategories({ categories }: { categories: FaqCategoryAdminData[] }) {
  return (
    <div>
      <section aria-labelledby="new-category-title" className="border-t border-[var(--ink)]">
        <h2 id="new-category-title" className="pt-6 font-display text-2xl font-semibold tracking-[-0.04em]">Kategori baru</h2>
        <CategoryForm />
      </section>
      <section aria-labelledby="category-list-title" className="mt-12">
        <h2 id="category-list-title" className="font-display text-2xl font-semibold tracking-[-0.04em]">Urutan kategori</h2>
        <div className="mt-5 border-t border-[var(--ink)]">
          {categories.map((category, index) => (
            <article key={category.id} className="border-b border-[var(--line)] py-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div><p className="font-semibold">{String(index + 1).padStart(2, "0")} / {category.titleId}</p><p className="mt-1 text-sm text-[var(--muted)]">{category.titleEn} · {category.itemCount} FAQ · {category.archived ? "Nonaktif" : "Aktif"}</p></div>
                <CategoryActions category={category} first={index === 0} last={index === categories.length - 1} />
              </div>
              <details className="mt-4"><summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm font-semibold text-[var(--muted)] marker:content-none">Edit detail</summary><CategoryForm category={category} /></details>
            </article>
          ))}
          {categories.length === 0 ? <p className="border-b border-[var(--line)] py-10 text-[var(--muted)]">Belum ada kategori FAQ.</p> : null}
        </div>
      </section>
    </div>
  );
}
