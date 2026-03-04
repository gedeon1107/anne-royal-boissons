import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export const metadata = { title: "Produits — Admin" };

const PAGE_SIZE = 20;

interface AdminProduitsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminProduitsPage({ searchParams }: AdminProduitsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Button asChild>
          <Link href="/admin/produits/nouveau">
            <Plus className="w-4 h-4 mr-2" /> Ajouter un produit
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Produit</th>
              <th className="text-left p-4 font-semibold">Catégorie</th>
              <th className="text-right p-4 font-semibold">Prix</th>
              <th className="text-right p-4 font-semibold">Stock</th>
              <th className="text-center p-4 font-semibold">Statut</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Aucun produit. Commencez par en ajouter un.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="p-4 text-muted-foreground">{product.category.name}</td>
                <td className="p-4 text-right">{formatPrice(Number(product.price))}</td>
                <td className="p-4 text-right">
                  <span
                    className={`font-semibold ${product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-orange-500" : "text-green-600"}`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {product.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Inactif</Badge>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/produits/${product.id}/modifier`}>Modifier</Link>
                    </Button>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/produits?page=${page - 1}`}>← Précédent</Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
          {page < totalPages && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/produits?page=${page + 1}`}>Suivant →</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
