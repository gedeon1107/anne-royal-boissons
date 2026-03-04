# Proposal — Anne Royal Boissons · Site e-commerce

## Motivation

Anne Royal Boissons est une boutique physique de boissons basée au Bénin 🇧🇯, avec ~200 références (Vins, Eaux, Alcools, Spiritueux, Rhums, Champagnes, Cannettes, Jus) et une clientèle existante. Aujourd'hui, les commandes se font uniquement par **téléphone et WhatsApp**, ce qui limite la croissance, génère des erreurs de commande et empêche un suivi structuré des stocks et livraisons.

Le projet vise à créer un **canal de vente en ligne moderne** complété par un **back-office de gestion autonome**, permettant à l'entreprise de scaler sans dépendre d'un tiers technique au quotidien.

## Description

Création complète d'un site e-commerce pour Anne Royal Boissons avec :
- Un **site client** permettant de parcourir le catalogue, commander et payer en ligne
- Un **back-office** permettant au propriétaire et aux employés de gérer produits, stocks, commandes et livraisons
- Des **intégrations locales** adaptées au marché béninois (FedaPay, Africa's Talking, Resend)

## Capabilities

### New Capabilities

- `age-gate` : Vérification d'âge (18+) à l'entrée du site — obligation légale pour la vente d'alcool au Bénin
- `product-catalog` : Catalogue en ligne avec ~200 références, filtres par catégorie, recherche, fiches produit détaillées
- `shopping-cart` : Panier d'achat persistant avec gestion des quantités et stocks temps réel
- `checkout` : Tunnel de commande avec choix livraison/retrait, calcul automatique des frais (grille Gozem/Yango), saisie adresse
- `mobile-money-payment` : Paiement en ligne via MTN Mobile Money, Moov Money et Celtis — intégré via FedaPay
- `order-tracking` : Suivi de commande en temps réel pour le client (statuts : confirmée, en préparation, en livraison, livrée)
- `customer-account` : Espace client (historique des commandes, adresses sauvegardées)
- `sms-email-notifications` : Notifications automatiques client à chaque changement de statut commande — via Africa's Talking (SMS) + Resend (email)
- `backoffice-products` : Gestion du catalogue produits (création, modification, suppression, photos, catégories)
- `backoffice-stock` : Gestion des stocks en temps réel avec alertes de rupture
- `backoffice-orders` : Liste et détail des commandes, mise à jour des statuts
- `backoffice-deliveries` : Assignation des commandes aux livreurs, notification WhatsApp livreur, suivi des livraisons
- `backoffice-employees` : Gestion des comptes employés (accès back-office complet)
- `admin-auth` : Authentification sécurisée pour le back-office (NextAuth.js v5)
- `product-import` : Import initial du catalogue depuis le fichier Excel existant

### Modified Capabilities

_Aucune — projet greenfield._

## Impact

### Systèmes créés

- **Application Next.js 15** (App Router) — site client + back-office dans un seul projet
- **Base de données PostgreSQL** managée sur Neon.tech (intégration Vercel native)
- **Compte FedaPay marchand** — à créer par le client avant le lancement
- **Compte Africa's Talking** — à créer par le client (SDK Node.js)
- **Compte Resend** — à créer par le client (plan gratuit suffisant au démarrage)
- **Déploiement Vercel** — hébergement frontend + serverless functions

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Next.js Server Actions + API Routes |
| Base de données | PostgreSQL (Neon.tech) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Paiement | FedaPay SDK Node.js |
| SMS | Africa's Talking SDK Node.js |
| Email | Resend SDK Node.js |
| Hébergement | Vercel |

### Dépendances externes

- FedaPay : compte marchand à ouvrir (délai d'activation possible ~1 semaine)
- Africa's Talking : inscription immédiate, sandbox disponible
- Resend : plan gratuit, inscription immédiate
- Neon.tech : plan gratuit suffisant pour le démarrage

### Obligations légales à respecter

- Age gate 18+ obligatoire (alcool)
- Mention "L'abus d'alcool est dangereux pour la santé" visible
- CGV et mentions légales conformes
