"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProduct } from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  displayedPrice: z.number({ error: "Prix affiché invalide" }).min(1, "Prix affiché requis"),
  floorPrice: z.number({ error: "Prix plancher invalide" }).min(1, "Prix plancher requis"),
  stock: z.number({ error: "Stock invalide" }).min(0, "Stock invalide"),
  categoryId: z.string().min(1, "Catégorie requise"),
  isActive: z.boolean(),
}).refine((data) => data.floorPrice < data.displayedPrice, {
  message: "Le prix plancher doit être inférieur au prix affiché",
  path: ["floorPrice"],
});

type FormValues = z.infer<typeof schema>;

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayedPrice: number | null;
  floorPrice: number | null;
  stock: number;
  categoryId: string;
  images: string[];
  isActive: boolean;
}

interface Props {
  product: Product;
  categories: { id: string; name: string }[];
}

export function EditProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.images[0] ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      displayedPrice: product.displayedPrice ?? product.price,
      floorPrice: product.floorPrice ?? Math.round(product.price * 0.8),
      stock: product.stock,
      categoryId: product.categoryId,
      isActive: product.isActive,
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setError(null);
    const result = await updateProduct(product.id, {
      name: data.name,
      description: data.description,
      price: data.displayedPrice,
      displayedPrice: data.displayedPrice,
      floorPrice: data.floorPrice,
      stock: data.stock,
      categoryId: data.categoryId,
      images: imageUrl ? [imageUrl] : [],
      isActive: data.isActive,
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
          <Input id="name" className="mt-1" {...register("name")} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
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
          <Label htmlFor="displayedPrice">Prix affiché (FCFA) *</Label>
          <Input id="displayedPrice" type="number" min={0} className="mt-1" {...register("displayedPrice", { valueAsNumber: true })} />
          <p className="text-xs text-muted-foreground mt-1">Prix que le client voit</p>
          {errors.displayedPrice && <p className="text-red-500 text-xs mt-1">{errors.displayedPrice.message}</p>}
        </div>

        <div>
          <Label htmlFor="floorPrice">Prix plancher (FCFA) *</Label>
          <Input id="floorPrice" type="number" min={0} className="mt-1" {...register("floorPrice", { valueAsNumber: true })} />
          <p className="text-xs text-muted-foreground mt-1">Prix minimum acceptable (invisible au client)</p>
          {errors.floorPrice && <p className="text-red-500 text-xs mt-1">{errors.floorPrice.message}</p>}
        </div>

        <div>
          <Label htmlFor="stock">Stock *</Label>
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label>Image du produit</Label>
          <div className="mt-1">
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            {...register("isActive")}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Produit actif (visible sur le site)
          </Label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement…" : "Enregistrer les modifications"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
