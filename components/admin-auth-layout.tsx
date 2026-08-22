import Image from "next/image";

export function AdminAuthLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh bg-[var(--paper)] lg:grid-cols-[minmax(20rem,0.86fr)_1.14fr]">
      <section className="relative hidden overflow-hidden bg-[var(--ink)] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <svg viewBox="0 0 800 900" className="h-full w-full" fill="none">
            <path d="M0 170H520L730 380V900" stroke="white" strokeOpacity=".22" />
            <path d="M0 430H310L470 590H800" stroke="#e4572e" strokeOpacity=".8" />
            <circle cx="310" cy="430" r="8" fill="#e4572e" />
            <circle cx="520" cy="170" r="8" fill="white" fillOpacity=".6" />
          </svg>
        </div>
        <div className="relative flex items-center gap-4">
          <Image src="/afana_logo_icon_only.svg" alt="" width={38} height={38} />
          <span className="font-display text-lg font-semibold tracking-[-0.03em]">AFANA / CONTROL</span>
        </div>
        <div className="relative max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Publication ledger</p>
          <p className="mt-5 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">Konten bergerak melalui satu jalur yang dapat ditelusuri.</p>
        </div>
      </section>
      <section className="flex min-w-0 items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto min-w-0 w-full max-w-lg">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src="/afana_logo_icon_only.svg" alt="" width={34} height={34} />
            <span className="font-display font-semibold">AFANA / CONTROL</span>
          </div>
          <h1 className="mt-12 font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--ink)] lg:mt-0">{title}</h1>
          <p className="mt-5 max-w-full break-words text-base leading-7 text-[var(--muted)] sm:max-w-md">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
