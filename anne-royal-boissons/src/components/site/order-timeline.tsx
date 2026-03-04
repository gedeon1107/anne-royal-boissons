import type { OrderStatus, Delivery } from "@prisma/client";
import { Check, Clock, Package, Truck, CheckCircle } from "lucide-react";

const STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "PENDING", label: "Commande reçue", icon: Clock },
  { status: "CONFIRMED", label: "Confirmée", icon: Check },
  { status: "PREPARING", label: "En préparation", icon: Package },
  { status: "OUT_FOR_DELIVERY", label: "En livraison", icon: Truck },
  { status: "DELIVERED", label: "Livrée", icon: CheckCircle },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0, CONFIRMED: 1, PREPARING: 2, OUT_FOR_DELIVERY: 3, DELIVERED: 4, CANCELLED: -1,
};

interface OrderTimelineProps {
  status: OrderStatus;
  delivery: Delivery | null;
}

export function OrderTimeline({ status, delivery }: OrderTimelineProps) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="font-semibold text-red-800 text-lg">Commande annulée</p>
        <p className="text-sm text-red-600 mt-1">Cette commande a été annulée.</p>
      </div>
    );
  }

  const currentStep = STATUS_ORDER[status];

  return (
    <div className="space-y-4">
      {STEPS.map((step, i) => {
        const isDone = i < currentStep;
        const isCurrent = i === currentStep;
        const isPending = i > currentStep;

        return (
          <div key={step.status} className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                ${isDone ? "bg-green-500 text-white" : isCurrent ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-400"}`}
            >
              <step.icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <div className="flex-1">
              <p className={`font-medium ${isPending ? "text-muted-foreground" : ""}`}>{step.label}</p>
              {isCurrent && step.status === "OUT_FOR_DELIVERY" && delivery && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Livreur : {delivery.deliveryPersonName} — {delivery.deliveryPersonPhone}
                </p>
              )}
            </div>

            {/* Status dot */}
            <div>
              {isDone && <span className="text-xs text-green-600 font-medium">✓ Fait</span>}
              {isCurrent && <span className="text-xs text-amber-600 font-medium animate-pulse">En cours</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
