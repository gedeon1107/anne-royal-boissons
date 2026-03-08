import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Mentions légales — Anne Royal Boissons",
};

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
          <p>
            <strong>Anne Royal Boissons</strong>
            <br />
            Cotonou, Bénin
            <br />
            Email : contact@anne-royal-boissons.bj
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Hébergement</h2>
          <p>Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, San Francisco, CA 94104, USA.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Obligations légales — Vente d&apos;alcool</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-amber-800 text-sm">
              <li>La vente d&apos;alcool est interdite aux mineurs de moins de 18 ans.</li>
              <li>Il est interdit de vendre des boissons alcooliques à des personnes en état d&apos;ivresse manifeste.</li>
              <li>Conformément à la législation béninoise sur la vente de boissons alcoolisées.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive d&apos;Anne Royal Boissons
            et est protégé par les lois relatives aux droits d&apos;auteur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Protection des données personnelles</h2>
          <p>
            Les informations collectées lors des commandes (nom, email, téléphone, adresse) sont utilisées exclusivement
            pour le traitement et la livraison des commandes. Elles ne sont pas cédées à des tiers.
          </p>
          <p className="mt-2">
            Conformément aux dispositions applicables, vous disposez d&apos;un droit d&apos;accès, de rectification et
            de suppression de vos données. Pour exercer ce droit, contactez-nous à : contact@anne-royal-boissons.bj
          </p>
        </section>
      </div>
    </div>
  );
}
