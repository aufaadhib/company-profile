import { AdminAuthForm } from "@/components/admin-auth-form";
import { AdminAuthLayout } from "@/components/admin-auth-layout";

export default function AdminLoginPage() {
  return <AdminAuthLayout title="Masuk" description="Gunakan akun yang telah diaktifkan oleh Admin Afana CMS."><AdminAuthForm mode="login" /></AdminAuthLayout>;
}
