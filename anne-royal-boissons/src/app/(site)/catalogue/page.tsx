import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { ProductCard } from "@/components/site/product-card";
import { CategoryFilter } from "@/components/site/category-filter";
import { SearchBar } from "@/components/site/search-bar";

export const dynamic = "force-dynamic";

interface CataloguePageProps {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}

export const metadata = {
  title: "Catalogue — Anne Royal Boissons",
  description: "Parcourez notre sélection de vins, champagnes, spiritueux et boissons.",
};

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const params = await searchParams;
  const { categorie, q } = params;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorie && {
          category: { slug: categorie },
        }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Notre catalogue</h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Suspense fallback={<div className="h-10 w-full bg-gray-100 rounded-md animate-pulse" />}>
          <SearchBar defaultValue={q} />
        </Suspense>
        <CategoryFilter categories={categories} selectedCategory={categorie} />
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        {products.length} produit{products.length > 1 ? "s" : ""} trouvé
        {products.length > 1 ? "s" : ""}
        {categorie && ` dans ${categories.find((c) => c.slug === categorie)?.name}`}
        {q && ` pour "${q}"`}
      </p>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Aucun produit trouvé.</p>
          <p className="text-sm mt-2">Essayez une autre recherche ou catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={{
              ...product,
              price: product.displayedPrice ? Number(product.displayedPrice) : Number(product.price),
              displayedPrice: product.displayedPrice ? Number(product.displayedPrice) : null,
              floorPrice: product.floorPrice ? Number(product.floorPrice) : null,
              createdAt: product.createdAt.toISOString(),
              updatedAt: product.updatedAt.toISOString(),
            } as any} />
          ))}
        </div>
      )}
    </div>
  );
}
