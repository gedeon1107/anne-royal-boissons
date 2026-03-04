import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationNotification } from "@/lib/notifications";

function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.FEDAPAY_SECRET_KEY;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature
    const signature = request.headers.get("x-fedapay-signature");
    if (process.env.FEDAPAY_SECRET_KEY && !verifyWebhookSignature(rawBody, signature)) {
      console.warn("FedaPay webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(rawBody);
    const { event, data } = body;

    if (event === "transaction.approved" || event === "transaction.completed") {
      const transactionId = data?.id?.toString();
      if (!transactionId) {
        return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
      }

      // Find order by transaction ID
      const order = await prisma.order.findFirst({
        where: { fedapayTransactionId: transactionId },
        include: { items: true },
      });

      if (!order) {
        console.warn("FedaPay webhook: order not found for transaction", transactionId);
        return NextResponse.json({ received: true });
      }

      // Update order status and decrement stock atomically
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CONFIRMED", fedapayStatus: event },
        });

        // Decrement stock for each item
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      });

      // Send confirmation notifications
      await sendOrderConfirmationNotification(order.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("FedaPay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
