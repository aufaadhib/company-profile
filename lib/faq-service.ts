import "server-only";

import { unstable_cache } from "next/cache";

import { Prisma } from "@/generated/prisma/client";
import { FaqWorkflowStatus } from "@/generated/prisma/enums";
import type { Locale } from "@/content/site-content";
import type { CmsUser } from "@/lib/cms-auth";
import { CmsConflictError, CmsContentError } from "@/lib/cms-service";
import {
  hasFaqVersionConflict,
  isFaqRevisionPayload,
  validateFaqForPublication,
  type FaqCategoryInput,
  type FaqDraftInput,
  type FaqRevisionPayload,
} from "@/lib/faq-validation";
import { getPrisma } from "@/lib/prisma";

export type FaqAdminStatus = "draft" | "review" | "published" | "changes" | "archived";

export type FaqCategoryAdminData = {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  sortOrder: number;
  lockVersion: number;
  archived: boolean;
  itemCount: number;
};

export type FaqItemSummary = {
  id: string;
  question: string;
  categoryTitle: string;
  categoryId: string;
  status: FaqAdminStatus;
  lockVersion: number;
  sortOrder: number;
  updatedAt: string;
};

export type FaqEditorData = {
  id: string;
  categoryId: string;
  lockVersion: number;
  status: FaqAdminStatus;
  publishedRevisionId: string | null;
  payload: FaqRevisionPayload;
};

export type PublishedFaqCategory = {
  id: string;
  slug: string;
  title: string;
  items: Array<{ id: string; question: string; answer: string }>;
};

function readPayload(value: Prisma.JsonValue): FaqRevisionPayload {
  if (!isFaqRevisionPayload(value)) throw new CmsContentError("Payload revision FAQ tidak valid.");
  return value;
}

function inputJson(payload: FaqRevisionPayload) {
  return payload as unknown as Prisma.InputJsonValue;
}

function faqStatus(item: {
  archivedAt: Date | null;
  workflowStatus: FaqWorkflowStatus;
  draftRevisionId: string | null;
  publishedRevisionId: string | null;
}): FaqAdminStatus {
  if (item.archivedAt) return "archived";
  if (item.workflowStatus === FaqWorkflowStatus.IN_REVIEW) return "review";
  if (!item.publishedRevisionId) return "draft";
  return item.draftRevisionId === item.publishedRevisionId ? "published" : "changes";
}

