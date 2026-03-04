import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const zones = await prisma.deliveryZone.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, department: true, price: true },
  });
  return NextResponse.json(zones);
}
