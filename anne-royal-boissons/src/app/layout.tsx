import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anne Royal Boissons — Vins, Alcools & Spiritueux au Bénin",
  description:
    "Boutique en ligne de boissons premium au Bénin. Vins, whiskies, champagnes, rhums, spiritueux. Livraison à domicile ou retrait en boutique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
