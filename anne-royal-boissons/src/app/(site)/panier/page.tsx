"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "@/components/site/cart-item";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function PanierPage() {
  const { items, getTotal, getItemCount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez notre sélection de boissons premium.
        </p>
        <Button asChild>
          <Link href="/catalogue">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        Mon panier ({getItemCount()} article{getItemCount() > 1 ? "s" : ""})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-gray-50 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Frais de livraison</span>
                <span>Calculés au checkout</span>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-amber-600">{formatPrice(getTotal())}</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Procéder au paiement</Link>
            </Button>
            <Button variant="outline" asChild className="w-full mt-3">
              <Link href="/catalogue">Continuer mes achats</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
