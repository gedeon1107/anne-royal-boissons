"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/stores/cart-store";
import { safeImageUrl } from "@/lib/format";
import { MessageCircle, Check, X, ShoppingCart } from "lucide-react";

interface PriceNegotiationProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    displayedPrice: number | null;
    floorPrice?: never; // never expose floor price to client
    stock: number;
    images: string[];
  };
}

const MAX_ATTEMPTS = 3;

export function PriceNegotiation({ product }: PriceNegotiationProps) {
  const [showForm, setShowForm] = useState(false);
  const [offer, setOffer] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<{
    accepted: boolean;
    message: string;
    negotiatedPrice?: number;
  } | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const [addedToCart, setAddedToCart] = useState(false);

  const displayedPrice = product.displayedPrice ?? product.price;

  async function handleSubmitOffer() {
    const offerNum = parseInt(offer, 10);
    if (!offerNum || offerNum <= 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, offer: offerNum }),
      });
      const data = await res.json();
      setResult(data);

      if (!data.accepted) {
        setAttempts((prev) => prev + 1);
      }
    } catch {
      setResult({ accepted: false, message: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  }

  function handleAddNegotiated() {
    if (!result?.negotiatedPrice) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: result.negotiatedPrice,
      image: safeImageUrl(product.images[0] ?? "/placeholder-bottle.jpg"),
      stock: product.stock,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const blocked = attempts >= MAX_ATTEMPTS && !result?.accepted;

  if (!showForm) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
        onClick={() => setShowForm(true)}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Proposer un prix
      </Button>
    );
  }

  return (
    <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50/50 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-amber-600" />
          Négocier le prix
        </h3>
        <button
          onClick={() => { setShowForm(false); setResult(null); }}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Prix affiché : <span className="font-semibold">{formatPrice(displayedPrice)}</span>
        {" · "}
        {MAX_ATTEMPTS - attempts > 0
          ? `${MAX_ATTEMPTS - attempts} tentative${MAX_ATTEMPTS - attempts > 1 ? "s" : ""} restante${MAX_ATTEMPTS - attempts > 1 ? "s" : ""}`
          : "Plus de tentatives"}
      </p>

      {/* Result feedback */}
      {result && (
        <div
          className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
            result.accepted
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {result.accepted ? (
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <X className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}

      {/* Add negotiated price to cart */}
      {result?.accepted && result.negotiatedPrice && (
        <Button
          onClick={handleAddNegotiated}
          disabled={addedToCart}
          className={`w-full transition-colors ${addedToCart ? "bg-green-500 hover:bg-green-500" : ""}`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {addedToCart
            ? "Ajouté !"
            : `Ajouter au panier à ${formatPrice(result.negotiatedPrice)}`}
        </Button>
      )}

      {/* Offer input */}
      {!result?.accepted && !blocked && (
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            max={displayedPrice}
            placeholder="Votre offre en FCFA"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitOffer()}
          />
          <Button
            onClick={handleSubmitOffer}
            disabled={loading || !offer}
            className="shrink-0"
          >
            {loading ? "…" : "Envoyer"}
          </Button>
        </div>
      )}

      {blocked && !result?.accepted && (
        <p className="text-xs text-red-600 font-medium">
          Vous avez atteint le nombre maximum de tentatives pour ce produit.
        </p>
      )}
    </div>
  );
}
