"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
      }

      setSent(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h1 className="text-xl font-bold mb-2">Email envoyé !</h1>
          <p className="text-sm text-muted-foreground">
            Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
          </p>
        </div>
        <Link href="/compte/connexion" className="text-sm text-amber-600 hover:underline mt-4 inline-block">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Mot de passe oublié</h1>
      <p className="text-muted-foreground mb-6">
        Entrez votre email pour recevoir un lien de réinitialisation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Envoi en cours..." : "Envoyer le lien"}
        </Button>
      </form>

      <p className="text-sm text-center mt-4">
        <Link href="/compte/connexion" className="text-amber-600 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
