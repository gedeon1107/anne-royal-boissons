"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createEmployee } from "@/lib/actions/employee-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe minimum 8 caractères"),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
});

type FormValues = z.infer<typeof schema>;

export function CreateEmployeeForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "EMPLOYEE" },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setError(null);
    const result = await createEmployee(data);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      reset();
      setTimeout(() => router.push("/admin/employes"), 1500);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-green-600 font-medium text-lg">✓ Compte créé avec succès !</p>
        <p className="text-gray-500 text-sm mt-1">Redirection en cours…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="name">Nom complet *</Label>
        <Input id="name" className="mt-1" placeholder="Jean Dupont" {...register("name")} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" className="mt-1" placeholder="employe@example.com" {...register("email")} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Mot de passe temporaire *</Label>
        <Input id="password" type="password" className="mt-1" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        <p className="text-xs text-gray-400 mt-1">L&apos;employé devra changer son mot de passe à la première connexion.</p>
      </div>

      <div>
        <Label htmlFor="role">Rôle *</Label>
        <select
          id="role"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          {...register("role")}
        >
          <option value="EMPLOYEE">Employé</option>
          <option value="ADMIN">Administrateur</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Création…" : "Créer le compte"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
