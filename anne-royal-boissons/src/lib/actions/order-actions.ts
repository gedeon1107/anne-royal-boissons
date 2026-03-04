"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { sendStatusUpdateNotification } from "@/lib/notifications";
import { createFedaPayTransaction } from "@/lib/fedapay";
import { auth } from "@/auth";

interface CreateOrderInput {
  fullName: string;
  email: string;
  phone: string;
  deliveryMode: "HOME_DELIVERY" | "STORE_PICKUP";
  address?: string;
  city?: string;
  department?: string;
  deliveryZoneId?: string;
  notes?: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  subtotal: number;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    // ── Link to logged-in user if present ───────────────────────────
    const session = await auth();
    const userId = session?.user?.id && !session.user.isAdmin ? session.user.id : undefined;

    // ── Validate stock availability ─────────────────────────────────
    const productIds = input.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true, isActive: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return { success: false, error: `Produit introuvable.` };
      }
      if (!product.isActive) {
        return { success: false, error: `Le produit "${product.name}" n'est plus disponible.` };
      }
      if (product.stock < item.quantity) {
        return {
          success: false,
          error: `Stock insuffisant pour "${product.name}" (disponible : ${product.stock}, demandé : ${item.quantity}).`,
        };
      }
    }

    // ── Calculate delivery fee ──────────────────────────────────────
    let deliveryFee = 0;
    if (input.deliveryMode === "HOME_DELIVERY" && input.deliveryZoneId) {
      const zone = await prisma.deliveryZone.findUnique({ where: { id: input.deliveryZoneId } });
      deliveryFee = Number(zone?.price ?? 0);
    }

    const total = input.subtotal + deliveryFee;

    // ── Create order in DB ──────────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        userId,
        guestName: input.fullName,
        guestEmail: input.email,
        guestPhone: input.phone,
        deliveryMode: input.deliveryMode,
        deliveryAddress: input.address,
        deliveryCity: input.city,
        deliveryDepartment: input.department,
        deliveryPhone: input.phone,
        deliveryZoneId: input.deliveryZoneId,
        notes: input.notes,
        subtotal: input.subtotal,
        deliveryFee,
        total,
        status: "PENDING",
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });

    // ── Create FedaPay transaction ──────────────────────────────────
    try {
      const orderRef = order.id.slice(0, 8).toUpperCase();
      const { transactionId, paymentUrl } = await createFedaPayTransaction({
        orderId: order.id,
        amount: Math.round(total),
        description: `Commande ${orderRef} — Anne Royal Boissons`,
        customerEmail: input.email,
        customerName: input.fullName,
        customerPhone: input.phone,
      });

      // Store transaction ID on the order
      await prisma.order.update({
        where: { id: order.id },
        data: { fedapayTransactionId: transactionId },
      });

      revalidatePath("/admin/commandes");
      return { success: true, orderId: order.id, paymentUrl };
    } catch (paymentError) {
      console.error("FedaPay transaction error:", paymentError);
      // Order is created but payment failed — admin can still manage it
      revalidatePath("/admin/commandes");
      return { success: true, orderId: order.id, paymentUrl: null };
    }
  } catch (error) {
    console.error("createOrder error:", error);
    return { success: false, error: "Erreur lors de la création de la commande." };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (!session?.user?.isAdmin) return { success: false };

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Send status update notification
    sendStatusUpdateNotification(orderId, status).catch(console.error);

    revalidatePath(`/admin/commandes/${orderId}`);
    revalidatePath("/admin/commandes");
    return { success: true };
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false };
  }
}
