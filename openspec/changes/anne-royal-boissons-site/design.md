# Design — Anne Royal Boissons · Site e-commerce

## Context

Anne Royal Boissons est un projet **greenfield** : aucun code existant à migrer. Le système doit être opérationnel de A à Z — site client, back-office, paiement, notifications — adapté au marché béninois avec des contraintes spécifiques (Mobile Money, SMS, obligations légales alcool).

L'équipe cible (propriétaire + employés) n'est pas technique : le back-office doit être intuitif et autonome.

---

## Goals / Non-Goals

**Goals:**
- Site e-commerce complet avec catalogue ~200 produits, panier, checkout, paiement Mobile Money
- Back-office autonome pour gérer produits, stocks, commandes, livraisons, employés
- Notifications SMS (Africa's Talking) + email (Resend) à chaque étape commande
- Conformité légale alcool (age gate 18+, mentions obligatoires)
- Déploiement sur Vercel + Neon.tech (PostgreSQL managé)
- Stack monorepo unique : Next.js 15 App Router

**Non-Goals:**
- Application mobile native (réservé à une v2)
- Marketplace multi-vendeurs
- Gestion comptable ou facturation avancée
- Subscription / abonnements
- Intégration WhatsApp Business API (trop complexe à obtenir — remplacé par SMS + email)
- Livreurs avec accès back-office (notification via SMS uniquement)

---

## Decisions

### D1 — Next.js 15 App Router (monorepo unique)
**Décision** : Un seul projet Next.js contient à la fois le site client (`/`) et le back-office (`/admin`).

**Alternatives considérées** :
- Deux projets séparés (frontend + backend API) → rejeté : double déploiement, complexité inutile pour cette taille de projet
- Laravel + React → rejeté : deux langages, courbe d'apprentissage plus longue

**Rationale** : Un seul codebase TypeScript, partage des types Prisma, Server Actions pour simplifier les formulaires back-office, déploiement Vercel natif.

---

### D2 — shadcn/ui pour toute l'interface
**Décision** : shadcn/ui (Radix UI + Tailwind CSS) pour le site client ET le back-office.

**Rationale** :
- Composants accessibles et customisables
- Cohérence visuelle entre les deux interfaces
- Pas de dépendance à des composants externes propriétaires
- Le back-office utilise les composants Table, Form, Dialog, Badge de shadcn/ui

---

### D3 — Prisma + Neon (PostgreSQL serverless)
**Décision** : Prisma ORM connecté à Neon.tech (PostgreSQL serverless).

**Rationale** :
- Neon est nativement intégré à Vercel (marketplace Vercel)
- Plan gratuit suffisant pour le démarrage
- Prisma génère les types TypeScript → sécurité du schéma bout en bout
- Pas de gestion de serveur de base de données

**Risque** : Cold starts sur le plan gratuit Neon → Mitigation : connection pooling activé par défaut.

---

### D4 — FedaPay pour le paiement Mobile Money
**Décision** : FedaPay comme passerelle de paiement unique.

**Rationale** :
- Agrégateur local Bénin supportant MTN, Moov, Celtis
- SDK Node.js officiel
- Seul acteur disponible localement pour cet usage

**Risque** : Délai d'obtention du compte marchand (~1 semaine) → Mitigation : démarrer les démarches dès la phase de développement. Le SDK propose un mode sandbox pour développer sans compte actif.

---

### D5 — Africa's Talking (SMS) + Resend (email) pour les notifications
**Décision** : Deux canaux de notification complémentaires.

**Rationale** :
- Africa's Talking : spécialisé marché africain, couverture MTN/Moov/Celtis Bénin, inscription immédiate + sandbox
- Resend : API email moderne avec SDK Next.js natif, plan gratuit généreux (3 000 emails/mois)
- WhatsApp Business API écarté : processus de validation Meta long et incertain

**Alternatives considérées** :
- Twilio SMS → disponible au Bénin mais plus cher qu'Africa's Talking
- Brevo → bon pour email mais SMS moins optimisé pour le Bénin

---

### D6 — NextAuth.js v5 pour le back-office
**Décision** : NextAuth.js v5 (auth.js) avec credential provider pour les comptes employés.

**Rationale** :
- Intégration native Next.js App Router et Middleware
- Sessions côté serveur (JWT) sans dépendances lourdes
- Rôles basiques : ADMIN (propriétaire) / EMPLOYEE

**Non-Goals** : Pas de SSO, pas d'OAuth pour le back-office (usage interne).

---

### D7 — Architecture des pages

```
app/
├── (site)/                    # Site client public
│   ├── page.tsx               # Age gate → Accueil
│   ├── catalogue/
│   ├── produits/[slug]/
│   ├── panier/
│   ├── checkout/
│   ├── commande/[id]/         # Suivi commande
│   └── compte/                # Espace client
├── (admin)/admin/             # Back-office (protégé)
│   ├── dashboard/
│   ├── produits/
│   ├── stock/
│   ├── commandes/
│   ├── livraisons/
│   └── employes/
├── api/
│   ├── auth/                  # NextAuth
│   ├── fedapay/webhook/       # Webhooks paiement
│   └── notifications/         # Africa's Talking callbacks
└── middleware.ts              # Protection routes /admin
```

---

### D8 — Gestion du stock
**Décision** : Stock géré en base de données PostgreSQL avec transactions Prisma.

- Décrémentation atomique lors de la validation commande (après paiement FedaPay confirmé)
- Pas de réservation de stock pendant le checkout (trop complexe pour v1)
- Alerte back-office si stock < seuil configurable

---

### D9 — Calcul des frais de livraison
**Décision** : Grille tarifaire manuelle en base de données (table `delivery_zones`).

- Zones définies par département/ville (Bénin = 12 départements)
- Tarifs basés sur la référence Gozem/Yango, saisis par l'admin
- Retrait en boutique = 0 FCFA

---

## Risks / Trade-offs

| Risque | Mitigation |
|--------|-----------|
| FedaPay compte marchand non activé au lancement | Sandbox en développement, démarches parallèles |
| Cold starts Neon plan gratuit | Connection pooling Neon activé |
| Africa's Talking couverture partielle | Tester en sandbox avant mise en prod |
| ~200 produits + photos → poids images | Utiliser `next/image` avec optimisation Vercel |
| Age gate contournable (JavaScript désactivé) | Middleware server-side + cookie de session |
| Import Excel → catalogue | Script d'import Prisma one-shot à prévoir |

---

## Migration Plan

1. Développement local avec `.env.local` (FedaPay sandbox, Africa's Talking sandbox)
2. Déploiement Vercel preview pour recette client
3. Import catalogue Excel via script Prisma seed
4. Activation comptes marchands (FedaPay prod, Africa's Talking prod)
5. Tests paiement bout en bout avec de vraies cartes
6. Mise en production (merge main → Vercel auto-deploy)

---

## Open Questions

| Question | Statut |
|----------|--------|
| Grille tarifaire livraison par zone (FCFA) | À fournir par le client |
| Numéro WhatsApp Business pour livreurs (notifications SMS à la place) | Remplacé par SMS Africa's Talking |
| Adresse légale complète pour mentions légales et CGV | À fournir par le client |
| Numéro RCCM (registre commerce Bénin) | À fournir par le client |
