"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateStock } from "@/lib/actions/product-actions";
import { useRouter } from "next/navigation";

interface UpdateStockFormProps {
  productId: string;
  currentStock: number;
}

export function UpdateStockForm({ productId, currentStock }: UpdateStockFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(currentStock.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    setIsLoading(true);
    await updateStock(productId, num);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
    setIsLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-24 h-8 text-sm"
      />
      <Button
        size="sm"
        variant={saved ? "default" : "outline"}
        onClick={handleSave}
        disabled={isLoading || parseInt(value, 10) === currentStock}
        className={saved ? "bg-green-500 hover:bg-green-500" : ""}
      >
        {saved ? "✓" : isLoading ? "..." : "Sauver"}
      </Button>
    </div>
  );
}
