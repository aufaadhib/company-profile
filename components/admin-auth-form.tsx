"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { authClient } from "@/lib/auth-client";

type AuthMode = "login" | "forgot" | "reset";

export function AdminAuthForm({ mode, token }: { mode: AuthMode; token?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    try {
      if (mode === "login") {
        const result = await authClient.signIn.email({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          rememberMe: true,
        });
        if (result.error) throw new Error("Email atau password tidak valid.");
        router.replace("/admin");
        router.refresh();
        return;
      }

      if (mode === "forgot") {
        await authClient.requestPasswordReset({
          email: String(formData.get("email") ?? ""),
          redirectTo: "/admin/reset-password",
        });
        setMessage("Jika email terdaftar, tautan pengaturan password sudah dikirim.");
        return;
      }

      if (!token) throw new Error("Tautan pengaturan password tidak valid atau sudah kedaluwarsa.");
      const password = String(formData.get("password") ?? "");
      const confirmation = String(formData.get("passwordConfirmation") ?? "");
      if (password.length < 12) throw new Error("Password minimal 12 karakter.");
      if (password !== confirmation) throw new Error("Konfirmasi password tidak sama.");

      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) throw new Error("Password belum dapat diatur. Minta tautan baru dari Admin.");
      router.replace("/admin/login?reset=1");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Permintaan belum dapat diproses.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 min-w-0 space-y-6" aria-busy={pending}>
      {mode !== "reset" ? (
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 min-h-12 w-full border-x-0 border-b border-t-0 border-[var(--line)] bg-transparent px-0 text-base text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]"
          />
        </label>
      ) : null}

      {mode === "login" ? (
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 min-h-12 w-full border-x-0 border-b border-t-0 border-[var(--line)] bg-transparent px-0 text-base text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]"
          />
        </label>
      ) : null}

      {mode === "reset" ? (
        <>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Password baru</span>
            <input name="password" type="password" autoComplete="new-password" minLength={12} required className="mt-2 min-h-12 w-full border-x-0 border-b border-t-0 border-[var(--line)] bg-transparent px-0 outline-none focus:border-[var(--accent)]" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Ulangi password</span>
            <input name="passwordConfirmation" type="password" autoComplete="new-password" minLength={12} required className="mt-2 min-h-12 w-full border-x-0 border-b border-t-0 border-[var(--line)] bg-transparent px-0 outline-none focus:border-[var(--accent)]" />
          </label>
        </>
      ) : null}

      {message ? <p role="status" className="border border-[var(--accent)] p-4 text-sm leading-6 text-[var(--muted)]">{message}</p> : null}

      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center bg-[var(--ink)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Memproses…" : mode === "login" ? "Masuk ke dashboard" : mode === "forgot" ? "Kirim tautan" : "Atur password"}
      </button>

      <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:justify-between sm:gap-4">
        {mode === "login" ? <Link href="/admin/forgot-password" className="hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Lupa password?</Link> : <Link href="/admin/login" className="hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Kembali ke login</Link>}
        <Link href="/id" className="hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">Lihat website</Link>
      </div>
    </form>
  );
}
