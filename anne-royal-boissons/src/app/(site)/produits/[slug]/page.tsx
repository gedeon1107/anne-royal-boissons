import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/site/product-gallery";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import { PriceNegotiation } from "@/components/site/price-negotiation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} — Anne Royal Boissons`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  // Serialize Decimal/Date for client components
  const displayedPrice = product.displayedPrice ? Number(product.displayedPrice) : Number(product.price);
  const serializedProduct = {
    ...product,
    price: displayedPrice,
    displayedPrice: product.displayedPrice ? Number(product.displayedPrice) : null,
    floorPrice: product.floorPrice ? Number(product.floorPrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
  const hasNegotiation = !!product.displayedPrice && !!product.floorPrice;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category.name}</p>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-amber-600">
              {formatPrice(serializedProduct.price)}
            </span>
            {isOutOfStock && (
              <Badge variant="destructive" className="text-sm">
                Rupture de stock
              </Badge>
            )}
            {!isOutOfStock && product.stock <= 5 && (
              <Badge variant="secondary" className="text-sm">
                Plus que {product.stock} en stock
              </Badge>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <AddToCartButton product={serializedProduct as any} disabled={isOutOfStock} />

          {hasNegotiation && !isOutOfStock && (
            <PriceNegotiation product={serializedProduct as any} />
          )}
        </div>
      </div>
    </div>
  );
}
