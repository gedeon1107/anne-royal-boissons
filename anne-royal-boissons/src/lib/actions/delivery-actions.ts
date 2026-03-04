"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendDeliveryAssignmentSMS } from "@/lib/notifications";
import { auth } from "@/auth";

export async function assignDelivery(
  orderId: string,
  data: { name: string; phone: string }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) return { success: false, error: "Non autorisé" };

  try {
    await prisma.$transaction([
      prisma.delivery.create({
        data: {
          orderId,
          deliveryPersonName: data.name,
          deliveryPersonPhone: data.phone,
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "OUT_FOR_DELIVERY" },
      }),
    ]);

    // Send SMS to delivery person
    sendDeliveryAssignmentSMS(orderId, data.name, data.phone).catch(console.error);

    revalidatePath(`/admin/commandes/${orderId}`);
    revalidatePath("/admin/livraisons");
    return { success: true };
  } catch (error) {
    console.error("assignDelivery error:", error);
    return { success: false };
  }
}