const loadPublishedFaq = unstable_cache(
  async () => {
    const items = await getPrisma().faqItem.findMany({
      where: { archivedAt: null, publishedRevisionId: { not: null } },
      include: { publishedRevision: { include: { category: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return items.flatMap((item) => {
      const revision = item.publishedRevision;
      if (!revision || revision.category.archivedAt || !isFaqRevisionPayload(revision.payload)) return [];
      return [{
        id: item.id,
        category: {
          id: revision.category.id,
          slug: revision.category.slug,
          titleId: revision.category.titleId,
          titleEn: revision.category.titleEn,
          sortOrder: revision.category.sortOrder,
        },
        sortOrder: item.sortOrder,
        payload: revision.payload,
      }];
    });
  },
  ["published-faq"],
  { tags: ["published-faq"], revalidate: 60 * 60 },
);

export async function getPublishedFaq(locale: Locale): Promise<PublishedFaqCategory[]> {
  const rows = await loadPublishedFaq();
  const categories = new Map<string, PublishedFaqCategory & { sortOrder: number }>();

  for (const row of rows) {
    const category = categories.get(row.category.id) ?? {
      id: row.category.id,
      slug: row.category.slug,
      title: locale === "id" ? row.category.titleId : row.category.titleEn,
      sortOrder: row.category.sortOrder,
      items: [],
    };
    const translation = row.payload.translations[locale];
    category.items.push({ id: row.id, question: translation.question, answer: translation.answer });
    categories.set(row.category.id, category);
  }

  return [...categories.values()]
    .sort((first, second) => first.sortOrder - second.sortOrder || first.title.localeCompare(second.title))
    .map((category) => ({ id: category.id, slug: category.slug, title: category.title, items: category.items }));
}

export async function getFaqCategoriesAdmin(): Promise<FaqCategoryAdminData[]> {
  const categories = await getPrisma().faqCategory.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    titleId: category.titleId,
    titleEn: category.titleEn,
    sortOrder: category.sortOrder,
    lockVersion: category.lockVersion,
    archived: Boolean(category.archivedAt),
    itemCount: category._count.items,
  }));
}

export async function getActiveFaqCategories() {
  return getPrisma().faqCategory.findMany({
    where: { archivedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, slug: true, titleId: true, titleEn: true },
  });
}

export async function getCmsFaqItems(): Promise<FaqItemSummary[]> {
  const items = await getPrisma().faqItem.findMany({
    include: { category: true, draftRevision: { include: { category: true } }, publishedRevision: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { updatedAt: "desc" }],
  });
  return items.map((item) => {
    const revision = item.draftRevision ?? item.publishedRevision;
    const payload = revision && isFaqRevisionPayload(revision.payload) ? revision.payload : null;
    return {
      id: item.id,
      question: payload?.translations.id.question || "Pertanyaan belum diisi",
      categoryTitle: item.draftRevision?.category.titleId ?? item.category.titleId,
      categoryId: item.draftRevision?.categoryId ?? item.categoryId,
      status: faqStatus(item),
      lockVersion: item.lockVersion,
      sortOrder: item.sortOrder,
      updatedAt: item.updatedAt.toISOString(),
    };
  });
}

export async function getCmsFaqItem(id: string): Promise<FaqEditorData | null> {
  const item = await getPrisma().faqItem.findUnique({ where: { id }, include: { draftRevision: true } });
  if (!item?.draftRevision) return null;
  return {
    id: item.id,
    categoryId: item.draftRevision.categoryId,
    lockVersion: item.lockVersion,
    status: faqStatus(item),
    publishedRevisionId: item.publishedRevisionId,
    payload: readPayload(item.draftRevision.payload),
  };
}

async function assertActiveCategory(categoryId: string, transaction: Prisma.TransactionClient) {
  const category = await transaction.faqCategory.findFirst({ where: { id: categoryId, archivedAt: null } });
  if (!category) throw new CmsContentError("Kategori FAQ tidak ditemukan atau sedang nonaktif.", { categoryId: "Pilih kategori aktif." });
  return category;
}

function assertComplete(payload: FaqRevisionPayload) {
  const fieldErrors = validateFaqForPublication(payload);
  if (Object.keys(fieldErrors).length > 0) {
    throw new CmsContentError("Lengkapi pertanyaan dan jawaban dalam kedua bahasa sebelum melanjutkan.", fieldErrors);
  }
}

export async function saveFaqDraft(input: FaqDraftInput, actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    await assertActiveCategory(input.categoryId, transaction);

    if (!input.faqItemId) {
      const last = await transaction.faqItem.aggregate({ where: { categoryId: input.categoryId }, _max: { sortOrder: true } });
      const item = await transaction.faqItem.create({
        data: {
          categoryId: input.categoryId,
          sortOrder: (last._max.sortOrder ?? -1) + 1,
          createdById: actor.id,
          updatedById: actor.id,
        },
      });
      const revision = await transaction.faqRevision.create({
        data: { faqItemId: item.id, categoryId: input.categoryId, revisionNumber: 1, payload: inputJson(input.payload), createdById: actor.id },
      });
      await transaction.faqItem.update({ where: { id: item.id }, data: { draftRevisionId: revision.id, lockVersion: 1 } });
      await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_CREATED", entityType: "FaqItem", entityId: item.id } });
      return item.id;
    }

    const current = await transaction.faqItem.findUnique({ where: { id: input.faqItemId } });
    if (!current || current.archivedAt) throw new CmsContentError("FAQ tidak ditemukan atau sudah diarsipkan.");
    if (hasFaqVersionConflict(current.lockVersion, input.lockVersion)) throw new CmsConflictError("FAQ telah diubah pengguna lain. Muat ulang sebelum menyimpan kembali.");

    const result = await transaction.faqItem.updateMany({
      where: { id: current.id, lockVersion: current.lockVersion },
      data: {
        categoryId: current.publishedRevisionId ? current.categoryId : input.categoryId,
        workflowStatus: FaqWorkflowStatus.DRAFT,
        updatedById: actor.id,
        lockVersion: { increment: 1 },
      },
    });
    if (result.count !== 1) throw new CmsConflictError("FAQ berubah saat disimpan. Muat ulang halaman.");

    const latest = await transaction.faqRevision.aggregate({ where: { faqItemId: current.id }, _max: { revisionNumber: true } });
    const revision = await transaction.faqRevision.create({
      data: {
        faqItemId: current.id,
        categoryId: input.categoryId,
        revisionNumber: (latest._max.revisionNumber ?? 0) + 1,
        payload: inputJson(input.payload),
        createdById: actor.id,
      },
    });
    await transaction.faqItem.update({ where: { id: current.id }, data: { draftRevisionId: revision.id } });
    await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_DRAFT_SAVED", entityType: "FaqItem", entityId: current.id } });
    return current.id;
  });
}

