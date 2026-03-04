"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { createOrder } from "@/lib/actions/order-actions";

interface DeliveryZone {
  id: string;
  name: string;
  department: string;
  price: string | number;
}

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone requis"),
  deliveryMode: z.enum(["HOME_DELIVERY", "STORE_PICKUP"]),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  deliveryZoneId: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const STEPS = ["Informations", "Livraison", "Récapitulatif"];

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zones, setZones] = useState<DeliveryZone[]>([]);

  useEffect(() => {
    fetch("/api/delivery-zones")
      .then((r) => r.json())
      .then((data) => setZones(data))
      .catch(() => {});
  }, []);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryMode: "HOME_DELIVERY" },
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Votre panier est vide.</p>
        <Button asChild>
          <Link href="/catalogue">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  const [orderError, setOrderError] = useState<string | null>(null);

  async function handleSubmit(data: CheckoutFormData) {
    setIsSubmitting(true);
    setOrderError(null);
    try {
      const result = await createOrder({
        ...data,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        subtotal: getTotal(),
      });

      if (!result.success) {
        setOrderError(result.error ?? "Erreur lors de la commande.");
        setIsSubmitting(false);
        return;
      }

      clearCart();

      // Redirect to FedaPay payment page if available, otherwise to confirmation
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        router.push(`/commande/${result.orderId}/confirmation`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setOrderError("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Finaliser ma commande</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${i <= step ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 text-sm ${i === step ? "font-semibold" : "text-muted-foreground"} hidden sm:inline`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${i < step ? "bg-amber-500" : "bg-gray-200"} w-8`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Order error (stock, payment, etc.) */}
        {orderError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-semibold mb-1">Erreur</p>
            <p>{orderError}</p>
          </div>
        )}

        {/* Step 0: Informations */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Vos informations</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input {...form.register("fullName")} id="fullName" placeholder="Jean Dupont" />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input {...form.register("email")} id="email" type="email" placeholder="jean@exemple.bj" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Téléphone (Mobile Money) *</Label>
                <Input {...form.register("phone")} id="phone" placeholder="+229 97 XX XX XX" />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="button" onClick={() => setStep(1)} className="w-full">
              Continuer
            </Button>
          </div>
        )}

        {/* Step 1: Delivery */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Mode de livraison</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => form.setValue("deliveryMode", "HOME_DELIVERY")}
                className={`p-4 border-2 rounded-xl text-left transition-colors
                  ${form.watch("deliveryMode") === "HOME_DELIVERY" ? "border-amber-500 bg-amber-50" : "border-gray-200"}`}
              >
                <p className="font-semibold">🏠 Livraison à domicile</p>
                <p className="text-sm text-muted-foreground mt-1">Cotonou et environs</p>
              </button>
              <button
                type="button"
                onClick={() => form.setValue("deliveryMode", "STORE_PICKUP")}
                className={`p-4 border-2 rounded-xl text-left transition-colors
                  ${form.watch("deliveryMode") === "STORE_PICKUP" ? "border-amber-500 bg-amber-50" : "border-gray-200"}`}
              >
                <p className="font-semibold">🏪 Retrait en boutique</p>
                <p className="text-sm text-muted-foreground mt-1">Gratuit</p>
              </button>
            </div>

            {form.watch("deliveryMode") === "HOME_DELIVERY" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="deliveryZoneId">Zone de livraison *</Label>
                  <select
                    {...form.register("deliveryZoneId")}
                    id="deliveryZoneId"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">— Choisir une zone —</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.department}) — {formatPrice(Number(z.price))}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input {...form.register("address")} id="address" placeholder="Quartier, rue..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input {...form.register("city")} id="city" placeholder="Cotonou" />
                  </div>
                  <div>
                    <Label htmlFor="department">Département *</Label>
                    <Input {...form.register("department")} id="department" placeholder="Littoral" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Instructions spéciales (optionnel)</Label>
              <Input {...form.register("notes")} id="notes" placeholder="Précisions, point de repère..." />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="w-full">
                Retour
              </Button>
              <Button type="button" onClick={() => setStep(2)} className="w-full">
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Summary + Payment */}
        {step === 2 && (() => {
          const selectedZone = zones.find((z) => z.id === form.watch("deliveryZoneId"));
          const deliveryFee = form.watch("deliveryMode") === "HOME_DELIVERY" && selectedZone ? Number(selectedZone.price) : 0;
          const grandTotal = getTotal() + deliveryFee;
          return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Récapitulatif de la commande</h2>
            <div className="border rounded-xl divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between p-4 text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between p-4 text-sm">
                <span>Sous-total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between p-4 text-sm">
                  <span>Livraison ({selectedZone?.name})</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between p-4 font-bold">
                <span>Total</span>
                <span className="text-amber-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-amber-800 mb-1">💳 Paiement Mobile Money</p>
              <p className="text-amber-700">MTN Mobile Money, Moov Money, Celtis Cash via FedaPay</p>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                Retour
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-400">
                {isSubmitting ? "Traitement..." : `Payer ${formatPrice(grandTotal)}`}
              </Button>
            </div>
          </div>
          );
        })()}
      </form>
    </div>
  );
}
