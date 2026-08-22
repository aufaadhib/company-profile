import "server-only";

import { unstable_cache } from "next/cache";

import { MediaAssetSource, MediaWorkflowStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import type { Locale } from "@/content/site-content";
import type { MediaItem } from "@/content/media-content";
import type { CmsUser } from "@/lib/cms-auth";
import {
  isMediaRevisionPayload,
  validateRevisionForPublication,
  type MediaDraftInput,
  type MediaRevisionPayload,
} from "@/lib/cms-validation";
import { getPrisma } from "@/lib/prisma";

export class CmsContentError extends Error {
  constructor(message: string, public fieldErrors: Record<string, string> = {}) {
    super(message);
  }
}

export class CmsConflictError extends CmsContentError {}

type RevisionRecord = {
  id: string;
  revisionNumber: number;
  payload: Prisma.JsonValue;
  assetId: string | null;
  asset: { id: string; url: string; originalName: string; source: MediaAssetSource } | null;
  createdAt: Date;
};

export type CmsArticleStatus = "draft" | "review" | "published" | "changes" | "archived";

export type CmsArticleSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: CmsArticleStatus;
  isFeatured: boolean;
  lockVersion: number;
  updatedAt: string;
};

export type CmsArticleEditorData = {
  id: string;
  slug: string;
  lockVersion: number;
  status: CmsArticleStatus;
  publishedRevisionId: string | null;
  draftRevisionId: string;
  asset: RevisionRecord["asset"];
  payload: MediaRevisionPayload;
};

function readPayload(value: Prisma.JsonValue): MediaRevisionPayload {
  if (!isMediaRevisionPayload(value)) throw new CmsContentError("Payload revision Media tidak valid.");
  return value;
}

function inputJson(payload: MediaRevisionPayload) {
  return payload as unknown as Prisma.InputJsonValue;
}

function articleStatus(article: {
  archivedAt: Date | null;
  workflowStatus: MediaWorkflowStatus;
  draftRevisionId: string | null;
  publishedRevisionId: string | null;
}): CmsArticleStatus {
  if (article.archivedAt) return "archived";
  if (article.workflowStatus === MediaWorkflowStatus.IN_REVIEW) return "review";
  if (!article.publishedRevisionId) return "draft";
  return article.draftRevisionId === article.publishedRevisionId ? "published" : "changes";
}

const loadPublishedArticles = unstable_cache(
  async () => {
    const articles = await getPrisma().mediaArticle.findMany({
      where: { archivedAt: null, publishedRevisionId: { not: null } },
      include: { publishedRevision: { include: { asset: true } } },
    });

    return articles.flatMap((article) => {
      const revision = article.publishedRevision;
      if (!revision?.asset || !isMediaRevisionPayload(revision.payload)) return [];
      return [{
        id: article.id,
        slug: article.slug,
        isFeatured: article.isFeatured,
        assetUrl: revision.asset.url,
        payload: revision.payload,
      }];
    }).sort((first, second) => second.payload.publishedAt.localeCompare(first.payload.publishedAt));
  },
  ["published-media"],
  { tags: ["published-media"], revalidate: 60 * 60 },
);

export async function getPublishedMedia(locale: Locale): Promise<MediaItem[]> {
  const articles = await loadPublishedArticles();
  return articles.map((article) => {
    const translation = article.payload.translations[locale];
    return {
      id: article.id,
      slug: article.slug,
      category: article.payload.category,
      title: translation.title,
      excerpt: translation.excerpt,
      body: translation.body,
      publishedAt: article.payload.publishedAt,
      image: article.assetUrl,
      imageAlt: translation.imageAlt,
      featured: article.isFeatured,
    };
  });
}

