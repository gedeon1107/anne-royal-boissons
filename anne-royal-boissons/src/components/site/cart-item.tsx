"use client";

import { useCartStore, type CartItem as CartItemType } from "@/lib/stores/cart-store";
import { formatPrice, safeImageUrl } from "@/lib/format";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 bg-white border rounded-xl p-4">
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
        <Image src={safeImageUrl(item.image)} alt={item.name} fill className="object-cover" sizes="80px" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
        <p className="text-amber-600 font-bold mt-1">{formatPrice(item.price)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Total : {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
