"use server";

import "server-only";

import { randomBytes } from "node:crypto";
import { updateTag, revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { CmsAuthorizationError, requireCmsAdmin, requireCmsUser } from "@/lib/cms-auth";
import {
  CmsConflictError,
  CmsContentError,
  publishMediaArticle,
  requestMediaReview,
  saveMediaDraft,
  updateMediaPublication,
  writeCmsAudit,
} from "@/lib/cms-service";
import { validateMediaDraftForm, type MediaFormState } from "@/lib/cms-validation";
import { getPrisma } from "@/lib/prisma";

export type CmsActionState = MediaFormState;

export type AccountActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: { name?: string; email?: string };
};

function cmsError(error: unknown): CmsActionState {
  if (error instanceof CmsContentError || error instanceof CmsConflictError) {
    return { status: "error", message: error.message, fieldErrors: error.fieldErrors };
  }
  if (error instanceof CmsAuthorizationError) return { status: "error", message: error.message };
  if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
    return { status: "error", message: "Slug sudah digunakan artikel lain.", fieldErrors: { slug: "Gunakan slug yang berbeda." } };
  }
  console.error("[cms] Action failed");
  return { status: "error", message: "Perubahan belum dapat disimpan. Coba lagi." };
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/media");
}

function revalidatePublishedMedia() {
  updateTag("published-media");
  revalidatePath("/id/media-informasi");
  revalidatePath("/en/media-information");
  revalidatePath("/id/media-informasi/[slug]", "page");
  revalidatePath("/en/media-information/[slug]", "page");
}

export async function saveMediaArticleAction(
  _previousState: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  const validation = validateMediaDraftForm(formData);
  if (!validation.success) {
    return { status: "error", message: "Periksa kembali field yang ditandai.", fieldErrors: validation.errors };
  }

  let articleId: string;
  try {
    const actor = await requireCmsUser();
    articleId = await saveMediaDraft(validation.data, actor);
  } catch (error) {
    return cmsError(error);
  }

  revalidateAdmin();
  revalidatePath(`/admin/media/${articleId}`);
  redirect(`/admin/media/${articleId}?saved=1`);
}

export async function mediaWorkflowAction(
  _previousState: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  const articleId = formData.get("articleId");
  const version = Number(formData.get("lockVersion"));
  const intent = formData.get("intent");
  if (typeof articleId !== "string" || !articleId || !Number.isSafeInteger(version) || version < 0) {
    return { status: "error", message: "Referensi artikel tidak valid. Muat ulang halaman." };
  }

  try {
    if (intent === "review") {
      const actor = await requireCmsUser();
      await requestMediaReview(articleId, version, actor);
    } else if (intent === "publish") {
      const actor = await requireCmsAdmin();
      await publishMediaArticle(articleId, version, actor);
      revalidatePublishedMedia();
    } else if (intent === "unpublish" || intent === "archive" || intent === "restore") {
      const actor = await requireCmsAdmin();
      await updateMediaPublication(articleId, version, intent, actor);
      revalidatePublishedMedia();
    } else {
      return { status: "error", message: "Tindakan tidak dikenali." };
    }
  } catch (error) {
    return cmsError(error);
  }

  revalidateAdmin();
  revalidatePath(`/admin/media/${articleId}`);
  redirect(`/admin/media/${articleId}?updated=1`);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function inviteEditorAction(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const name = typeof formData.get("name") === "string" ? String(formData.get("name")).trim() : "";
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")).trim().toLowerCase() : "";
  const fieldErrors: AccountActionState["fieldErrors"] = {};
  if (name.length < 2 || name.length > 100) fieldErrors.name = "Nama harus 2–100 karakter.";
  if (!validEmail(email) || email.length > 254) fieldErrors.email = "Masukkan alamat email yang valid.";
  if (Object.keys(fieldErrors).length > 0) return { status: "error", message: "Periksa data Editor.", fieldErrors };

  let createdUserId: string | null = null;
  try {
    const actor = await requireCmsAdmin();
    const requestHeaders = await headers();
    const result = await auth.api.createUser({
      headers: requestHeaders,
      body: {
        name,
        email,
        password: randomBytes(32).toString("base64url"),
      },
    });
    createdUserId = result.user.id;
    await writeCmsAudit(actor.id, "EDITOR_INVITED", "User", result.user.id);
    await auth.api.requestPasswordReset({ body: { email, redirectTo: "/admin/reset-password" } });
  } catch (error) {
    if (createdUserId) {
      await getPrisma().$transaction([
        getPrisma().verification.deleteMany({ where: { value: createdUserId } }),
        getPrisma().auditLog.deleteMany({ where: { entityType: "User", entityId: createdUserId, action: "EDITOR_INVITED" } }),
        getPrisma().user.deleteMany({ where: { id: createdUserId, role: "editor" } }),
      ]).catch(() => undefined);
    }
    if (error instanceof CmsAuthorizationError) return { status: "error", message: error.message };
    console.error("[cms] Editor invitation failed");
    return { status: "error", message: "Undangan belum dapat dikirim. Pastikan email belum terdaftar." };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?invited=1");
}

export async function editorAccountAction(formData: FormData) {
  const userId = formData.get("userId");
  const intent = formData.get("intent");
  if (typeof userId !== "string" || !userId) throw new CmsContentError("Akun Editor tidak valid.");

  const actor = await requireCmsAdmin();
  const editor = await getPrisma().user.findFirst({ where: { id: userId, role: "editor" } });
  if (!editor) throw new CmsContentError("Editor tidak ditemukan.");
  const requestHeaders = await headers();

  if (intent === "disable") {
    await auth.api.banUser({ headers: requestHeaders, body: { userId, banReason: "Dinonaktifkan oleh Admin Afana CMS" } });
    await writeCmsAudit(actor.id, "EDITOR_DISABLED", "User", userId);
  } else if (intent === "enable") {
    await auth.api.unbanUser({ headers: requestHeaders, body: { userId } });
    await writeCmsAudit(actor.id, "EDITOR_ENABLED", "User", userId);
  } else if (intent === "resend") {
    await auth.api.requestPasswordReset({ body: { email: editor.email, redirectTo: "/admin/reset-password" } });
    await writeCmsAudit(actor.id, "EDITOR_INVITE_RESENT", "User", userId);
  } else {
    throw new CmsContentError("Tindakan akun tidak dikenali.");
  }

  revalidatePath("/admin/users");
}
