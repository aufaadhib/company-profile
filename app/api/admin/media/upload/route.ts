import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { requireCmsUser } from "@/lib/cms-auth";

const allowedContentTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        await requireCmsUser();
        if (!pathname.startsWith("cms/media/")) throw new Error("Path upload tidak valid.");
        return {
          allowedContentTypes,
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
          access: "public",
        };
      },
    });
    return Response.json(response);
  } catch {
    return Response.json({ error: "Upload tidak diizinkan." }, { status: 400 });
  }
}

