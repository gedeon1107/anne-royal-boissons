"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { assignDelivery } from "@/lib/actions/delivery-actions";
import { useRouter } from "next/navigation";

interface AssignDeliveryFormProps {
  orderId: string;
}

export function AssignDeliveryForm({ orderId }: AssignDeliveryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setIsLoading(true);
    setError("");

    const result = await assignDelivery(orderId, { name, phone });
    if (result.success) {
      router.refresh();
    } else {
      setError("Erreur lors de l'assignation.");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label htmlFor="name">Nom du livreur</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Koffi Martin"
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+229 97 XX XX XX"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Assignation..." : "Assigner le livreur"}
      </Button>
    </form>
  );
}
