export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20" aria-busy="true">
      <p className="sr-only" role="status">Memuat dashboard.</p>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="h-14 w-64 bg-[#e7eaed] sm:h-16 sm:w-80" />
        <div className="mt-10 grid border-y border-[var(--line)] sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-28 border-b border-[var(--line)] p-6 sm:border-l"><div className="h-3 w-24 bg-[#e7eaed]" /><div className="mt-4 h-9 w-12 bg-[#d8dde2]" /></div>)}
        </div>
        <div className="mt-12 grid gap-12 xl:grid-cols-[1.35fr_.65fr]">
          <div className="space-y-0 border-t border-[var(--ink)]">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-20 border-b border-[var(--line)] py-5"><div className="h-4 w-2/3 bg-[#d8dde2]" /><div className="mt-2 h-3 w-1/3 bg-[#e7eaed]" /></div>)}</div>
          <div className="space-y-0 border-t border-[var(--ink)]">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-20 border-b border-[var(--line)] py-5"><div className="h-3 w-3/4 bg-[#d8dde2]" /></div>)}</div>
        </div>
      </div>
    </main>
  );
}
