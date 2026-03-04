"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";

function AgeVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [declined, setDeclined] = useState(false);

  function handleConfirm() {
    // Set cookie via server action
    document.cookie = "age_verified=true; path=/; max-age=31536000; SameSite=Strict";
    router.push(redirect);
    router.refresh();
  }

  function handleDecline() {
    setDeclined(true);
  }

  if (declined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <Wine className="w-16 h-16 mx-auto mb-6 text-amber-400" />
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-gray-300 mb-6">
            Vous devez avoir 18 ans ou plus pour accéder à ce site. La vente
            d&apos;alcool est interdite aux mineurs.
          </p>
          <p className="text-sm text-gray-500">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center text-white max-w-lg">
        {/* Logo / branding */}
        <div className="mb-8">
          <Wine className="w-20 h-20 mx-auto mb-4 text-amber-400" />
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Anne Royal Boissons
          </h1>
          <p className="text-gray-400 text-lg">
            La sélection premium de boissons au Bénin
          </p>
        </div>

        {/* Age verification */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-2">Vérification d&apos;âge</h2>
          <p className="text-gray-300 mb-2 text-lg">Avez-vous 18 ans ou plus ?</p>
          <p className="text-gray-500 text-sm mb-8">
            Ce site vend des boissons alcoolisées. L&apos;accès est réservé aux
            personnes majeures conformément à la législation béninoise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleConfirm}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-10"
            >
              Oui, j&apos;ai 18 ans ou plus
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-10"
            >
              Non, j&apos;ai moins de 18 ans
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-8">
          L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
          <br />
          La vente d&apos;alcool est interdite aux mineurs de moins de 18 ans.
        </p>
      </div>
    </div>
  );
}
export default function AgeVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Wine className="w-20 h-20 text-amber-400 animate-pulse" />
      </div>
    }>
      <AgeVerificationContent />
    </Suspense>
  );
}