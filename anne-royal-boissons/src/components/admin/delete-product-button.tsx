"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/product-actions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    await deleteProduct(productId);
    setShowConfirm(false);
    router.refresh();
    setIsLoading(false);
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confirmer ?</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Oui"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
        >
          Non
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-destructive hover:text-destructive hover:bg-red-50"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
