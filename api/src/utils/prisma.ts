/*===============================================
 * Prisma Database Client
 * ==============================================
 * Singleton Prisma Client instance for database operations.
 *
 * Prevents multiple instances in development with hot reload.
 * Configured with appropriate logging levels per environment.
 * ==============================================
 */

import { PrismaClient } from "@prisma/client";

/**
 * Global type extension for Prisma Client singleton
 * Prevents TypeScript errors with global state
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Singleton Prisma Client instance
 *
 * In development: Logs errors and warnings
 * In production: Only logs errors
 * Reuses existing instance in development to prevent connection pool exhaustion
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Store instance globally in development to survive hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
