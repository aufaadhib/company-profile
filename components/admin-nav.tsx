"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminLogout } from "@/components/admin-logout";
import type { CmsRole } from "@/lib/auth-permissions";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/contact", label: "Kontak", adminOnly: true },
  { href: "/admin/users", label: "Pengguna", adminOnly: true },
];

function NavigationLinks({ role, onDark = false }: { role: CmsRole; onDark?: boolean }) {
  const pathname = usePathname();
  return navItems.filter((item) => !item.adminOnly || role === "admin").map((item) => {
    const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-12 items-center justify-between border-b px-1 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${onDark ? "border-white/15 focus-visible:outline-white" : "border-[var(--line)] focus-visible:outline-[var(--accent)]"} ${active ? (onDark ? "text-white" : "text-[var(--ink)]") : (onDark ? "text-white/55 hover:text-white" : "text-[var(--muted)] hover:text-[var(--ink)]")}`}
      >
        <span>{item.label}</span>
        <span className={`h-2 w-2 rounded-full ${active ? "bg-[var(--accent)]" : "bg-current opacity-25"}`} aria-hidden="true" />
      </Link>
    );
  });
}

export function AdminNav({ user }: { user: { name: string; email: string; role: CmsRole } }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-[var(--ink)] px-8 py-8 text-white lg:flex">
        <Link href="/admin" className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <Image src="/afana_logo_icon_only.svg" alt="" width={34} height={34} />
          <span className="font-display font-semibold tracking-[-0.03em]">AFANA / CONTROL</span>
        </Link>
        <nav aria-label="Navigasi admin" className="mt-16"><NavigationLinks role={user.role} onDark /></nav>
        <div className="mt-auto border-t border-white/15 pt-6">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="mt-1 truncate text-sm text-white/50">{user.email}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{user.role === "admin" ? "Admin utama" : "Editor"}</p>
          <div className="mt-3"><AdminLogout /></div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/95 px-6 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3 font-display text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
            <Image src="/afana_logo_icon_only.svg" alt="" width={30} height={30} /> AFANA / CONTROL
          </Link>
          <details className="group relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center border border-[var(--line)] px-4 text-sm font-semibold marker:content-none">Menu</summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-3rem))] border border-[var(--line)] bg-white p-5 shadow-[0_18px_50px_rgba(16,24,32,.12)]">
              <nav aria-label="Navigasi admin mobile"><NavigationLinks role={user.role} /></nav>
              <div className="mt-5 border-t border-[var(--line)] pt-4">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-sm text-[var(--muted)]">{user.email}</p>
                <div className="mt-2 [&_button]:text-[var(--muted)] [&_button:hover]:text-[var(--ink)]"><AdminLogout /></div>
              </div>
            </div>
          </details>
        </div>
      </header>
    </>
  );
}
