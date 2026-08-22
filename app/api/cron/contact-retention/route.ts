import { timingSafeEqual } from "node:crypto";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function validSecret(authorization: string | null) {
  const expected = process.env.CRON_SECRET;
  if (!expected || !authorization?.startsWith("Bearer ")) return false;

  const supplied = authorization.slice(7);
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function GET(request: Request) {
  if (!validSecret(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getPrisma().contactSubmission.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });

  return Response.json(
    { deleted: result.count },
    { headers: { "Cache-Control": "no-store" } },
  );
}
