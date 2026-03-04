import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

async function upsertAlert(formData: FormData) {
  "use server";
  const productId = formData.get("productId") as string;
  const threshold = parseInt(formData.get("threshold") as string, 10);
  if (!productId || isNaN(threshold) || threshold < 0) return;

  const existing = await prisma.stockAlert.findUnique({ where: { productId } });
  if (existing) {
    await prisma.stockAlert.update({ where: { productId }, data: { threshold } });
  } else {
    await prisma.stockAlert.create({ data: { productId, threshold } });
  }
  revalidatePath("/admin/stock/alertes");
}

async function deleteAlert(formData: FormData) {
  "use server";
  const productId = formData.get("productId") as string;
  await prisma.stockAlert.deleteMany({ where: { productId } });
  revalidatePath("/admin/stock/alertes");
}

export default async function StockAlertesPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      stockAlert: true,
      category: { select: { name: true } },
    },
  });

  const alertsSet = products.filter((p) => p.stockAlert !== null);
  const noAlerts = products.filter((p) => p.stockAlert === null);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Bell size={22} className="text-amber-600" />
        <h1 className="text-2xl font-bold text-gray-900">Seuils d&apos;alerte stock</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        Configurez les seuils à partir desquels un produit apparaît en &ldquo;stock faible&rdquo; (badge rouge).
      </p>

      {/* Products with alerts */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Alertes configurées ({alertsSet.length})
          </h2>
        </div>

        {alertsSet.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            Aucune alerte configurée. Utilisez le tableau ci-dessous pour en ajouter.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alertsSet.map((product) => (
              <div key={product.id} className="grid grid-cols-4 items-center gap-4 px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category?.name}</p>
                </div>
                <div className="text-center">
                  <span
                    className={`text-sm font-semibold ${product.stock <= (product.stockAlert?.threshold ?? 5) ? "text-red-600" : "text-green-600"}`}
                  >
                    {product.stock} en stock
                  </span>
                  {product.stock <= (product.stockAlert?.threshold ?? 5) && (
                    <div className="flex items-center gap-1 justify-center mt-0.5">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-xs text-red-500">Stock faible</span>
                    </div>
                  )}
                </div>
                <form action={upsertAlert} className="flex items-center gap-2">
                  <input type="hidden" name="productId" value={product.id} />
                  <label className="text-xs text-gray-500">Seuil :</label>
                  <input
                    name="threshold"
                    type="number"
                    min={0}
                    defaultValue={product.stockAlert?.threshold ?? 5}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button type="submit" className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                    Sauver
                  </button>
                </form>
                <div className="flex justify-end">
                  <form action={deleteAlert}>
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit" className="text-xs text-red-400 hover:text-red-600">
                      Supprimer l&apos;alerte
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products without alerts */}
      {noAlerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Produits sans alerte ({noAlerts.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {noAlerts.map((product) => (
              <div key={product.id} className="grid grid-cols-3 items-center gap-4 px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category?.name}</p>
                </div>
                <div className="text-sm text-gray-500">{product.stock} en stock</div>
                <form action={upsertAlert} className="flex items-center gap-2 justify-end">
                  <input type="hidden" name="productId" value={product.id} />
                  <label className="text-xs text-gray-500">Seuil :</label>
                  <input
                    name="threshold"
                    type="number"
                    min={0}
                    defaultValue={5}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button type="submit" className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                    Configurer
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
