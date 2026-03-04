import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { AssignDeliveryForm } from "@/components/admin/assign-delivery-form";

export const dynamic = "force-dynamic";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      delivery: true,
      deliveryZone: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">
        Commande {order.id.slice(0, 8).toUpperCase()}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">{formatDate(order.createdAt)}</p>

      <div className="grid gap-6">
        {/* Status updater */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-4">Statut de la commande</h2>
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">Client</h2>
          <div className="grid gap-1 text-sm">
            <p><span className="text-muted-foreground">Nom :</span> {order.guestName ?? "—"}</p>
            <p><span className="text-muted-foreground">Email :</span> {order.guestEmail ?? "—"}</p>
            <p><span className="text-muted-foreground">Téléphone :</span> {order.guestPhone ?? "—"}</p>
            <p><span className="text-muted-foreground">Mode :</span> {order.deliveryMode === "HOME_DELIVERY" ? "Livraison à domicile" : "Retrait en boutique"}</p>
            {order.deliveryAddress && (
              <p><span className="text-muted-foreground">Adresse :</span> {order.deliveryAddress}, {order.deliveryCity} ({order.deliveryDepartment})</p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">Articles ({order.items.length})</h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-semibold">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-amber-600">{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Notes du client</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}

        {/* Delivery assignment */}
        {order.deliveryMode === "HOME_DELIVERY" && (
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-4">Assignation livreur</h2>
            {order.delivery ? (
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Livreur :</span> {order.delivery.deliveryPersonName}</p>
                <p><span className="text-muted-foreground">Téléphone :</span> {order.delivery.deliveryPersonPhone}</p>
                <p><span className="text-muted-foreground">Assigné le :</span> {formatDate(order.delivery.assignedAt)}</p>
              </div>
            ) : (
              <AssignDeliveryForm orderId={order.id} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
