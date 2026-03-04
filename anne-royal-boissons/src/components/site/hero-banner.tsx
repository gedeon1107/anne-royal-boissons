import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-amber-950 text-white py-20 px-4">
      <div className="container mx-auto text-center">
        <p className="text-amber-400 font-semibold mb-3 tracking-wide uppercase text-sm">
          Boutique premium au Bénin
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Vins, Spiritueux &<br />
          <span className="text-amber-400">Boissons d&apos;exception</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
          Plus de 200 références sélectionnées, livrées à votre porte à Cotonou et dans tout le Bénin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-8">
            <Link href="/catalogue">Découvrir le catalogue</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 text-lg px-8">
            <Link href="/catalogue?categorie=vins">Voir les vins</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
