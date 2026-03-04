import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CreateProductForm } from "@/components/admin/create-product-form";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NouveauProduitPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouveau produit</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <CreateProductForm categories={categories} />
      </div>
    </div>
  );
}
