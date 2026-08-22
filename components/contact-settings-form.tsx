"use client";

import { useActionState } from "react";

import {
  saveContactSettingsAction,
  testContactEmailAction,
  type ContactAdminActionState,
} from "@/app/actions/contact-admin";
import type { ContactSettingsData, ContactSettingsField } from "@/lib/contact-settings-validation";

const initialState: ContactAdminActionState = { status: "idle" };
const inputClass = "mt-2 min-h-12 w-full border border-[var(--line)] bg-white px-4 text-base text-[var(--ink)] outline-none transition-colors placeholder:text-slate-600 focus:border-[var(--accent)] focus:ring-0 disabled:cursor-wait disabled:bg-[#eef1f3]";

type ContactSettingsFormProps = {
  settings: ContactSettingsData;
  health: {
    resendApiKey: boolean;
    turnstileSiteKey: boolean;
    turnstileSecret: boolean;
    rateLimitSecret: boolean;
  };
};

function FieldError({ field, errors }: { field: ContactSettingsField; errors?: ContactAdminActionState["fieldErrors"] }) {
  const message = errors?.[field];
  return message ? <p className="mt-2 text-sm leading-5 text-[var(--accent-strong)]">{message}</p> : null;
}

function VisibilityCheckbox({ name, defaultChecked }: { name: string; defaultChecked: boolean }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-[var(--ink)]">
      <input type="hidden" name={name} value="false" />
      <input type="checkbox" name={name} value="true" defaultChecked={defaultChecked} className="size-5 accent-[var(--accent)]" />
      Tampilkan di halaman publik
    </label>
  );
}

function HealthRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-5 border-b border-[var(--line)] py-3">
      <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
      <span className={`inline-flex min-h-7 items-center px-2.5 text-xs font-semibold ${ready ? "bg-[#e8f5ee] text-[#176b42]" : "bg-[#fff1e9] text-[#a83a1f]"}`}>
        {ready ? "Terkonfigurasi" : "Belum tersedia"}
      </span>
    </div>
  );
}