export async function getPublishedMediaItem(locale: Locale, slug: string) {
  const items = await getPublishedMedia(locale);
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getCmsMediaArticles(): Promise<CmsArticleSummary[]> {
  const articles = await getPrisma().mediaArticle.findMany({
    include: { draftRevision: true, publishedRevision: true },
    orderBy: { updatedAt: "desc" },
  });

  return articles.map((article) => {
    const revision = article.draftRevision ?? article.publishedRevision;
    const payload = revision && isMediaRevisionPayload(revision.payload) ? revision.payload : null;
    return {
      id: article.id,
      slug: article.slug,
      title: payload?.translations.id.title || "Tanpa judul",
      category: payload?.category ?? "news",
      status: articleStatus(article),
      isFeatured: article.isFeatured,
      lockVersion: article.lockVersion,
      updatedAt: article.updatedAt.toISOString(),
    };
  });
}

export async function getCmsArticle(id: string): Promise<CmsArticleEditorData | null> {
  const article = await getPrisma().mediaArticle.findUnique({
    where: { id },
    include: { draftRevision: { include: { asset: true } } },
  });
  if (!article?.draftRevision) return null;

  return {
    id: article.id,
    slug: article.slug,
    lockVersion: article.lockVersion,
    status: articleStatus(article),
    publishedRevisionId: article.publishedRevisionId,
    draftRevisionId: article.draftRevision.id,
    asset: article.draftRevision.asset
      ? {
          id: article.draftRevision.asset.id,
          url: article.draftRevision.asset.url,
          originalName: article.draftRevision.asset.originalName,
          source: article.draftRevision.asset.source,
        }
      : null,
    payload: readPayload(article.draftRevision.payload),
  };
}

export async function getCmsDashboardData() {
  const prisma = getPrisma();
  const [articles, activity, editorCount] = await Promise.all([
    getCmsMediaArticles(),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { actor: { select: { name: true } } },
    }),
    prisma.user.count({ where: { role: "editor", banned: { not: true } } }),
  ]);

  return {
    articles,
    editorCount,
    counts: {
      review: articles.filter((article) => article.status === "review").length,
      draft: articles.filter((article) => article.status === "draft" || article.status === "changes").length,
      published: articles.filter((article) => article.status === "published" || article.status === "changes").length,
    },
    activity: activity.map((entry) => ({
      id: entry.id,
      action: entry.action,
      actor: entry.actor?.name ?? "Sistem",
      createdAt: entry.createdAt.toISOString(),
    })),
  };
}

async function assertRevisionIsComplete(revision: RevisionRecord) {
  const payload = readPayload(revision.payload);
  const fieldErrors = validateRevisionForPublication(payload, revision.assetId);
  if (Object.keys(fieldErrors).length > 0) {
    throw new CmsContentError("Lengkapi kedua bahasa dan gambar sebelum melanjutkan.", fieldErrors);
  }
  return payload;
}

export async function saveMediaDraft(input: MediaDraftInput, actor: CmsUser) {
  const prisma = getPrisma();

  return prisma.$transaction(async (transaction) => {
    if (!input.articleId) {
      const article = await transaction.mediaArticle.create({
        data: {
          slug: input.slug,
          createdById: actor.id,
          updatedById: actor.id,
        },
      });
      const revision = await transaction.mediaRevision.create({
        data: {
          articleId: article.id,
          revisionNumber: 1,
          assetId: input.assetId,
          payload: inputJson(input.payload),
          createdById: actor.id,
        },
      });
      await transaction.mediaArticle.update({
        where: { id: article.id },
        data: { draftRevisionId: revision.id, lockVersion: 1 },
      });
      await transaction.auditLog.create({
        data: { actorId: actor.id, action: "ARTICLE_CREATED", entityType: "MediaArticle", entityId: article.id },
      });
      return article.id;
    }

    const current = await transaction.mediaArticle.findUnique({ where: { id: input.articleId } });
    if (!current || current.archivedAt) throw new CmsContentError("Artikel tidak ditemukan atau sudah diarsipkan.");
    if (current.lockVersion !== input.lockVersion) {
      throw new CmsConflictError("Artikel telah diubah pengguna lain. Muat ulang sebelum menyimpan kembali.");
    }
    if (current.publishedRevisionId && current.slug !== input.slug) {
      throw new CmsContentError("Slug tidak dapat diubah setelah artikel pernah diterbitkan.", { slug: "Slug sudah dikunci." });
    }

    const updated = await transaction.mediaArticle.updateMany({
      where: { id: current.id, lockVersion: current.lockVersion },
      data: {
        slug: input.slug,
        workflowStatus: MediaWorkflowStatus.DRAFT,
        updatedById: actor.id,
        lockVersion: { increment: 1 },
      },
    });
    if (updated.count !== 1) throw new CmsConflictError("Artikel berubah saat disimpan. Muat ulang halaman.");

    const latest = await transaction.mediaRevision.aggregate({
      where: { articleId: current.id },
      _max: { revisionNumber: true },
    });
    const revision = await transaction.mediaRevision.create({
      data: {
        articleId: current.id,
        revisionNumber: (latest._max.revisionNumber ?? 0) + 1,
        assetId: input.assetId,
        payload: inputJson(input.payload),
        createdById: actor.id,
      },
    });
    await transaction.mediaArticle.update({ where: { id: current.id }, data: { draftRevisionId: revision.id } });
    await transaction.auditLog.create({
      data: { actorId: actor.id, action: "DRAFT_SAVED", entityType: "MediaArticle", entityId: current.id },
    });
    return current.id;
  });
}

