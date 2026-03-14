import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function normalizeDatabaseUrl(rawValue: string) {
  const trimmed = rawValue.trim();

  // On some platforms env vars are pasted with surrounding quotes.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function createPrismaClient() {
  const rawConnectionString = process.env.DATABASE_URL;
  if (!rawConnectionString) {
    throw new Error(
      "DATABASE_URL is not set. Please configure it in your environment variables."
    );
  }

  const connectionString = normalizeDatabaseUrl(rawConnectionString);

  try {
    // Validate early so production errors are explicit.
    // eslint-disable-next-line no-new
    new URL(connectionString);
  } catch {
    throw new Error(
      "DATABASE_URL is invalid. Ensure it starts with postgresql:// or postgres:// and has no surrounding quotes."
    );
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
