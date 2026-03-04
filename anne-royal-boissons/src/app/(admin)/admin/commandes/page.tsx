import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = { title: "Commandes — Admin" };

const STATUS_FILTER = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
const STATUS_FR: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", PREPARING: "En préparation",
  OUT_FOR_DELIVERY: "En livraison", DELIVERED: "Livrée", CANCELLED: "Annulée",
};
const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800", CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800", OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
};

const PAGE_SIZE = 20;

interface AdminCommandesPageProps {
  searchParams: Promise<{ statut?: string; q?: string; page?: string }>;
}

export default async function AdminCommandesPage({ searchParams }: AdminCommandesPageProps) {
  const params = await searchParams;
  const { statut, q } = params;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where = {
    ...(statut && STATUS_FILTER.includes(statut) ? { status: statut as never } : {}),
    ...(q ? { OR: [
      { id: { contains: q, mode: "insensitive" as const } },
      { guestName: { contains: q, mode: "insensitive" as const } },
      { guestPhone: { contains: q } },
    ]} : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { select: { id: true } }, delivery: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/admin/commandes"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!statut ? "bg-gray-900 text-white" : "bg-white border hover:bg-gray-50"}`}
        >
          Toutes
        </Link>
        {STATUS_FILTER.map((s) => (
          <Link
            key={s}
            href={`/admin/commandes?statut=${s}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statut === s ? "bg-gray-900 text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            {STATUS_FR[s]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">N°</th>
              <th className="text-left p-4 font-semibold">Client</th>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-right p-4 font-semibold">Total</th>
              <th className="text-center p-4 font-semibold">Statut</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucune commande.</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono font-semibold">{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-4">
                  <p>{order.guestName ?? "Client"}</p>
                  <p className="text-xs text-muted-foreground">{order.guestPhone}</p>
                </td>
                <td className="p-4 text-muted-foreground text-xs">{formatDate(order.createdAt)}</td>
                <td className="p-4 text-right font-semibold">{formatPrice(Number(order.total))}</td>
                <td className="p-4 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE[order.status]}`}>
                    {STATUS_FR[order.status]}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/commandes/${order.id}`}>Voir</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/commandes?${new URLSearchParams({ ...(statut ? { statut } : {}), ...(q ? { q } : {}), page: String(page - 1) }).toString()}`}>
                ← Précédent
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
          {page < totalPages && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/commandes?${new URLSearchParams({ ...(statut ? { statut } : {}), ...(q ? { q } : {}), page: String(page + 1) }).toString()}`}>
                Suivant →
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
