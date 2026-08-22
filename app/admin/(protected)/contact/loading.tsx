export default function ContactAdminLoading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20" aria-busy="true">
      <p className="sr-only" role="status">Memuat Contact Control.</p>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="h-14 w-56 bg-[#d8dde2] sm:h-16 sm:w-72" />
        <div className="mt-6 h-5 w-full max-w-xl bg-[#e7eaed]" />
        <div className="mt-8 flex border-b border-[var(--line)]"><div className="h-12 w-24 bg-[#d8dde2]" /><div className="h-12 w-32 bg-[#e7eaed]" /></div>
        <div className="mt-8 grid border-b border-[var(--line)] sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-24 border-b border-[var(--line)] p-5 sm:border-b-0 sm:border-l"><div className="h-3 w-24 bg-[#e7eaed]" /><div className="mt-3 h-8 w-12 bg-[#d8dde2]" /></div>)}</div>
        <div className="mt-8 border-t border-[var(--ink)]">{Array.from({ length: 5 }, (_, index) => <div key={index} className="grid h-24 gap-3 border-b border-[var(--line)] py-5 md:grid-cols-4"><div className="h-4 w-2/3 bg-[#d8dde2]" /><div className="h-4 w-1/2 bg-[#e7eaed]" /><div className="h-4 w-1/2 bg-[#e7eaed]" /><div className="h-7 w-20 bg-[#d8dde2]" /></div>)}</div>
      </div>
    </main>
  );
}
