"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

async function requireAdminRole() {
  const session = await auth();
  if (!session?.user?.isAdmin || session.user.adminRole !== "ADMIN") {
    throw new Error("Non autorisé : rôle ADMIN requis");
  }
  return session;
}

export async function toggleEmployee(employeeId: string, isActive: boolean) {
  await requireAdminRole();
  await prisma.adminUser.update({
    where: { id: employeeId },
    data: { isActive },
  });
  revalidatePath("/admin/employes");
  return { success: true };
}

export async function createEmployee(data: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE";
}) {
  try {
    await requireAdminRole();
    const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
    if (existing) return { error: "Un compte existe déjà avec cet email." };

    const passwordHash = await bcrypt.hash(data.password, 12);
    await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        isActive: true,
      },
    });
    revalidatePath("/admin/employes");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la création du compte." };
  }
}
