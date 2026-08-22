import { AdminAuthForm } from "@/components/admin-auth-form";
import { AdminAuthLayout } from "@/components/admin-auth-layout";

export default function ForgotPasswordPage() {
  return <AdminAuthLayout title="Atur ulang password" description="Kami akan mengirim tautan satu kali ke email akun yang terdaftar."><AdminAuthForm mode="forgot" /></AdminAuthLayout>;
}
