import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ToggleEmployeeButton } from "@/components/admin/toggle-employee-button";

export const dynamic = "force-dynamic";

export const metadata = { title: "Employés — Admin" };

export default async function AdminEmployesPage() {
  const session = await auth();

  // Only ADMIN role can access
  if (session?.user?.adminRole !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const employees = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employés</h1>
        <Button asChild>
          <Link href="/admin/employes/nouveau">Ajouter un employé</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Nom</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-center p-4 font-semibold">Rôle</th>
              <th className="text-center p-4 font-semibold">Statut</th>
              <th className="text-left p-4 font-semibold">Créé le</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Aucun compte employé.
                </td>
              </tr>
            )}
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{emp.name}</td>
                <td className="p-4 text-muted-foreground">{emp.email}</td>
                <td className="p-4 text-center">
                  <Badge className={emp.role === "ADMIN" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                    {emp.role === "ADMIN" ? "Admin" : "Employé"}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  <Badge className={emp.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                    {emp.isActive ? "Actif" : "Désactivé"}
                  </Badge>
                </td>
                <td className="p-4 text-xs text-muted-foreground">{formatDate(emp.createdAt)}</td>
                <td className="p-4 text-right">
                  <ToggleEmployeeButton employeeId={emp.id} isActive={emp.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
