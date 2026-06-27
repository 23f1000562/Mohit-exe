import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

if (dbUrl.startsWith("postgres:") || dbUrl.startsWith("postgresql:")) {
  if (process.env.NODE_ENV === "production") {
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    if (!global.prisma) {
      const { Pool } = require("pg");
      const { PrismaPg } = require("@prisma/adapter-pg");
      const pool = new Pool({ connectionString: dbUrl });
      const adapter = new PrismaPg(pool);
      global.prisma = new PrismaClient({ adapter });
    }
    prisma = global.prisma;
  }
} else {
  if (process.env.NODE_ENV === "production") {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    prisma = new PrismaClient({ adapter });
  } else {
    if (!global.prisma) {
      const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
      global.prisma = new PrismaClient({
        adapter: new PrismaBetterSqlite3({ url: dbUrl }),
      });
    }
    prisma = global.prisma;
  }
}

export { prisma };
