import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmée", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "En préparation", color: "bg-purple-100 text-purple-800" },
  OUT_FOR_DELIVERY: { label: "En livraison", color: "bg-orange-100 text-orange-800" },
  DELIVERED: { label: "Livrée", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const status = STATUS_LABELS[order.status] ?? { label: order.status, color: "" };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Success header */}
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-muted-foreground">
          Merci pour votre commande. Vous recevrez un SMS de confirmation.
        </p>
      </div>

      {/* Order details */}
      <div className="border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">N° de commande</span>
          <span className="font-mono text-sm font-semibold">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Date</span>
          <span className="text-sm">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Statut</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Articles commandés</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Total payé</span>
          <span className="text-amber-600">{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/commande/${order.id}`}>Suivre ma commande</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/catalogue">Continuer mes achats</Link>
        </Button>
      </div>
    </div>
  );
}
