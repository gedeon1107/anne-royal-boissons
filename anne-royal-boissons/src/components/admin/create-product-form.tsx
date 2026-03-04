"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct } from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis").regex(/^[a-z0-9-]+$/, "Slug: lettres minuscules, chiffres et tirets uniquement"),
  description: z.string().optional(),
  price: z.number({ error: "Prix invalide" }).min(1, "Prix invalide"),
  stock: z.number({ error: "Stock invalide" }).min(0, "Stock invalide"),
  categoryId: z.string().min(1, "Catégorie requise"),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  categories: { id: string; name: string }[];
}

export function CreateProductForm({ categories }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { stock: 0 } });

  const nameValue = watch("name");

  function autoSlug() {
    const slug = nameValue
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (slug) setValue("slug", slug);
  }

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setError(null);
    const result = await createProduct({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      images: data.imageUrl ? [data.imageUrl] : [],
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin/produits");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Nom du produit *</Label>
          <Input id="name" className="mt-1" {...register("name")} onBlur={autoSlug} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input id="slug" className="mt-1" placeholder="bordeaux-rouge-classique" {...register("slug")} />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            {...register("description")}
          />
        </div>

        <div>
          <Label htmlFor="price">Prix (FCFA) *</Label>
          <Input id="price" type="number" min={0} className="mt-1" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="stock">Stock initial *</Label>
          <Input id="stock" type="number" min={0} className="mt-1" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>

        <div>
          <Label htmlFor="categoryId">Catégorie *</Label>
          <select
            id="categoryId"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            {...register("categoryId")}
          >
            <option value="">Sélectionner…</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <Label htmlFor="imageUrl">URL de l&apos;image</Label>
          <Input id="imageUrl" type="url" className="mt-1" placeholder="https://…" {...register("imageUrl")} />
          {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Création…" : "Créer le produit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
