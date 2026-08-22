import { head } from "@vercel/blob";

import { requireCmsUser } from "@/lib/cms-auth";
import { registerBlobAsset } from "@/lib/cms-service";

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  try {
    const actor = await requireCmsUser();
    const body = (await request.json()) as { url?: unknown; originalName?: unknown };
    if (typeof body.url !== "string" || typeof body.originalName !== "string") throw new Error("Payload tidak valid.");

    const url = new URL(body.url);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".public.blob.vercel-storage.com")) {
      throw new Error("URL Blob tidak valid.");
    }

    const blob = await head(body.url);
    if (!allowedContentTypes.has(blob.contentType) || blob.size > 8 * 1024 * 1024) {
      throw new Error("Tipe atau ukuran file tidak diizinkan.");
    }

    const asset = await registerBlobAsset({
      url: blob.url,
      pathname: blob.pathname,
      mimeType: blob.contentType,
      size: blob.size,
      originalName: body.originalName,
      actorId: actor.id,
    });
    return Response.json(asset);
  } catch {
    return Response.json({ error: "Gambar belum dapat didaftarkan." }, { status: 400 });
  }
}

