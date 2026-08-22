"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

import { mediaWorkflowAction, saveMediaArticleAction, type CmsActionState } from "@/app/actions/cms";
import { AdminStatus } from "@/components/admin-status";
import type { CmsRole } from "@/lib/auth-permissions";
import type { CmsArticleEditorData } from "@/lib/cms-service";
import type { CmsLocale, MediaRevisionPayload } from "@/lib/cms-validation";

const initialActionState: CmsActionState = { status: "idle" };

const emptyPayload: MediaRevisionPayload = {
  category: "news",
  publishedAt: "",
  isFeatured: false,
  translations: {
    id: { title: "", excerpt: "", imageAlt: "", body: [""] },
    en: { title: "", excerpt: "", imageAlt: "", body: [""] },
  },
};

type AssetState = { id: string; url: string; originalName: string } | null;

function FieldError({ error }: { error?: string }) {
  return error ? <p className="mt-2 text-sm font-semibold text-[var(--accent-strong)]">{error}</p> : null;
}

function ParagraphEditor({ locale, paragraphs, onChange }: { locale: CmsLocale; paragraphs: string[]; onChange: (paragraphs: string[]) => void }) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <div key={`${locale}-${index}`} className="border border-[var(--line)] bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Paragraf {index + 1}</span>
            <div className="flex gap-1">
              <button type="button" disabled={index === 0} onClick={() => { const next = [...paragraphs]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }} className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold disabled:opacity-30">Naik</button>
              <button type="button" disabled={index === paragraphs.length - 1} onClick={() => { const next = [...paragraphs]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; onChange(next); }} className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold disabled:opacity-30">Turun</button>
              <button type="button" disabled={paragraphs.length === 1} onClick={() => onChange(paragraphs.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Hapus paragraf ${index + 1}`} className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold text-[var(--accent-strong)] disabled:opacity-30">Hapus</button>
            </div>
          </div>
          <textarea value={paragraph} onChange={(event) => onChange(paragraphs.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} rows={6} className="w-full resize-y border-0 bg-transparent p-0 text-base leading-7 outline-none" />
        </div>
      ))}
      <button type="button" disabled={paragraphs.length >= 50} onClick={() => onChange([...paragraphs, ""])} className="inline-flex min-h-11 items-center border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white disabled:opacity-40">+ Tambah paragraf</button>
    </div>
  );
}

function WorkflowPanel({ article, role }: { article: CmsArticleEditorData; role: CmsRole }) {
  const [state, action, pending] = useActionState(mediaWorkflowAction, initialActionState);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="articleId" value={article.id} />
      <input type="hidden" name="lockVersion" value={article.lockVersion} />
      {state.status === "error" ? <p role="alert" className="border border-[var(--accent)] p-3 text-sm leading-6 text-[var(--accent-strong)]">{state.message}</p> : null}
      {article.status === "draft" || article.status === "changes" ? <button name="intent" value="review" disabled={pending} className="min-h-11 w-full border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">Ajukan review</button> : null}
      {role === "admin" && article.status === "review" ? <button name="intent" value="publish" disabled={pending} className="min-h-11 w-full bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-50">Terbitkan</button> : null}
      {role === "admin" && article.publishedRevisionId && article.status !== "archived" ? <button name="intent" value="unpublish" disabled={pending} className="min-h-11 w-full border border-[var(--line)] px-4 text-sm font-semibold hover:border-[var(--ink)] disabled:opacity-50">Batalkan terbit</button> : null}
      {role === "admin" && article.status !== "archived" ? <button name="intent" value="archive" disabled={pending} className="min-h-11 w-full px-4 text-sm font-semibold text-[var(--accent-strong)] hover:bg-white disabled:opacity-50">Arsipkan</button> : null}
      {role === "admin" && article.status === "archived" ? <button name="intent" value="restore" disabled={pending} className="min-h-11 w-full border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">Pulihkan artikel</button> : null}
    </form>
  );
}

export function AdminMediaEditor({ article, role }: { article: CmsArticleEditorData | null; role: CmsRole }) {
  const initialPayload = article?.payload ?? emptyPayload;
  const [activeLocale, setActiveLocale] = useState<CmsLocale>("id");
  const [paragraphs, setParagraphs] = useState<Record<CmsLocale, string[]>>({
    id: initialPayload.translations.id.body.length ? initialPayload.translations.id.body : [""],
    en: initialPayload.translations.en.body.length ? initialPayload.translations.en.body : [""],
  });
  const [asset, setAsset] = useState<AssetState>(article?.asset ? { id: article.asset.id, url: article.asset.url, originalName: article.asset.originalName } : null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveState, saveAction, saving] = useActionState(saveMediaArticleAction, initialActionState);

  const completeness = {
    id: Boolean(initialPayload.translations.id.title && initialPayload.translations.id.excerpt && paragraphs.id.some(Boolean)),
    en: Boolean(initialPayload.translations.en.title && initialPayload.translations.en.excerpt && paragraphs.en.some(Boolean)),
    image: Boolean(asset),
  };

  async function uploadImage(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
      const blob = await upload(`cms/media/${Date.now()}-${safeName}`, file, { access: "public", handleUploadUrl: "/api/admin/media/upload" });
      const response = await fetch("/api/admin/media/assets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: blob.url, originalName: file.name }),
      });
      if (!response.ok) throw new Error("Gambar terunggah tetapi belum dapat didaftarkan.");
      const registered = (await response.json()) as AssetState;
      setAsset(registered);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload gambar gagal.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <form id="media-save-form" action={saveAction} className="min-w-0 space-y-8">
      <input type="hidden" name="articleId" value={article?.id ?? ""} />
      <input type="hidden" name="lockVersion" value={article?.lockVersion ?? 0} />
      <input type="hidden" name="assetId" value={asset?.id ?? ""} />
      <input type="hidden" name="idBody" value={JSON.stringify(paragraphs.id)} />
      <input type="hidden" name="enBody" value={JSON.stringify(paragraphs.en)} />

        <section aria-label="Alur publikasi" className="border-y border-[var(--ink)] py-5">
          <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
            {[
              ["01", "Indonesia", completeness.id],
              ["02", "English", completeness.en],
              ["03", "Gambar", completeness.image],
              ["04", article?.status === "published" ? "Published" : article?.status === "review" ? "Review" : "Draft", article?.status === "published"],
            ].map(([number, label, complete]) => (
              <div key={String(number)} className="relative pr-4">
                <span className={`block h-2 w-2 rounded-full ${complete ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`} />
                <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{number} / {label}</span>
              </div>
            ))}
          </div>
        </section>

        {saveState.status === "error" ? <div role="alert" className="border border-[var(--accent)] bg-white p-4 text-sm text-[var(--accent-strong)]">{saveState.message}</div> : null}

        <section className="grid gap-6 border-b border-[var(--line)] pb-8 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Slug bersama</span><input name="slug" defaultValue={article?.slug ?? ""} readOnly={Boolean(article?.publishedRevisionId)} required className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)] read-only:bg-[#eef1f3]" /><FieldError error={saveState.fieldErrors?.slug} /></label>
          <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Kategori</span><select name="category" defaultValue={initialPayload.category} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]"><option value="news">Berita Afana</option><option value="insight">Insight Kelistrikan</option><option value="technology">Teknologi & Operasional</option></select><FieldError error={saveState.fieldErrors?.category} /></label>
          <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Tanggal artikel</span><input name="publishedAt" type="date" defaultValue={initialPayload.publishedAt} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" /><FieldError error={saveState.fieldErrors?.publishedAt} /></label>
          <label className="flex min-h-12 items-center gap-3 border border-[var(--line)] bg-white px-4 sm:col-span-2"><input name="isFeatured" type="checkbox" defaultChecked={initialPayload.isFeatured} className="h-5 w-5 accent-[var(--accent)]" /><span className="text-sm font-semibold">Jadikan artikel sorotan</span></label>
        </section>

        <section>
          <div className="flex border-b border-[var(--line)]" role="tablist" aria-label="Bahasa artikel">
            {(["id", "en"] as const).map((locale) => <button key={locale} type="button" role="tab" aria-selected={activeLocale === locale} onClick={() => setActiveLocale(locale)} className={`min-h-12 flex-1 border-b-2 px-4 text-sm font-semibold ${activeLocale === locale ? "border-[var(--accent)] text-[var(--ink)]" : "border-transparent text-[var(--muted)]"}`}>{locale === "id" ? "Indonesia" : "English"}</button>)}
          </div>
          {(["id", "en"] as const).map((locale) => {
            const copy = locale === "id" ? "Indonesia" : "English";
            const translation = initialPayload.translations[locale];
            return (
              <div key={locale} hidden={activeLocale !== locale} className="space-y-6 pt-7" role="tabpanel">
                <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Judul {copy}</span><input name={`${locale}Title`} defaultValue={translation.title} maxLength={160} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 text-lg font-semibold outline-none focus:border-[var(--accent)]" /><FieldError error={saveState.fieldErrors?.[`${locale}.title`]} /></label>
                <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Ringkasan</span><textarea name={`${locale}Excerpt`} defaultValue={translation.excerpt} maxLength={320} rows={4} className="mt-2 w-full border border-[var(--line)] bg-white p-4 leading-7 outline-none focus:border-[var(--accent)]" /><FieldError error={saveState.fieldErrors?.[`${locale}.excerpt`]} /></label>
                <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Alt text gambar</span><input name={`${locale}ImageAlt`} defaultValue={translation.imageAlt} maxLength={180} className="mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 outline-none focus:border-[var(--accent)]" /><FieldError error={saveState.fieldErrors?.[`${locale}.imageAlt`]} /></label>
                <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Isi artikel</p><div className="mt-3"><ParagraphEditor locale={locale} paragraphs={paragraphs[locale]} onChange={(next) => setParagraphs((current) => ({ ...current, [locale]: next }))} /></div><FieldError error={saveState.fieldErrors?.[`${locale}.body`]} /></div>
              </div>
            );
          })}
        </section>
      </form>

      <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
        <div className="border border-[var(--line)] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Gambar utama</p>
          {asset ? <div className="relative mt-4 aspect-[4/3] overflow-hidden bg-[var(--ink)]"><Image src={asset.url} alt="Preview gambar artikel" fill sizes="320px" className="object-cover" /></div> : <div className="mt-4 flex aspect-[4/3] items-center justify-center bg-[#eef1f3] px-6 text-center text-sm text-[var(--muted)]">Belum ada gambar</div>}
          <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center border border-[var(--ink)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />{uploading ? "Mengunggah…" : asset ? "Ganti gambar" : "Unggah gambar"}</label>
          {asset ? <p className="mt-2 truncate text-xs text-[var(--muted)]">{asset.originalName}</p> : null}
          {uploadError ? <p role="alert" className="mt-2 text-sm text-[var(--accent-strong)]">{uploadError}</p> : null}
          <FieldError error={saveState.fieldErrors?.assetId} />
        </div>

        <div className="border border-[var(--line)] bg-white p-5">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Status</p>{article ? <AdminStatus status={article.status} /> : null}</div>
          <button type="submit" form="media-save-form" disabled={saving || uploading || article?.status === "archived"} className="mt-5 min-h-12 w-full bg-[var(--ink)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50">{saving ? "Menyimpan…" : "Simpan draft"}</button>
          {article && asset ? <Link href={`/admin/media/${article.id}/preview`} target="_blank" className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-[var(--line)] px-4 text-sm font-semibold hover:border-[var(--ink)]">Buka preview</Link> : null}
        </div>

        {article ? <div className="border-t border-[var(--ink)] pt-5"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Alur publikasi</p><WorkflowPanel article={article} role={role} /></div> : null}
      </aside>
    </div>
  );
}
