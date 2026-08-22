import { config } from "dotenv";

import { defineConfig } from "prisma/config";

config({ path: [".env.local", ".env"], quiet: true });

const datasourceUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL must be configured.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: { url: datasourceUrl },
});
