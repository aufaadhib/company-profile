import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { admin } from "better-auth/plugins";
import { after } from "next/server";

import { sendPasswordSetupEmail } from "@/lib/auth-email";
import { cmsAccess, cmsRoles } from "@/lib/auth-permissions";
import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

export const auth = betterAuth({
  appName: "Afana CMS",
  baseURL: process.env.BETTER_AUTH_URL ?? (isProductionBuild ? "http://localhost:3000" : undefined),
  secret: process.env.BETTER_AUTH_SECRET ?? (isProductionBuild ? "build-only-placeholder-secret-not-used-at-runtime" : undefined),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  advanced: { database: { joins: true } },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = "role" in user && user.role === "admin" ? "admin" : "editor";
          if (requestedRole === "admin") {
            const ownerEmail = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
            const adminCount = await prisma.user.count({ where: { role: "admin" } });
            if (!ownerEmail || user.email.toLowerCase() !== ownerEmail || adminCount > 0) {
              throw new APIError("FORBIDDEN", { message: "Afana CMS hanya mengizinkan satu Admin utama." });
            }
          }
          return { data: { ...user, role: requestedRole } };
        },
      },
      update: {
        before: async (data) => {
          if ("role" in data) throw new APIError("FORBIDDEN", { message: "Role akun tidak dapat diubah." });
          return { data };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      after(() => sendPasswordSetupEmail(user.email, user.name, url));
    },
    onPasswordReset: async ({ user }) => {
      await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    },
  },
  plugins: [
    admin({
      defaultRole: "editor",
      adminRoles: ["admin"],
      ac: cmsAccess,
      roles: cmsRoles,
      bannedUserMessage: "Akun ini dinonaktifkan. Hubungi Admin Afana CMS.",
    }),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
