"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { safeImageUrl } from "@/lib/format";
import type { Product } from "@prisma/client";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
}

export function AddToCartButton({ product, disabled, size = "default" }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: safeImageUrl(product.images[0] ?? "/placeholder-bottle.jpg"),
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || added}
      size={size}
      className={`w-full transition-colors ${added ? "bg-green-500 hover:bg-green-500" : ""}`}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {added ? "Ajouté !" : "Ajouter au panier"}
    </Button>
  );
}
