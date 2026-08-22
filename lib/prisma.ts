import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  afanaPrismaV2?: PrismaClient;
};

/** Creates Prisma lazily so static builds do not require live database credentials. */
export function getPrisma() {
  if (globalForPrisma.afanaPrismaV2) return globalForPrisma.afanaPrismaV2;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");

  const client = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  if (process.env.NODE_ENV !== "production") globalForPrisma.afanaPrismaV2 = client;
  return client;
}