export async function requestFaqReview(faqItemId: string, lockVersion: number, actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    const item = await transaction.faqItem.findUnique({ where: { id: faqItemId }, include: { draftRevision: true } });
    if (!item?.draftRevision || item.archivedAt) throw new CmsContentError("Draft FAQ tidak ditemukan.");
    if (hasFaqVersionConflict(item.lockVersion, lockVersion)) throw new CmsConflictError("FAQ telah berubah. Muat ulang halaman.");
    await assertActiveCategory(item.draftRevision.categoryId, transaction);
    assertComplete(readPayload(item.draftRevision.payload));
    const result = await transaction.faqItem.updateMany({
      where: { id: item.id, lockVersion },
      data: { workflowStatus: FaqWorkflowStatus.IN_REVIEW, lockVersion: { increment: 1 }, updatedById: actor.id },
    });
    if (result.count !== 1) throw new CmsConflictError("FAQ berubah saat diajukan. Muat ulang halaman.");
    await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_REVIEW_REQUESTED", entityType: "FaqItem", entityId: item.id } });
  });
}

export async function publishFaqItem(faqItemId: string, lockVersion: number, actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    const item = await transaction.faqItem.findUnique({ where: { id: faqItemId }, include: { draftRevision: true, publishedRevision: true } });
    if (!item?.draftRevision || item.archivedAt) throw new CmsContentError("Draft FAQ tidak ditemukan.");
    if (hasFaqVersionConflict(item.lockVersion, lockVersion)) throw new CmsConflictError("FAQ telah berubah. Muat ulang halaman.");
    if (item.workflowStatus !== FaqWorkflowStatus.IN_REVIEW) throw new CmsContentError("Ajukan FAQ untuk review sebelum menerbitkan.");
    await assertActiveCategory(item.draftRevision.categoryId, transaction);
    assertComplete(readPayload(item.draftRevision.payload));

    let sortOrder = item.sortOrder;
    if (!item.publishedRevision || item.publishedRevision.categoryId !== item.draftRevision.categoryId) {
      const last = await transaction.faqItem.aggregate({ where: { categoryId: item.draftRevision.categoryId, id: { not: item.id } }, _max: { sortOrder: true } });
      sortOrder = (last._max.sortOrder ?? -1) + 1;
    }
    const result = await transaction.faqItem.updateMany({
      where: { id: item.id, lockVersion },
      data: {
        categoryId: item.draftRevision.categoryId,
        sortOrder,
        publishedRevisionId: item.draftRevision.id,
        workflowStatus: FaqWorkflowStatus.DRAFT,
        publishedById: actor.id,
        updatedById: actor.id,
        lockVersion: { increment: 1 },
      },
    });
    if (result.count !== 1) throw new CmsConflictError("FAQ berubah saat diterbitkan. Muat ulang halaman.");
    await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_PUBLISHED", entityType: "FaqItem", entityId: item.id } });
  });
}

