"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70svh] w-full max-w-[900px] items-center px-6 py-16 sm:px-10">
      <div className="w-full border-y border-[var(--ink)] py-12">
        <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-none tracking-[-0.04em]">Dashboard belum dapat dimuat.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">Periksa koneksi, lalu coba muat ulang. Perubahan yang belum dikirim dari browser tidak tersimpan.</p>
        <button type="button" onClick={reset} className="mt-8 min-h-12 bg-[var(--ink)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Coba lagi</button>
      </div>
    </main>
  );
}

