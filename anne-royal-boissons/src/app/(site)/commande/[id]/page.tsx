import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { OrderTimeline } from "@/components/site/order-timeline";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      delivery: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Suivi de commande</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Commande n° {order.id.slice(0, 8).toUpperCase()} — {formatDate(order.createdAt)}
      </p>

      {/* Timeline */}
      <OrderTimeline status={order.status} delivery={order.delivery} />

      {/* Order summary */}
      <div className="mt-8 border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Détails de la commande</h2>
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
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-amber-600">{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      {order.deliveryMode === "HOME_DELIVERY" && order.deliveryAddress && (
        <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm">
          <p className="font-semibold mb-1">Adresse de livraison</p>
          <p className="text-muted-foreground">
            {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryDepartment}
          </p>
        </div>
      )}
    </div>
  );
}
