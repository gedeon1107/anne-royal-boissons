import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Conditions générales de vente — Anne Royal Boissons",
};

export default function CGVPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Conditions générales de vente</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
        <p className="font-semibold text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
          La vente d&apos;alcool est interdite aux mineurs de moins de 18 ans.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Article 1 — Objet et champ d&apos;application</h2>
          <p>
            Les présentes conditions générales de vente régissent les relations contractuelles entre Anne Royal Boissons
            (ci-après le « Vendeur ») et toute personne physique effectuant un achat sur le site
            anne-royal-boissons.bj (ci-après le « Client »).
          </p>
          <p className="mt-2 font-semibold text-amber-700">
            Toute commande implique l&apos;acceptation sans réserve de ces CGV ainsi que la confirmation d&apos;être âgé
            d&apos;au moins 18 ans.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Article 2 — Produits</h2>
          <p>
            Les produits proposés sont des boissons alcoolisées et non alcoolisées. Les photos sont non contractuelles.
            Les prix sont indiqués en Francs CFA (FCFA) et s&apos;entendent TTC.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Article 3 — Commandes</h2>
          <p>
            La commande est validée après confirmation du paiement via FedaPay (Mobile Money). Un email de confirmation
            est envoyé au Client. Anne Royal Boissons se réserve le droit d&apos;annuler une commande en cas de stock
            insuffisant ou de problème de paiement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Article 4 — Paiement</h2>
          <p>
            Le paiement s&apos;effectue en ligne via Mobile Money (MTN, Moov, Celtis) via la plateforme FedaPay.
            Toute transaction est sécurisée. Aucune donnée bancaire n&apos;est stockée par Anne Royal Boissons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Article 5 — Livraison</h2>
          <p>
            La livraison est effectuée à Cotonou et dans les villes accessibles. Les frais et délais de livraison
            sont indiqués au moment de la commande. Le retrait en boutique est possible sans frais supplémentaires.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Article 6 — Droit de rétractation</h2>
          <p>
            Conformément à la nature des produits (boissons alimentaires), le droit de rétractation ne s&apos;applique
            pas aux commandes de boissons déjà livrées et acceptées par le Client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Article 7 — Loi applicable</h2>
          <p>Les présentes CGV sont soumises au droit béninois.</p>
        </section>
      </div>
    </div>
  );
}
