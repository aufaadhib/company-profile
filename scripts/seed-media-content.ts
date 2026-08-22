import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

import { MediaAssetSource, MediaWorkflowStatus } from "../generated/prisma/enums";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { mediaPageContent } from "../content/media-content";
import type { MediaRevisionPayload } from "../lib/cms-validation";

config({ path: ".env.local" });
config();

function mimeType(pathname: string) {
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".avif")) return "image/avif";
  return "image/jpeg";
}

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  let created = 0;
  let skipped = 0;

  for (const indonesia of mediaPageContent.id.items) {
    const english = mediaPageContent.en.items.find((item) => item.id === indonesia.id);
    if (!english) throw new Error(`English content is missing for ${indonesia.id}.`);

    const existing = await prisma.mediaArticle.findUnique({ where: { slug: indonesia.slug }, select: { id: true } });
    if (existing) {
      skipped += 1;
      continue;
    }

    const payload: MediaRevisionPayload = {
      category: indonesia.category,
      publishedAt: indonesia.publishedAt,
      isFeatured: indonesia.featured === true,
      translations: {
        id: { title: indonesia.title, excerpt: indonesia.excerpt, imageAlt: indonesia.imageAlt, body: indonesia.body },
        en: { title: english.title, excerpt: english.excerpt, imageAlt: english.imageAlt, body: english.body },
      },
    };

    await prisma.$transaction(async (transaction) => {
      let asset = await transaction.mediaAsset.findFirst({
        where: { source: MediaAssetSource.LOCAL, url: indonesia.image },
      });
      asset ??= await transaction.mediaAsset.create({
        data: {
          source: MediaAssetSource.LOCAL,
          url: indonesia.image,
          pathname: indonesia.image,
          mimeType: mimeType(indonesia.image),
          size: 0,
          originalName: indonesia.image.split("/").at(-1) ?? "media-image",
        },
      });

      const article = await transaction.mediaArticle.create({
        data: {
          slug: indonesia.slug,
          workflowStatus: MediaWorkflowStatus.DRAFT,
          isFeatured: indonesia.featured === true,
        },
      });
      const revision = await transaction.mediaRevision.create({
        data: {
          articleId: article.id,
          revisionNumber: 1,
          assetId: asset.id,
          payload: payload as unknown as Prisma.InputJsonValue,
        },
      });
      await transaction.mediaArticle.update({
        where: { id: article.id },
        data: {
          draftRevisionId: revision.id,
          publishedRevisionId: revision.id,
          lockVersion: 1,
        },
      });
      await transaction.auditLog.create({
        data: { action: "ARTICLE_IMPORTED", entityType: "MediaArticle", entityId: article.id },
      });
    });
    created += 1;
  }

  await prisma.$disconnect();
  console.log(JSON.stringify({ created, skipped }));
}

seed().catch((error) => {
  console.error("Media seed failed.", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
