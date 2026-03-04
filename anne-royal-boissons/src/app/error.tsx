"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-5">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Une erreur est survenue
        </h2>
        <p className="text-gray-500 mb-8">
          Quelque chose s&apos;est mal passé. Veuillez réessayer ou revenir plus tard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Accueil
          </a>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left bg-red-50 border border-red-200 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-red-700">
              Détails de l&apos;erreur (dev)
            </summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
