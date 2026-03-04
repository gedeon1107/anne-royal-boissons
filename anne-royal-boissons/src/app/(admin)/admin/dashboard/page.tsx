import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Package, ShoppingCart, AlertTriangle, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — Admin Anne Royal Boissons" };

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, pendingOrders, lowStockProducts, revenueToday] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } } }),
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint AS count FROM "Product" p
      WHERE p."isActive" = true
      AND (
        p.stock = 0
        OR EXISTS (
          SELECT 1 FROM "StockAlert" sa
          WHERE sa."productId" = p.id AND p.stock <= sa.threshold
        )
      )
    `.then((r) => Number(r[0]?.count ?? 0)),
    prisma.order.aggregate({
      where: { createdAt: { gte: today }, status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
  ]);

  return { ordersToday, pendingOrders, lowStockProducts, revenueToday: revenueToday._sum.total ?? 0 };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpis = [
    {
      label: "Commandes aujourd'hui",
      value: stats.ordersToday,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "CA du jour",
      value: formatPrice(Number(stats.revenueToday)),
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Commandes en attente",
      value: stats.pendingOrders,
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Alertes stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className={`inline-flex p-2 rounded-lg ${kpi.bg} mb-3`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <RecentOrders />
    </div>
  );
}

async function RecentOrders() {
  const orders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { items: { select: { id: true } } },
  });

  const STATUS_BADGE: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PREPARING: "bg-purple-100 text-purple-800",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const STATUS_FR: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PREPARING: "En préparation",
    OUT_FOR_DELIVERY: "En livraison",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-5 border-b">
        <h2 className="font-semibold">Commandes récentes</h2>
      </div>
      <div className="divide-y">
        {orders.length === 0 && (
          <p className="p-5 text-sm text-muted-foreground">Aucune commande.</p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground">
                {order.guestName ?? "Client"} — {order.items.length} article(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm">{formatPrice(Number(order.total))}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE[order.status]}`}>
                {STATUS_FR[order.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
