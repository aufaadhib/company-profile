import { AdminAuthForm } from "@/components/admin-auth-form";
import { AdminAuthLayout } from "@/components/admin-auth-layout";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token } = await searchParams;
  return <AdminAuthLayout title="Buat password" description="Gunakan minimal 12 karakter yang tidak dipakai pada layanan lain."><AdminAuthForm mode="reset" token={token} /></AdminAuthLayout>;
}
