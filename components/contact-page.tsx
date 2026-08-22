import { ContactForm } from "@/components/contact-form";
import type { ContactPageContent } from "@/content/contact-content";
import { phoneHref, whatsappHref } from "@/lib/contact-settings-validation";
import type { PublicContactSettings } from "@/lib/contact-service";
import type { ContactLocale } from "@/lib/contact-validation";

type ContactPageProps = {
  content: ContactPageContent;
  locale: ContactLocale;
  siteKey: string | null;
  settings: PublicContactSettings;
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConnectionGraphic() {
  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 560 300" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M22 242h112l72-72h106l76-76h150" stroke="currentColor" strokeWidth="1.5" opacity=".34" />
      <path d="M22 198h82l55-55h111l42-42h226" stroke="currentColor" strokeWidth="1" opacity=".18" />
      <path d="M388 94 445 37h93" stroke="currentColor" strokeWidth="1.5" opacity=".34" />
      <circle cx="206" cy="170" r="7" fill="var(--accent)" />
      <circle cx="388" cy="94" r="7" fill="var(--accent)" />
      <circle cx="538" cy="94" r="4" fill="currentColor" opacity=".8" />
      <path d="m247 238 51-84h39l-51 84h-39Z" fill="currentColor" opacity=".12" />
      <path d="m315 238 51-84h39l-51 84h-39Z" fill="currentColor" opacity=".22" />
    </svg>
  );
}

export function ContactPage({ content, locale, siteKey, settings }: ContactPageProps) {
  const channels = [
    ...(settings.showEmail ? [{ label: content.emailLabel, value: settings.publicEmail, href: `mailto:${settings.publicEmail}` }] : []),
    ...(settings.showPhone ? [{ label: content.phoneLabel, value: settings.phone, href: phoneHref(settings.phone) }] : []),
    ...(settings.showWhatsapp ? [{ label: content.whatsappLabel, value: settings.whatsapp, href: whatsappHref(settings.whatsapp) }] : []),
  ];
  const hasChannels = channels.length > 0 || settings.showLocation;

  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section aria-labelledby="contact-title" className="relative isolate h-[60svh] min-h-[512px] overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] text-white lg:block"><ConnectionGraphic /></div>
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-14 pt-32 sm:px-10 sm:pb-18 lg:px-20 lg:pb-20">
          <div className="max-w-3xl">
            <p className="hero-breadcrumb mb-8 flex flex-wrap items-center gap-3 text-white/85">
              <span>{content.breadcrumbHome}</span><span aria-hidden="true" className="text-white/45">/</span><span>{content.breadcrumbCurrent}</span>
            </p>
            <h1 id="contact-title" className="hero-title text-white">{content.title}</h1>
            <p className="hero-description mt-7 max-w-2xl text-white/75">{content.description}</p>
          </div>
        </div>
      </section>

      <section className={`mx-auto grid w-full max-w-[1440px] gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28 ${hasChannels ? "lg:grid-cols-[.72fr_1.28fr] lg:gap-20" : ""}`}>
        {hasChannels ? <div>
          <h2 className="max-w-md font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--ink)]">{content.channelsTitle}</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-[var(--muted)]">{content.channelsDescription}</p>

          <div className="mt-10 border-t border-[var(--line)]">
            {channels.map((channel) => (
              <a key={channel.label} href={channel.href} target={channel.href.startsWith("https://") ? "_blank" : undefined} rel={channel.href.startsWith("https://") ? "noreferrer" : undefined} className="group flex min-h-20 items-center justify-between gap-5 border-b border-[var(--line)] py-4 text-[var(--ink)] transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
                <span><span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{channel.label}</span><span className="mt-1 block text-lg font-semibold">{channel.value}</span></span>
                <ArrowIcon />
              </a>
            ))}
            {settings.showLocation ? <div className="flex min-h-20 items-center justify-between gap-5 border-b border-[var(--line)] py-4">
              <span><span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{content.locationLabel}</span><span className="mt-1 block text-lg font-semibold text-[var(--ink)]">{settings.location}</span></span>
              <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            </div> : null}
          </div>
        </div> : null}

        <div>
          <h2 className="max-w-xl font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--ink)]">{content.formTitle}</h2>
          <p className="mb-10 mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">{content.formDescription}</p>
          <ContactForm content={content} locale={locale} siteKey={siteKey} directEmail={settings.showEmail ? settings.publicEmail : null} />
        </div>
      </section>
    </main>
  );
}