export async function requestMediaReview(articleId: string, lockVersion: number, actor: CmsUser) {
  const prisma = getPrisma();
  return prisma.$transaction(async (transaction) => {
    const article = await transaction.mediaArticle.findUnique({
      where: { id: articleId },
      include: { draftRevision: { include: { asset: true } } },
    });
    if (!article?.draftRevision || article.archivedAt) throw new CmsContentError("Draft artikel tidak ditemukan.");
    if (article.lockVersion !== lockVersion) throw new CmsConflictError("Artikel telah berubah. Muat ulang halaman.");
    await assertRevisionIsComplete(article.draftRevision);

    const result = await transaction.mediaArticle.updateMany({
      where: { id: articleId, lockVersion },
      data: { workflowStatus: MediaWorkflowStatus.IN_REVIEW, lockVersion: { increment: 1 }, updatedById: actor.id },
    });
    if (result.count !== 1) throw new CmsConflictError("Artikel berubah saat diajukan. Muat ulang halaman.");
    await transaction.auditLog.create({
      data: { actorId: actor.id, action: "REVIEW_REQUESTED", entityType: "MediaArticle", entityId: articleId },
    });
  });
}

export async function publishMediaArticle(articleId: string, lockVersion: number, actor: CmsUser) {
  const prisma = getPrisma();
  return prisma.$transaction(async (transaction) => {
    const article = await transaction.mediaArticle.findUnique({
      where: { id: articleId },
      include: { draftRevision: { include: { asset: true } } },
    });
    if (!article?.draftRevision || article.archivedAt) throw new CmsContentError("Draft artikel tidak ditemukan.");
    if (article.lockVersion !== lockVersion) throw new CmsConflictError("Artikel telah berubah. Muat ulang halaman.");
    if (article.workflowStatus !== MediaWorkflowStatus.IN_REVIEW) {
      throw new CmsContentError("Ajukan artikel untuk review sebelum menerbitkan.");
    }
    const payload = await assertRevisionIsComplete(article.draftRevision);

    if (payload.isFeatured) {
      await transaction.mediaArticle.updateMany({
        where: { id: { not: article.id }, isFeatured: true },
        data: { isFeatured: false },
      });
    }
    const result = await transaction.mediaArticle.updateMany({
      where: { id: article.id, lockVersion },
      data: {
        publishedRevisionId: article.draftRevision.id,
        isFeatured: payload.isFeatured,
        workflowStatus: MediaWorkflowStatus.DRAFT,
        publishedById: actor.id,
        updatedById: actor.id,
        lockVersion: { increment: 1 },
      },
    });
    if (result.count !== 1) throw new CmsConflictError("Artikel berubah saat diterbitkan. Muat ulang halaman.");
    await transaction.auditLog.create({
      data: { actorId: actor.id, action: "ARTICLE_PUBLISHED", entityType: "MediaArticle", entityId: article.id },
    });
  });
}

export async function updateMediaPublication(
  articleId: string,
  lockVersion: number,
  action: "unpublish" | "archive" | "restore",
  actor: CmsUser,
) {
  const data = action === "unpublish"
    ? { publishedRevisionId: null, isFeatured: false }
    : action === "archive"
      ? { archivedAt: new Date(), publishedRevisionId: null, isFeatured: false }
      : { archivedAt: null, isFeatured: false };
  const auditAction = action === "unpublish" ? "ARTICLE_UNPUBLISHED" : action === "archive" ? "ARTICLE_ARCHIVED" : "ARTICLE_RESTORED";

  return getPrisma().$transaction(async (transaction) => {
    const result = await transaction.mediaArticle.updateMany({
      where: { id: articleId, lockVersion },
      data: { ...data, updatedById: actor.id, lockVersion: { increment: 1 } },
    });
    if (result.count !== 1) throw new CmsConflictError("Artikel telah berubah. Muat ulang halaman.");
    await transaction.auditLog.create({
      data: { actorId: actor.id, action: auditAction, entityType: "MediaArticle", entityId: articleId },
    });
  });
}

export async function registerBlobAsset(input: {
  url: string;
  pathname: string;
  mimeType: string;
  size: number;
  originalName: string;
  actorId: string;
}) {
  return getPrisma().mediaAsset.create({
    data: {
      source: MediaAssetSource.BLOB,
      url: input.url,
      pathname: input.pathname,
      mimeType: input.mimeType,
      size: input.size,
      originalName: input.originalName.slice(0, 255),
      createdById: input.actorId,
    },
    select: { id: true, url: true, originalName: true },
  });
}

export async function getCmsEditors() {
  const editors = await getPrisma().user.findMany({
    where: { role: "editor" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      banned: true,
      createdAt: true,
    },
  });

  return editors.map((editor) => ({
    ...editor,
    banned: editor.banned === true,
    createdAt: editor.createdAt.toISOString(),
  }));
}

export function writeCmsAudit(actorId: string, action: string, entityType: string, entityId: string) {
  return getPrisma().auditLog.create({
    data: { actorId, action, entityType, entityId },
  });
}
