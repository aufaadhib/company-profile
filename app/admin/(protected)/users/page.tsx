import { editorAccountAction } from "@/app/actions/cms";
import { InviteEditorForm } from "@/components/invite-editor-form";
import { getCmsUser } from "@/lib/cms-auth";
import { getCmsEditors } from "@/lib/cms-service";
import { redirect } from "next/navigation";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ invited?: string }> }) {
  const user = await getCmsUser();
  if (user?.role !== "admin") redirect("/admin");
  const [{ invited }, editors] = await Promise.all([searchParams, getCmsEditors()]);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <div className="border-b border-[var(--line)] pb-8">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.04em]">Pengguna</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">Editor dapat mengelola draft dan mengajukan review. Publikasi serta pengelolaan akun tetap berada pada Admin utama.</p>
        {invited ? <p role="status" className="mt-5 border border-[#176b42] p-4 text-sm font-semibold text-[#176b42]">Undangan Editor dikirim.</p> : null}
      </div>

      <section className="py-10" aria-labelledby="invite-title">
        <h2 id="invite-title" className="font-display text-2xl font-semibold tracking-[-0.04em]">Undang Editor</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Editor menerima tautan pengaturan password yang berlaku selama satu jam.</p>
        <div className="mt-6"><InviteEditorForm /></div>
      </section>

      <section className="border-t border-[var(--line)] py-10" aria-labelledby="editors-title">
        <h2 id="editors-title" className="font-display text-2xl font-semibold tracking-[-0.04em]">Daftar Editor</h2>
        <div className="mt-6 overflow-x-auto border-t border-[var(--ink)]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead><tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"><th className="py-4 pr-5">Editor</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Dibuat</th><th className="py-4 pl-4 text-right">Aksi</th></tr></thead>
            <tbody>{editors.map((editor) => (
              <tr key={editor.id} className="border-b border-[var(--line)]">
                <td className="py-5 pr-5"><p className="font-semibold">{editor.name}</p><p className="mt-1 text-sm text-[var(--muted)]">{editor.email}</p></td>
                <td className="px-4 py-5"><span className={`inline-flex min-h-7 items-center px-2.5 text-xs font-semibold ${editor.banned ? "bg-[#ece9f5] text-[#5b4a86]" : editor.emailVerified ? "bg-[#e8f5ee] text-[#176b42]" : "bg-[#fff7dc] text-[#825d00]"}`}>{editor.banned ? "Nonaktif" : editor.emailVerified ? "Aktif" : "Menunggu aktivasi"}</span></td>
                <td className="px-4 py-5 text-sm text-[var(--muted)]">{formatDate(editor.createdAt)}</td>
                <td className="py-5 pl-4"><form action={editorAccountAction} className="flex justify-end gap-2"><input type="hidden" name="userId" value={editor.id} />{!editor.emailVerified && !editor.banned ? <button name="intent" value="resend" className="min-h-11 border border-[var(--line)] px-3 text-sm font-semibold hover:border-[var(--ink)]">Kirim ulang</button> : null}<button name="intent" value={editor.banned ? "enable" : "disable"} className="min-h-11 px-3 text-sm font-semibold text-[var(--accent-strong)] hover:bg-white">{editor.banned ? "Aktifkan" : "Nonaktifkan"}</button></form></td>
              </tr>
            ))}</tbody>
          </table>
          {editors.length === 0 ? <p className="border-b border-[var(--line)] py-10 text-[var(--muted)]">Belum ada Editor.</p> : null}
        </div>
      </section>
    </main>
  );
}
