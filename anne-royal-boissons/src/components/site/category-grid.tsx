import Link from "next/link";
import type { Category } from "@prisma/client";
import { Wine, GlassWater, Flame, Martini, CupSoda, Beer, Grape, Package, type LucideIcon } from "lucide-react";

type CategoryWithCount = Category & { _count: { products: number } };

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  vins: Wine,
  "eaux-et-softs": GlassWater,
  alcools: Flame,
  spiritueux: Martini,
  rhums: Flame,
  champagnes: GlassWater,
  cannettes: Beer,
  jus: Grape,
  liqueurs: CupSoda,
  "sans-alcool": Grape,
};

export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.slug] ?? Package;
        return (
        <Link
          key={cat.id}
          href={`/catalogue?categorie=${cat.slug}`}
          className="group flex flex-col items-center p-6 bg-white border rounded-xl hover:border-amber-500 hover:shadow-md transition-all"
        >
          <Icon className="w-10 h-10 mb-3 text-amber-600 group-hover:text-amber-500 transition-colors" />
          <h3 className="font-semibold text-center group-hover:text-amber-600 transition-colors">
            {cat.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {cat._count.products} produit{cat._count.products > 1 ? "s" : ""}
          </p>
        </Link>
        );
      })}
    </div>
  );
}
