import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";
import { safeImageUrl } from "@/lib/format";
import type { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const image = safeImageUrl(product.images[0] ?? "/placeholder-bottle.jpg");
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      {/* Image */}
      <Link href={`/produits/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
        <Link href={`/produits/${product.slug}`} className="block">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-bold text-amber-600 mt-2 text-sm">{formatPrice(Number(product.price))}</p>
        <div className="mt-3">
          <AddToCartButton product={product} disabled={isOutOfStock} size="sm" />
        </div>
      </div>
    </div>
  );
}
