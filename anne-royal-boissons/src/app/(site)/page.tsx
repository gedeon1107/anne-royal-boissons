import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/site/hero-banner";
import { CategoryGrid } from "@/components/site/category-grid";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Serialize Decimal fields to plain numbers for client components
  const serializedProducts = featuredProducts.map((p) => ({
    ...p,
    price: p.displayedPrice ? Number(p.displayedPrice) : Number(p.price),
    displayedPrice: p.displayedPrice ? Number(p.displayedPrice) : null,
    floorPrice: p.floorPrice ? Number(p.floorPrice) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div>
      {/* Hero Section */}
      <HeroBanner />

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Nos catégories</h2>
        <CategoryGrid categories={categories} />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Nouveautés</h2>
          <Button variant="outline" asChild>
            <Link href="/catalogue">Voir tout le catalogue</Link>
          </Button>
        </div>
        {serializedProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Le catalogue sera bientôt disponible.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </section>

      {/* Legal banner */}
      <div className="bg-amber-50 border-t border-amber-200 py-3 text-center text-sm text-amber-800">
        L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
        Vente interdite aux mineurs de moins de 18 ans.
      </div>
    </div>
  );
}
