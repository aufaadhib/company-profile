import { PrismaNeon } from "@prisma/adapter-neon";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { admin } from "better-auth/plugins";
import { config } from "dotenv";

import { PrismaClient } from "./generated/prisma/client";
import { cmsAccess, cmsRoles } from "./lib/auth-permissions";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured.");

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

export const auth = betterAuth({
  appName: "Afana CMS",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ownerEmail = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
          const adminCount = await prisma.user.count({ where: { role: "admin" } });
          if (!ownerEmail || user.email.toLowerCase() !== ownerEmail || adminCount > 0) {
            throw new APIError("FORBIDDEN", { message: "Afana CMS hanya mengizinkan satu Admin utama." });
          }
          return { data: { ...user, role: "admin" } };
        },
      },
    },
  },
  emailAndPassword: { enabled: true, disableSignUp: true },
  plugins: [
    admin({
      defaultRole: "editor",
      adminRoles: ["admin"],
      ac: cmsAccess,
      roles: cmsRoles,
    }),
  ],
});
