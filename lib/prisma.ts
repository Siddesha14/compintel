const { PrismaClient } = require("@prisma/client");
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: any };

function createPrismaClient() {
  const neonClient = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeon(neonClient);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
