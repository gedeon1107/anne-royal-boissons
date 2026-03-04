"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/actions/order-actions";
import type { OrderStatus } from "@prisma/client";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "PREPARING", label: "En préparation" },
  { value: "OUT_FOR_DELIVERY", label: "En livraison" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(newStatus: OrderStatus) {
    setIsLoading(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setStatus(newStatus);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">Statut actuel :</p>
      <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${STATUS_COLORS[status]}`}>
        {STATUSES.find((s) => s.value === status)?.label}
      </span>
      <p className="text-sm text-muted-foreground mt-4 mb-2">Changer le statut :</p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.filter((s) => s.value !== status).map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => handleUpdate(s.value)}
          >
            → {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
