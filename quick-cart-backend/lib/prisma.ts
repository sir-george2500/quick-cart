import { PrismaClient } from "@prisma/client";

/**
 * Serverless-optimized Prisma client
 * Implements singleton pattern to reuse connections across function invocations
 * This prevents connection exhaustion in Vercel's serverless environment
 */

// Extend global to store Prisma instance
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized settings for serverless
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// In non-production, cache the instance globally to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown helper for cleanup
 * Call this when the serverless function is done
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export default prisma;
