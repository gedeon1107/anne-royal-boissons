import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function createZone(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.isAdmin) return;
  const name = formData.get("name") as string;
  const department = formData.get("department") as string;
  const price = parseInt(formData.get("price") as string, 10);
  if (!name || !department || isNaN(price)) return;
  const id = `zone-${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-")}`;
  await prisma.deliveryZone.upsert({
    where: { id },
    update: { name, department, price },
    create: { id, name, department, price },
  });
  revalidatePath("/admin/zones");
}

async function deleteZone(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.isAdmin) return;
  const id = formData.get("id") as string;
  await prisma.deliveryZone.delete({ where: { id } });
  revalidatePath("/admin/zones");
}

async function updateZonePrice(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.isAdmin) return;
  const id = formData.get("id") as string;
  const price = parseInt(formData.get("price") as string, 10);
  if (!id || isNaN(price)) return;
  await prisma.deliveryZone.update({ where: { id }, data: { price } });
  revalidatePath("/admin/zones");
}

export default async function ZonesPage() {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { department: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Zones de livraison</h1>
      <p className="text-gray-500 text-sm mb-8">Gérez les zones et les frais de livraison.</p>

      {/* Create zone form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          <Plus size={16} className="inline mr-1" />
          Ajouter une zone
        </h2>
        <form action={createZone} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nom de la zone *</label>
            <input
              name="name"
              required
              placeholder="Cotonou Centre"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-48"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Département *</label>
            <input
              name="department"
              required
              placeholder="Littoral"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-36"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Frais (FCFA) *</label>
            <input
              name="price"
              type="number"
              min={0}
              required
              placeholder="1000"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-28"
            />
          </div>
          <Button type="submit" size="sm">
            Ajouter
          </Button>
        </form>
      </div>

      {/* Zones table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div>Zone</div>
          <div>Département</div>
          <div>Frais (FCFA)</div>
          <div className="text-right">Actions</div>
        </div>

        {zones.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">Aucune zone configurée.</div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className="grid grid-cols-4 items-center px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <div className="font-medium text-gray-900 text-sm">{zone.name}</div>
              <div className="text-gray-500 text-sm">{zone.department}</div>
              <div>
                <form action={updateZonePrice} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={zone.id} />
                  <input
                    name="price"
                    type="number"
                    min={0}
                    defaultValue={Number(zone.price)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                  >
                    <Pencil size={14} />
                  </button>
                </form>
              </div>
              <div className="flex justify-end">
                <form action={deleteZone}>
                  <input type="hidden" name="id" value={zone.id} />
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        * Les modifications de frais sont appliquées immédiatement lors du prochain checkout.
      </p>
    </div>
  );
}
