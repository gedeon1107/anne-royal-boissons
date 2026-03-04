import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
import { CreateEmployeeForm } from "@/components/admin/create-employee-form";

export default async function NouvelEmployePage() {
  const session = await auth();
  if (!session?.user?.isAdmin || session.user.adminRole !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/employes"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Retour aux employés
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un compte employé</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
        <CreateEmployeeForm />
      </div>
    </div>
  );
}
