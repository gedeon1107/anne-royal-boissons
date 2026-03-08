"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Non autorisé");
  return session;
}

export async function updateStock(productId: string, newStock: number) {
  await requireAdmin();
  await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });
  revalidatePath("/admin/stock");
  revalidatePath("/admin/produits");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });
  revalidatePath("/admin/produits");
}

interface CreateProductInput {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  displayedPrice?: number;
  floorPrice?: number;
  stock: number;
  categoryId: string;
  images?: string[];
  isActive?: boolean;
}

export async function createProduct(input: CreateProductInput) {
  try {
    await requireAdmin();

    if (input.displayedPrice && input.floorPrice && input.floorPrice >= input.displayedPrice) {
      return { error: "Le prix plancher doit être inférieur au prix affiché." };
    }

    const slug = input.slug || (slugify(input.name) + "-" + Date.now().toString(36));
    await prisma.product.create({
      data: {
        slug,
        name: input.name,
        description: input.description,
        price: input.displayedPrice ?? input.price,
        displayedPrice: input.displayedPrice ?? input.price,
        floorPrice: input.floorPrice,
        stock: input.stock,
        categoryId: input.categoryId,
        images: input.images ?? [],
        isActive: input.isActive ?? true,
      },
    });
    revalidatePath("/admin/produits");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la création du produit." };
  }
}

export async function updateProduct(
  productId: string,
  input: Partial<CreateProductInput>
) {
  try {
    await requireAdmin();

    if (input.displayedPrice && input.floorPrice && input.floorPrice >= input.displayedPrice) {
      return { error: "Le prix plancher doit être inférieur au prix affiché." };
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.displayedPrice !== undefined && { displayedPrice: input.displayedPrice }),
        ...(input.floorPrice !== undefined && { floorPrice: input.floorPrice }),
        ...(input.stock !== undefined && { stock: input.stock }),
        ...(input.categoryId && { categoryId: input.categoryId }),
        ...(input.images && { images: input.images }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    revalidatePath("/admin/produits");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour du produit." };
  }
}
