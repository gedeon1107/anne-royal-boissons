import Link from "next/link";
import type { Category } from "@prisma/client";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Link
        href="/catalogue"
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
          ${!selectedCategory ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50"}`}
      >
        Tous
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/catalogue?categorie=${cat.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
            ${selectedCategory === cat.slug ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50"}`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