export async function updateFaqPublication(
  faqItemId: string,
  lockVersion: number,
  intent: "unpublish" | "archive" | "restore",
  actor: CmsUser,
) {
  const data = intent === "unpublish"
    ? { publishedRevisionId: null }
    : intent === "archive"
      ? { archivedAt: new Date(), publishedRevisionId: null }
      : { archivedAt: null };
  const action = intent === "unpublish" ? "FAQ_UNPUBLISHED" : intent === "archive" ? "FAQ_ARCHIVED" : "FAQ_RESTORED";
  return getPrisma().$transaction(async (transaction) => {
    const result = await transaction.faqItem.updateMany({
      where: { id: faqItemId, lockVersion },
      data: { ...data, updatedById: actor.id, lockVersion: { increment: 1 } },
    });
    if (result.count !== 1) throw new CmsConflictError("FAQ telah berubah. Muat ulang halaman.");
    await transaction.auditLog.create({ data: { actorId: actor.id, action, entityType: "FaqItem", entityId: faqItemId } });
  });
}

export async function saveFaqCategory(input: FaqCategoryInput, actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    if (!input.categoryId) {
      const last = await transaction.faqCategory.aggregate({ _max: { sortOrder: true } });
      const category = await transaction.faqCategory.create({
        data: { slug: input.slug, titleId: input.titleId, titleEn: input.titleEn, sortOrder: (last._max.sortOrder ?? -1) + 1, createdById: actor.id, updatedById: actor.id },
      });
      await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_CATEGORY_CREATED", entityType: "FaqCategory", entityId: category.id } });
      return;
    }
    const result = await transaction.faqCategory.updateMany({
      where: { id: input.categoryId, lockVersion: input.lockVersion },
      data: { slug: input.slug, titleId: input.titleId, titleEn: input.titleEn, updatedById: actor.id, lockVersion: { increment: 1 } },
    });
    if (result.count !== 1) throw new CmsConflictError("Kategori telah berubah. Muat ulang halaman.");
    await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_CATEGORY_UPDATED", entityType: "FaqCategory", entityId: input.categoryId } });
  });
}

export async function updateFaqCategoryState(categoryId: string, lockVersion: number, intent: "archive" | "restore", actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    const result = await transaction.faqCategory.updateMany({
      where: { id: categoryId, lockVersion },
      data: { archivedAt: intent === "archive" ? new Date() : null, updatedById: actor.id, lockVersion: { increment: 1 } },
    });
    if (result.count !== 1) throw new CmsConflictError("Kategori telah berubah. Muat ulang halaman.");
    await transaction.auditLog.create({
      data: { actorId: actor.id, action: intent === "archive" ? "FAQ_CATEGORY_ARCHIVED" : "FAQ_CATEGORY_RESTORED", entityType: "FaqCategory", entityId: categoryId },
    });
  });
}

export async function moveFaqItem(faqItemId: string, direction: "up" | "down", actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    const item = await transaction.faqItem.findUnique({ where: { id: faqItemId } });
    if (!item || item.archivedAt || !item.publishedRevisionId) throw new CmsContentError("FAQ published tidak ditemukan.");
    const siblings = await transaction.faqItem.findMany({
      where: { categoryId: item.categoryId, archivedAt: null, publishedRevisionId: { not: null } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, sortOrder: true },
    });
    const index = siblings.findIndex((sibling) => sibling.id === item.id);
    const target = siblings[direction === "up" ? index - 1 : index + 1];
    if (!target) return;
    await transaction.faqItem.update({ where: { id: item.id }, data: { sortOrder: target.sortOrder } });
    await transaction.faqItem.update({ where: { id: target.id }, data: { sortOrder: item.sortOrder } });
    await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_REORDERED", entityType: "FaqItem", entityId: item.id } });
  });
}

export async function moveFaqCategory(categoryId: string, direction: "up" | "down", actor: CmsUser) {
  return getPrisma().$transaction(async (transaction) => {
    const categories = await transaction.faqCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, sortOrder: true } });
    const index = categories.findIndex((category) => category.id === categoryId);
    const current = categories[index];
    const target = categories[direction === "up" ? index - 1 : index + 1];
    if (!current || !target) return;
    await transaction.faqCategory.update({ where: { id: current.id }, data: { sortOrder: target.sortOrder } });
    await transaction.faqCategory.update({ where: { id: target.id }, data: { sortOrder: current.sortOrder } });
    await transaction.auditLog.create({ data: { actorId: actor.id, action: "FAQ_CATEGORY_REORDERED", entityType: "FaqCategory", entityId: current.id } });
  });
}
