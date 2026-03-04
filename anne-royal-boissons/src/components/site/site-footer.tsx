import Link from "next/link";
import { Wine } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Legal warning banner */}
      <div className="bg-amber-900/50 border-b border-amber-800 py-2 text-center text-xs text-amber-200">
        ⚠️ L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
        Vente interdite aux mineurs de moins de 18 ans.
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wine className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white">Anne Royal Boissons</span>
            </div>
            <p className="text-sm text-gray-400">
              Votre boutique premium de boissons au Bénin. Vins, spiritueux, champagnes et plus.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-3">Catalogue</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogue" className="hover:text-white transition-colors">Tous les produits</Link></li>
              <li><Link href="/catalogue?categorie=vins" className="hover:text-white transition-colors">Vins</Link></li>
              <li><Link href="/catalogue?categorie=spiritueux" className="hover:text-white transition-colors">Spiritueux</Link></li>
              <li><Link href="/catalogue?categorie=champagnes" className="hover:text-white transition-colors">Champagnes</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3">Informations légales</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">Conditions générales de vente</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Anne Royal Boissons — Cotonou, Bénin
        </div>
      </div>
    </footer>
  );
}
