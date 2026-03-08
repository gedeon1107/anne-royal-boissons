import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Truck, Bike } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Livraisons — Admin" };

export default async function AdminLivraisonsPage() {
  const [pendingDeliveries, zones] = await Promise.all([
    prisma.order.findMany({
      where: {
        deliveryMode: "HOME_DELIVERY",
        status: { in: ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"] },
      },
      include: { delivery: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.deliveryZone.findMany({ orderBy: { department: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Livraisons</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders to dispatch */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" /> Commandes à dispatcher ({pendingDeliveries.length})
          </h2>
          <div className="space-y-3">
            {pendingDeliveries.length === 0 && (
              <div className="bg-white rounded-xl border p-8 text-center text-muted-foreground">
                Aucune commande en attente de livraison.
              </div>
            )}
            {pendingDeliveries.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono font-semibold text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm mt-0.5">{order.guestName}</p>
                    <p className="text-xs text-muted-foreground">{order.deliveryAddress}, {order.deliveryCity}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === "OUT_FOR_DELIVERY"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {order.status === "OUT_FOR_DELIVERY" ? "En livraison" : "À dispatcher"}
                    </span>
                    {order.delivery ? (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5" /> {order.delivery.deliveryPersonName}
                      </p>
                    ) : (
                      <Button asChild size="sm">
                        <Link href={`/admin/commandes/${order.id}`}>Assigner</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Zones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Zones de livraison</h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/zones">Gérer</Link>
            </Button>
          </div>
          <div className="bg-white rounded-xl border divide-y">
            {zones.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Aucune zone configurée.</p>
            )}
            {zones.map((zone) => (
              <div key={zone.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{zone.name}</p>
                  <p className="text-xs text-muted-foreground">{zone.department}</p>
                </div>
                <span className="text-sm font-semibold text-amber-600">
                  {Number(zone.price).toLocaleString("fr-BJ")} FCFA
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
