import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeDatabaseUrl(rawValue: string) {
  const trimmed = rawValue.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export async function GET() {
  const checks: Record<string, string> = {};
  const rawDatabaseUrl = process.env.DATABASE_URL;

  // 1. Check critical environment variables
  if (!rawDatabaseUrl) {
    checks.DATABASE_URL = "❌ MISSING";
    checks.databaseUrlFormat = "❌ not available";
  } else {
    const normalizedDatabaseUrl = normalizeDatabaseUrl(rawDatabaseUrl);

    checks.DATABASE_URL =
      normalizedDatabaseUrl === rawDatabaseUrl ? "✅ set" : "⚠️ set (quoted/trimmed)";

    try {
      const parsed = new URL(normalizedDatabaseUrl);
      checks.databaseUrlFormat = `✅ valid (${parsed.protocol}//${parsed.hostname})`;
    } catch {
      checks.databaseUrlFormat = "❌ invalid URL format";
    }
  }

  checks.AUTH_SECRET = process.env.AUTH_SECRET ? "✅ set" : "❌ MISSING";

  // 2. Test database connection
  try {
    const { prisma } = await import("@/lib/prisma");
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
    checks.database = `✅ connected (${result[0].now})`;
  } catch (error) {
    checks.database = `❌ ${error instanceof Error ? error.message : "unknown error"}`;
  }

  const allOk = Object.values(checks).every((v) => v.startsWith("✅"));

  return NextResponse.json(
    { status: allOk ? "healthy" : "unhealthy", checks },
    { status: allOk ? 200 : 500 },
  );
}
