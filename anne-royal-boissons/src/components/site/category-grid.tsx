import Link from "next/link";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & { _count: { products: number } };

export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  const CATEGORY_ICONS: Record<string, string> = {
    vins: "🍷",
    "eaux-et-softs": "💧",
    alcools: "🥃",
    spiritueux: "🥃",
    rhums: "🍹",
    champagnes: "🍾",
    cannettes: "🥤",
    jus: "🥂",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/catalogue?categorie=${cat.slug}`}
          className="group flex flex-col items-center p-6 bg-white border rounded-xl hover:border-amber-500 hover:shadow-md transition-all"
        >
          <span className="text-4xl mb-3">{CATEGORY_ICONS[cat.slug] ?? "🍶"}</span>
          <h3 className="font-semibold text-center group-hover:text-amber-600 transition-colors">
            {cat.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {cat._count.products} produit{cat._count.products > 1 ? "s" : ""}
          </p>
        </Link>
      ))}
    </div>
  );
}
