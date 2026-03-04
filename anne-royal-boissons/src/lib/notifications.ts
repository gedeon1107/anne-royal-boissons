import AfricasTalking from "africastalking";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

// ─── Africa's Talking SMS ─────────────────────────────────────────────────────

const AT = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

const sms = AT.SMS;

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    await sms.send({
      to: [to.startsWith("+") ? to : `+${to}`],
      message,
      from: process.env.AFRICASTALKING_SENDER_ID || undefined,
    });
    return true;
  } catch (error) {
    console.error("SMS send error:", error);
    return false;
  }
}

// ─── Resend Email ─────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

// ─── Notification helpers ─────────────────────────────────────────────────────

const STATUS_SMS: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "✅ Votre commande Anne Royal Boissons a été confirmée. Nous préparons votre commande.",
  PREPARING: "📦 Votre commande Anne Royal Boissons est en cours de préparation.",
  OUT_FOR_DELIVERY: "🚴 Votre commande Anne Royal Boissons est en route ! Un livreur est en chemin.",
  DELIVERED: "✅ Votre commande Anne Royal Boissons a été livrée. Merci pour votre confiance !",
  CANCELLED: "❌ Votre commande Anne Royal Boissons a été annulée. Contactez-nous pour plus d'info.",
};

export async function sendOrderConfirmationNotification(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) return;

  const orderRef = order.id.slice(0, 8).toUpperCase();

  // SMS
  if (order.guestPhone) {
    const smsText = `🍷 Anne Royal Boissons - Commande reçue !\nRéf: ${orderRef}\nTotal: ${Number(order.total).toLocaleString("fr-BJ")} FCFA\nVous recevrez un SMS de confirmation.`;
    await sendSMS(order.guestPhone, smsText);
  }

  // Email
  if (order.guestEmail) {
    const itemsHtml = order.items
      .map((item) => `<tr><td>${item.product.name}</td><td>${item.quantity}</td><td>${Number(item.unitPrice) * item.quantity} FCFA</td></tr>`)
      .join("");

    await sendEmail({
      to: order.guestEmail,
      subject: `✅ Commande ${orderRef} reçue — Anne Royal Boissons`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #f59e0b; margin: 0;">Anne Royal Boissons</h1>
          </div>
          <div style="padding: 30px;">
            <h2>Votre commande a été reçue ! 🎉</h2>
            <p>Bonjour ${order.guestName},</p>
            <p>Votre commande <strong>${orderRef}</strong> a bien été reçue. Nous vous confirmons les détails ci-dessous.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left;">Produit</th>
                  <th style="padding: 10px; text-align: center;">Qté</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td colspan="2" style="padding: 10px; font-weight: bold;">TOTAL</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #f59e0b;">${Number(order.total).toLocaleString("fr-BJ")} FCFA</td>
                </tr>
              </tfoot>
            </table>
            <p>Suivez votre commande : <a href="${process.env.NEXT_PUBLIC_APP_URL}/commande/${order.id}">Cliquez ici</a></p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</p>
          </div>
        </div>
      `,
    });
  }
}

export async function sendStatusUpdateNotification(orderId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const smsText = STATUS_SMS[status];
  if (smsText && order.guestPhone) {
    await sendSMS(order.guestPhone, smsText);
  }
}

export async function sendDeliveryAssignmentSMS(
  orderId: string,
  deliveryPersonName: string,
  deliveryPersonPhone: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) return;

  const orderRef = order.id.slice(0, 8).toUpperCase();
  const smsText = `🍷 Anne Royal Boissons\nBonjour ${deliveryPersonName} !\nVous avez une livraison à effectuer.\nCommande: ${orderRef}\nClient: ${order.guestName}\nTél: ${order.guestPhone}\nAdresse: ${order.deliveryAddress}, ${order.deliveryCity}`;

  await sendSMS(deliveryPersonPhone, smsText);
}
