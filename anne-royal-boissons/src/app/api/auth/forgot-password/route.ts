import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/notifications";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email requis." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid email enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Delete existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  // Generate token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/compte/reinitialiser-mot-de-passe?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Réinitialisation de votre mot de passe — Anne Royal Boissons",
    html: `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Bonjour ${user.name || ""},</p>
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous (valable 1 heure) :</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#f59e0b;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
