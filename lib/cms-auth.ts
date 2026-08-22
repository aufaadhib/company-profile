import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth";
import type { CmsRole } from "@/lib/auth-permissions";

export class CmsAuthorizationError extends Error {}

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: CmsRole;
};

export const getCmsUser = cache(async (): Promise<CmsUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const role = session.user.role === "admin" ? "admin" : session.user.role === "editor" ? "editor" : null;
  if (!role) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role,
  };
});

export async function requireCmsUser() {
  const user = await getCmsUser();
  if (!user) throw new CmsAuthorizationError("Sesi admin tidak valid.");
  return user;
}

export async function requireCmsAdmin() {
  const user = await requireCmsUser();
  const ownerEmail = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();

  if (user.role !== "admin" || !ownerEmail || user.email.toLowerCase() !== ownerEmail) {
    throw new CmsAuthorizationError("Tindakan ini hanya tersedia untuk Admin utama.");
  }

  return user;
}

