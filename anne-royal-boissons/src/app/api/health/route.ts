import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // 1. Check critical environment variables
  checks.DATABASE_URL = process.env.DATABASE_URL ? "✅ set" : "❌ MISSING";
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
