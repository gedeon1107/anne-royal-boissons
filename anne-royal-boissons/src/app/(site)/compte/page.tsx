import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PREPARING: "default",
  OUT_FOR_DELIVERY: "default",
  DELIVERED: "outline",
  CANCELLED: "destructive",
};

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/compte/connexion");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: { select: { name: true, slug: true } } } } },
      },
      addresses: true,
    },
  });

  if (!user) redirect("/compte/connexion");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon compte</h1>
        <p className="text-gray-500 mt-1">Bienvenue, {user.name}</p>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nom</span>
            <p className="font-medium text-gray-900">{user.name}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <span className="text-gray-500">Téléphone</span>
              <p className="font-medium text-gray-900">{user.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Adresses sauvegardées */}
      {user.addresses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes adresses</h2>
          <div className="space-y-3">
            {user.addresses.map((address) => (
              <div key={address.id} className="border border-gray-100 rounded-lg p-4 text-sm">
                {address.isDefault && (
                  <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full mb-2">
                    Adresse par défaut
                  </span>
                )}
                <p className="font-medium">{address.street}</p>
                <p className="text-gray-500">
                  {address.city}, {address.department}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique commandes */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Mes commandes</h2>
        {user.orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">Vous n&apos;avez pas encore de commande.</p>
            <Link
              href="/catalogue"
              className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Commande #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {Number(order.total).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 space-y-0.5">
                  {order.items.slice(0, 3).map((item) => (
                    <p key={item.id}>
                      {item.quantity}× {item.product.name}
                    </p>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-gray-400">+{order.items.length - 3} autre(s)</p>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/commande/${order.id}`}
                    className="text-sm text-amber-600 hover:underline font-medium"
                  >
                    Suivre la commande →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
