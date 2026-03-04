import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { UpdateStockForm } from "@/components/admin/update-stock-form";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Stock — Admin" };

export default async function AdminStockPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { stockAlert: true },
    orderBy: [{ stock: "asc" }, { name: "asc" }],
  });

  const lowStock = products.filter(
    (p) => p.stock === 0 || (p.stockAlert && p.stock <= p.stockAlert.threshold)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion du stock</h1>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">
              {lowStock.length} produit{lowStock.length > 1 ? "s" : ""} en stock faible ou rupture
            </p>
            <p className="text-sm text-red-600 mt-1">
              {lowStock.map((p) => p.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Produit</th>
              <th className="text-right p-4 font-semibold">Prix</th>
              <th className="text-center p-4 font-semibold">Stock actuel</th>
              <th className="text-center p-4 font-semibold">Seuil alerte</th>
              <th className="p-4 font-semibold">Mise à jour</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => {
              const isLow = product.stock === 0 || (product.stockAlert && product.stock <= product.stockAlert.threshold);
              return (
                <tr key={product.id} className={isLow ? "bg-red-50" : "hover:bg-gray-50"}>
                  <td className="p-4">
                    <p className="font-medium">{product.name}</p>
                  </td>
                  <td className="p-4 text-right text-muted-foreground">{formatPrice(Number(product.price))}</td>
                  <td className="p-4 text-center">
                    <span className={`font-bold text-lg ${product.stock === 0 ? "text-red-600" : isLow ? "text-orange-500" : "text-green-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    {product.stockAlert?.threshold ?? "—"}
                  </td>
                  <td className="p-4">
                    <UpdateStockForm productId={product.id} currentStock={product.stock} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