export function ContactSettingsForm({ settings, health }: ContactSettingsFormProps) {
  const [saveState, saveAction, saving] = useActionState(saveContactSettingsAction, initialState);
  const [testState, testAction, testing] = useActionState(testContactEmailAction, initialState);

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-16">
      <form action={saveAction} aria-busy={saving} className="min-w-0">
        <section aria-labelledby="delivery-title" className="border-t border-[var(--ink)] py-8">
          <div className="max-w-2xl">
            <h2 id="delivery-title" className="font-display text-2xl font-semibold tracking-[-0.03em]">Pengiriman email</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Pesan tetap disimpan saat Auto Email nonaktif. Admin masih dapat mengirim notifikasi secara manual dari inbox.</p>
          </div>

          <fieldset className="mt-7">
            <legend className="text-sm font-semibold text-[var(--ink)]">Auto Email</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { value: "true", title: "Aktif", description: "Kirim notifikasi setelah pesan tersimpan." },
                { value: "false", title: "Nonaktif", description: "Simpan pesan tanpa pengiriman otomatis." },
              ].map((option) => (
                <label key={option.value} className="flex min-h-24 cursor-pointer items-start gap-4 border border-[var(--line)] bg-white p-4 has-[:checked]:border-[var(--ink)] has-[:checked]:bg-[#f0f2f3]">
                  <input type="radio" name="autoEmailEnabled" value={option.value} defaultChecked={settings.autoEmailEnabled === (option.value === "true")} className="mt-1 size-5 accent-[var(--accent)]" />
                  <span><strong className="block text-sm">{option.title}</strong><span className="mt-1 block text-sm leading-5 text-[var(--muted)]">{option.description}</span></span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-semibold">Nama sender
              <input name="senderName" required minLength={2} maxLength={100} defaultValue={settings.senderName} className={inputClass} aria-invalid={Boolean(saveState.fieldErrors?.senderName)} />
              <FieldError field="senderName" errors={saveState.fieldErrors} />
            </label>
            <label className="block text-sm font-semibold">Email sender
              <input name="senderEmail" type="email" required maxLength={254} defaultValue={settings.senderEmail} className={inputClass} aria-invalid={Boolean(saveState.fieldErrors?.senderEmail)} />
              <span className="mt-2 block text-xs font-normal leading-5 text-[var(--muted)]">Harus memakai domain yang telah diverifikasi di Resend.</span>
              <FieldError field="senderEmail" errors={saveState.fieldErrors} />
            </label>
          </div>
        </section>

        <section aria-labelledby="channels-title" className="border-t border-[var(--ink)] py-8">
          <h2 id="channels-title" className="font-display text-2xl font-semibold tracking-[-0.03em]">Kanal publik</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">Email publik juga menjadi satu-satunya penerima notifikasi Contact.</p>

          <div className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <div className="grid gap-4 py-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <div><h3 className="font-display text-lg font-semibold">Email</h3><VisibilityCheckbox name="showEmail" defaultChecked={settings.showEmail} /></div>
              <label className="block text-sm font-semibold">Alamat email
                <input name="publicEmail" type="email" required maxLength={254} defaultValue={settings.publicEmail} className={inputClass} aria-invalid={Boolean(saveState.fieldErrors?.publicEmail)} />
                <FieldError field="publicEmail" errors={saveState.fieldErrors} />
              </label>
            </div>
            <div className="grid gap-4 py-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <div><h3 className="font-display text-lg font-semibold">Telepon</h3><VisibilityCheckbox name="showPhone" defaultChecked={settings.showPhone} /></div>
              <label className="block text-sm font-semibold">Nomor telepon
                <input name="phone" type="tel" required maxLength={30} defaultValue={settings.phone} className={inputClass} aria-invalid={Boolean(saveState.fieldErrors?.phone)} />
                <FieldError field="phone" errors={saveState.fieldErrors} />
              </label>
            </div>
            <div className="grid gap-4 py-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <div><h3 className="font-display text-lg font-semibold">WhatsApp</h3><VisibilityCheckbox name="showWhatsapp" defaultChecked={settings.showWhatsapp} /></div>
              <label className="block text-sm font-semibold">Nomor WhatsApp
                <input name="whatsapp" type="tel" required maxLength={30} defaultValue={settings.whatsapp} className={inputClass} aria-invalid={Boolean(saveState.fieldErrors?.whatsapp)} />
                <FieldError field="whatsapp" errors={saveState.fieldErrors} />
              </label>
            </div>
            <div className="grid gap-4 py-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <div><h3 className="font-display text-lg font-semibold">Lokasi</h3><VisibilityCheckbox name="showLocation" defaultChecked={settings.showLocation} /></div>
              <label className="block text-sm font-semibold">Nama lokasi
                <input name="location" required minLength={2} maxLength={150} defaultValue={settings.location} className={inputClass} aria-invalid={Boolean(saveState.fieldErrors?.location)} />
                <FieldError field="location" errors={saveState.fieldErrors} />
              </label>
            </div>
          </div>
        </section>

        <div className="sticky bottom-0 z-10 -mx-6 flex flex-col gap-3 border-t border-[var(--line)] bg-[var(--paper)]/95 px-6 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:px-0">
          <p className={`min-h-6 text-sm font-semibold ${saveState.status === "error" ? "text-[var(--accent-strong)]" : "text-[#176b42]"}`} role="status" aria-live="polite">{saveState.message}</p>
          <button disabled={saving} className="min-h-12 bg-[var(--ink)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)] disabled:cursor-wait disabled:opacity-50">{saving ? "Menyimpan…" : "Simpan pengaturan"}</button>
        </div>
      </form>

      <aside className="min-w-0 xl:pt-8" aria-labelledby="health-title">
        <div className="border-t border-[var(--ink)]">
          <h2 id="health-title" className="py-5 font-display text-xl font-semibold tracking-[-0.03em]">Status konfigurasi</h2>
          <HealthRow label="Resend API key" ready={health.resendApiKey} />
          <HealthRow label="Turnstile site key" ready={health.turnstileSiteKey} />
          <HealthRow label="Turnstile secret" ready={health.turnstileSecret} />
          <HealthRow label="Rate-limit secret" ready={health.rateLimitSecret} />
        </div>

        <form action={testAction} aria-busy={testing} className="mt-8 border-t border-[var(--ink)] py-5">
          <h2 className="font-display text-xl font-semibold tracking-[-0.03em]">Uji pengiriman</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Simpan perubahan terlebih dahulu. Email uji dikirim ke email publik.</p>
          <button disabled={testing || !health.resendApiKey} className="mt-5 min-h-11 border border-[var(--ink)] px-4 text-sm font-semibold transition-colors hover:bg-[var(--ink)] hover:text-white disabled:cursor-not-allowed disabled:border-[var(--line)] disabled:text-[var(--muted)]">{testing ? "Mengirim…" : "Kirim email uji"}</button>
          <p className={`mt-3 min-h-5 text-sm ${testState.status === "error" ? "text-[var(--accent-strong)]" : "text-[#176b42]"}`} role="status" aria-live="polite">{testState.message}</p>
        </form>
      </aside>
    </div>
  );
}
