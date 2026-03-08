import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, offer } = body;

  if (!productId || typeof offer !== "number" || offer <= 0) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    select: { id: true, displayedPrice: true, floorPrice: true, name: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const displayedPrice = Number(product.displayedPrice ?? 0);
  const floorPrice = Number(product.floorPrice ?? 0);

  // If negotiation is not configured for this product
  if (!product.displayedPrice || !product.floorPrice) {
    return NextResponse.json({ error: "La négociation n'est pas disponible pour ce produit" }, { status: 400 });
  }

  const roundedOffer = Math.round(offer);

  // Accept if offer >= floor price
  if (roundedOffer >= floorPrice) {
    // Cap at displayed price (don't let them overpay)
    const acceptedPrice = Math.min(roundedOffer, displayedPrice);
    return NextResponse.json({
      accepted: true,
      negotiatedPrice: acceptedPrice,
      message: `Offre acceptée ! Vous payerez ${acceptedPrice.toLocaleString("fr-BJ")} FCFA`,
    });
  }

  // Reject: offer below floor price
  return NextResponse.json({
    accepted: false,
    message: "Votre offre est trop basse. Essayez un montant plus élevé.",
  });
}
