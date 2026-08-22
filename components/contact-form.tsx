"use client";

import Script from "next/script";
import { useActionState, useEffect, useLayoutEffect, useRef, useState } from "react";

import { submitContactForm } from "@/app/actions/contact";
import type { ContactPageContent } from "@/content/contact-content";
import type { ContactFormState, ContactLocale } from "@/lib/contact-validation";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        action: string;
        theme: "light";
        language: ContactLocale;
        "refresh-expired": "auto";
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const initialState: ContactFormState = { status: "idle", message: "" };
const inputClass = "min-h-12 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-base text-[var(--ink)] outline-none transition-colors placeholder:text-slate-600 focus:border-[var(--accent)] focus:ring-0 disabled:cursor-wait disabled:opacity-60";

type ContactFormProps = {
  content: ContactPageContent;
  locale: ContactLocale;
  siteKey: string | null;
  directEmail: string | null;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-2 text-sm leading-5 text-[var(--accent-strong)]">{message}</p>;
}

function TurnstileWidget({ siteKey, locale, resetKey }: {
  siteKey: string;
  locale: ContactLocale;
  resetKey: ContactFormState;
}) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const turnstile = window.turnstile;
    if (!ready || !container || !turnstile) return;

    const widgetId = turnstile.render(container, {
      sitekey: siteKey,
      action: "contact",
      theme: "light",
      language: locale,
      "refresh-expired": "auto",
    });
    widgetIdRef.current = widgetId;

    return () => {
      turnstile.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [locale, ready, siteKey]);

  useEffect(() => {
    const widgetId = widgetIdRef.current;
    if (resetKey.status === "error" && widgetId) window.turnstile?.reset(widgetId);
  }, [resetKey]);

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} />
    </>
  );
}

export function ContactForm({ content, locale, siteKey, directEmail }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const formDisabled = pending || !siteKey;

  if (state.status === "success" || state.status === "warning") {
    return (
      <div className="border-y border-[var(--line)] py-10" role="status" aria-live="polite">
        <div className="mb-6 h-1 w-16 bg-[var(--accent)]" aria-hidden="true" />
        <h3 className="max-w-xl font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em] text-[var(--ink)]">
          {state.status === "success" ? (locale === "id" ? "Pesan diterima" : "Message received") : (locale === "id" ? "Pesan tersimpan" : "Message saved")}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{state.message}</p>
        {directEmail ? <a href={`mailto:${directEmail}`} className="mt-6 inline-flex min-h-11 items-center border-b border-[var(--ink)] text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
          {content.directFallback} {directEmail}
        </a> : null}
      </div>
    );
  }

  return (
    <>
      <form action={formAction} aria-busy={pending} className="border-t border-[var(--line)]">
        <input type="hidden" name="locale" value={locale} />
        <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-x-8 md:grid-cols-2">
          <div className="py-5">
            <label htmlFor="contact-name" className="text-sm font-semibold text-[var(--ink)]">{content.nameLabel}</label>
            <input id="contact-name" name="name" type="text" minLength={2} maxLength={100} required autoComplete="name" disabled={formDisabled} aria-invalid={Boolean(state.fieldErrors?.name)} aria-describedby={state.fieldErrors?.name ? "contact-name-error" : undefined} className={inputClass} />
            <FieldError id="contact-name-error" message={state.fieldErrors?.name} />
          </div>
          <div className="py-5">
            <label htmlFor="contact-email" className="text-sm font-semibold text-[var(--ink)]">{content.emailFieldLabel}</label>
            <input id="contact-email" name="email" type="email" maxLength={254} required autoComplete="email" disabled={formDisabled} aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "contact-email-error" : undefined} className={inputClass} />
            <FieldError id="contact-email-error" message={state.fieldErrors?.email} />
          </div>
          <div className="py-5">
            <label htmlFor="contact-phone" className="flex items-center justify-between gap-4 text-sm font-semibold text-[var(--ink)]"><span>{content.phoneFieldLabel}</span><span className="text-xs font-normal text-[var(--muted)]">{content.phoneOptional}</span></label>
            <input id="contact-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" disabled={formDisabled} aria-invalid={Boolean(state.fieldErrors?.phone)} aria-describedby={state.fieldErrors?.phone ? "contact-phone-error" : undefined} className={inputClass} />
            <FieldError id="contact-phone-error" message={state.fieldErrors?.phone} />
          </div>
          <div className="py-5">
            <label htmlFor="contact-topic" className="text-sm font-semibold text-[var(--ink)]">{content.topicLabel}</label>
            <select id="contact-topic" name="topic" required defaultValue="" disabled={formDisabled} aria-invalid={Boolean(state.fieldErrors?.topic)} aria-describedby={state.fieldErrors?.topic ? "contact-topic-error" : undefined} className={inputClass}>
              <option value="" disabled>{content.topicPlaceholder}</option>
              {content.topicOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <FieldError id="contact-topic-error" message={state.fieldErrors?.topic} />
          </div>
        </div>

        <div className="py-5">
          <label htmlFor="contact-message" className="text-sm font-semibold text-[var(--ink)]">{content.messageLabel}</label>
          <textarea id="contact-message" name="message" rows={6} minLength={20} maxLength={2000} required disabled={formDisabled} aria-invalid={Boolean(state.fieldErrors?.message)} aria-describedby={state.fieldErrors?.message ? "contact-message-error" : undefined} className={`${inputClass} resize-y leading-7`} />
          <FieldError id="contact-message-error" message={state.fieldErrors?.message} />
        </div>

        <div className="border-t border-[var(--line)] py-6">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[var(--muted)]">
            <input name="consent" type="checkbox" value="accepted" required disabled={formDisabled} aria-invalid={Boolean(state.fieldErrors?.consent)} aria-describedby={state.fieldErrors?.consent ? "contact-consent-error" : undefined} className="mt-1 size-5 shrink-0 accent-[var(--accent)]" />
            <span>{content.consentLabel}</span>
          </label>
          <FieldError id="contact-consent-error" message={state.fieldErrors?.consent} />
        </div>

        {siteKey ? (
          <div className="border-t border-[var(--line)] py-6">
            <TurnstileWidget siteKey={siteKey} locale={locale} resetKey={state} />
            <FieldError id="contact-turnstile-error" message={state.fieldErrors?.turnstile} />
          </div>
        ) : (
          <p className="border-y border-[var(--line)] py-5 text-sm leading-6 text-[var(--accent-strong)]" role="status">{content.configMessage}</p>
        )}

        <p className="min-h-6 py-4 text-sm leading-6 text-[var(--accent-strong)]" aria-live="polite">{state.message}</p>
        <button type="submit" disabled={formDisabled} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ink)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:bg-slate-400">
          {pending ? content.pendingLabel : content.submitLabel}
        </button>
      </form>
    </>
  );
}
