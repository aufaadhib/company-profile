"use server";

import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { CmsAuthorizationError, requireCmsAdmin, requireCmsUser } from "@/lib/cms-auth";
import { CmsConflictError, CmsContentError } from "@/lib/cms-service";
import {
  moveFaqCategory,
  moveFaqItem,
  publishFaqItem,
  requestFaqReview,
  saveFaqCategory,
  saveFaqDraft,
  updateFaqCategoryState,
  updateFaqPublication,
} from "@/lib/faq-service";
import { validateFaqCategoryForm, validateFaqDraftForm, type FaqFormState } from "@/lib/faq-validation";

export type FaqActionState = FaqFormState;

function faqError(error: unknown): FaqActionState {
  if (error instanceof CmsContentError || error instanceof CmsConflictError) {
    return { status: "error", message: error.message, fieldErrors: error.fieldErrors };
  }
  if (error instanceof CmsAuthorizationError) return { status: "error", message: error.message };
  if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
    return { status: "error", message: "Slug kategori sudah digunakan.", fieldErrors: { slug: "Gunakan slug yang berbeda." } };
  }
  console.error("[faq] Action failed");
  return { status: "error", message: "Perubahan FAQ belum dapat disimpan. Coba lagi." };
}

function revalidateFaqAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/faq");
  revalidatePath("/admin/faq/categories");
}

function revalidatePublishedFaq() {
  updateTag("published-faq");
  revalidatePath("/id/faq");
  revalidatePath("/en/faq");
}

export async function saveFaqItemAction(_previousState: FaqActionState, formData: FormData): Promise<FaqActionState> {
  const validation = validateFaqDraftForm(formData);
  if (!validation.success) return { status: "error", message: "Periksa kembali field yang ditandai.", fieldErrors: validation.errors };

  let faqItemId: string;
  try {
    const actor = await requireCmsUser();
    faqItemId = await saveFaqDraft(validation.data, actor);
  } catch (error) {
    return faqError(error);
  }

  revalidateFaqAdmin();
  revalidatePath(`/admin/faq/${faqItemId}`);
  redirect(`/admin/faq/${faqItemId}?saved=1`);
}

export async function faqWorkflowAction(_previousState: FaqActionState, formData: FormData): Promise<FaqActionState> {
  const faqItemId = formData.get("faqItemId");
  const lockVersion = Number(formData.get("lockVersion"));
  const intent = formData.get("intent");
  if (typeof faqItemId !== "string" || !faqItemId || !Number.isSafeInteger(lockVersion) || lockVersion < 0) {
    return { status: "error", message: "Referensi FAQ tidak valid. Muat ulang halaman." };
  }

  try {
    if (intent === "review") {
      await requestFaqReview(faqItemId, lockVersion, await requireCmsUser());
    } else if (intent === "publish") {
      await publishFaqItem(faqItemId, lockVersion, await requireCmsAdmin());
      revalidatePublishedFaq();
    } else if (intent === "unpublish" || intent === "archive" || intent === "restore") {
      await updateFaqPublication(faqItemId, lockVersion, intent, await requireCmsAdmin());
      revalidatePublishedFaq();
    } else {
      return { status: "error", message: "Tindakan tidak dikenali." };
    }
  } catch (error) {
    return faqError(error);
  }

  revalidateFaqAdmin();
  revalidatePath(`/admin/faq/${faqItemId}`);
  redirect(`/admin/faq/${faqItemId}?updated=1`);
}

export async function saveFaqCategoryAction(_previousState: FaqActionState, formData: FormData): Promise<FaqActionState> {
  const validation = validateFaqCategoryForm(formData);
  if (!validation.success) return { status: "error", message: "Periksa data kategori.", fieldErrors: validation.errors };
  try {
    await saveFaqCategory(validation.data, await requireCmsAdmin());
  } catch (error) {
    return faqError(error);
  }
  revalidateFaqAdmin();
  revalidatePublishedFaq();
  redirect("/admin/faq/categories?saved=1");
}

export async function faqCategoryStateAction(_previousState: FaqActionState, formData: FormData): Promise<FaqActionState> {
  const categoryId = formData.get("categoryId");
  const lockVersion = Number(formData.get("lockVersion"));
  const intent = formData.get("intent");
  if (typeof categoryId !== "string" || !categoryId || !Number.isSafeInteger(lockVersion) || (intent !== "archive" && intent !== "restore")) {
    return { status: "error", message: "Referensi kategori tidak valid." };
  }
  try {
    await updateFaqCategoryState(categoryId, lockVersion, intent, await requireCmsAdmin());
  } catch (error) {
    return faqError(error);
  }
  revalidateFaqAdmin();
  revalidatePublishedFaq();
  redirect("/admin/faq/categories?updated=1");
}

export async function reorderFaqItemAction(formData: FormData) {
  const faqItemId = formData.get("faqItemId");
  const direction = formData.get("direction");
  if (typeof faqItemId !== "string" || (direction !== "up" && direction !== "down")) return;
  await moveFaqItem(faqItemId, direction, await requireCmsAdmin());
  revalidateFaqAdmin();
  revalidatePublishedFaq();
}

export async function reorderFaqCategoryAction(formData: FormData) {
  const categoryId = formData.get("categoryId");
  const direction = formData.get("direction");
  if (typeof categoryId !== "string" || (direction !== "up" && direction !== "down")) return;
  await moveFaqCategory(categoryId, direction, await requireCmsAdmin());
  revalidateFaqAdmin();
  revalidatePublishedFaq();
}
