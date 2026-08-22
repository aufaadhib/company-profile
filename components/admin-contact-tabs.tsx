import Link from "next/link";

export function AdminContactTabs({ active }: { active: "inbox" | "settings" }) {
  return (
    <nav aria-label="Navigasi Contact" className="mt-8 flex border-b border-[var(--line)]">
      {[
        { href: "/admin/contact", label: "Inbox", value: "inbox" },
        { href: "/admin/contact/settings", label: "Pengaturan", value: "settings" },
      ].map((item) => (
        <Link key={item.value} href={item.href} aria-current={active === item.value ? "page" : undefined} className={`flex min-h-12 items-center border-b-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${active === item.value ? "border-[var(--accent)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"}`}>{item.label}</Link>
      ))}
    </nav>
  );
}
