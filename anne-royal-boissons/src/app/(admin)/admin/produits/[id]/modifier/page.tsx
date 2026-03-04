import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditProductForm } from "@/components/admin/edit-product-form";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModifierProduitPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, description: true, price: true, stock: true, categoryId: true, images: true, isActive: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  // Serialize Decimal price to a plain number for the Client Component
  const serializedProduct = { ...product, price: Number(product.price) };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/produits"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Retour aux produits
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Modifier le produit</h1>
      <p className="text-gray-500 text-sm mb-6">{product.name}</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <EditProductForm product={serializedProduct} categories={categories} />
      </div>
    </div>
  );
}
