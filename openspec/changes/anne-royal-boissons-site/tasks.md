## 1. Initialisation du projet

- [x] 1.1 Créer le projet Next.js 15 avec App Router, TypeScript et Tailwind CSS
- [x] 1.2 Installer et configurer shadcn/ui (init, thème, composants de base)
- [ ] 1.3 Configurer Neon.tech : créer le projet PostgreSQL et récupérer la connection string
- [x] 1.4 Installer et initialiser Prisma, connecter à Neon
- [x] 1.5 Configurer les variables d'environnement (.env.local, .env.example)
- [ ] 1.6 Configurer le déploiement Vercel (connecter le repo, variables d'env)
- [x] 1.7 Mettre en place ESLint, Prettier et les scripts npm (dev, build, lint)

## 2. Schéma base de données (Prisma)

- [x] 2.1 Définir le modèle `Product` (id, slug, name, description, price, stock, category, images, isActive)
- [x] 2.2 Définir le modèle `Category` (id, name, slug)
- [x] 2.3 Définir le modèle `User` (client) avec NextAuth (id, name, email, passwordHash, addresses)
- [x] 2.4 Définir le modèle `DeliveryZone` (id, name, department, price)
- [x] 2.5 Définir le modèle `Order` avec statuts enum (PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
- [x] 2.6 Définir le modèle `OrderItem` (orderId, productId, quantity, unitPrice)
- [x] 2.7 Définir le modèle `AdminUser` (id, name, email, passwordHash, role: ADMIN | EMPLOYEE, isActive)
- [x] 2.8 Définir le modèle `Delivery` (orderId, deliveryPersonName, deliveryPersonPhone, assignedAt)
- [x] 2.9 Définir le modèle `StockAlert` (productId, threshold)
- [ ] 2.10 Exécuter la migration initiale (`prisma migrate dev`)

## 3. Authentification

- [x] 3.1 Installer et configurer NextAuth.js v5 (auth.js) avec Prisma adapter
- [x] 3.2 Créer le provider "credentials" pour les clients (site)
- [x] 3.3 Créer un provider "credentials" séparé pour le back-office admins/employés
- [x] 3.4 Créer le middleware Next.js pour protéger toutes les routes `/admin`
- [x] 3.5 Créer la page de connexion back-office (`/admin/login`) avec formulaire shadcn/ui
- [x] 3.6 Créer les pages d'inscription et connexion client (`/compte/connexion`, `/compte/inscription`)
- [x] 3.7 Créer le seed initial pour le compte administrateur

## 4. Age Gate

- [x] 4.1 Créer la page d'age gate (`app/(site)/page.tsx` ou layout) avec design premium
- [x] 4.2 Implémenter la logique cookie côté serveur pour mémoriser la validation
- [x] 4.3 Ajouter la vérification dans le middleware Next.js : rediriger vers age gate si cookie absent
- [x] 4.4 Ajouter la mention légale alcool visible sur toutes les pages (footer)

## 5. Catalogue produits (site client)

- [x] 5.1 Créer la page d'accueil avec bannière hero, catégories et produits vedettes
- [x] 5.2 Créer la page catalogue (`/catalogue`) avec grille de produits et filtres catégorie
- [x] 5.3 Implémenter la barre de recherche produits (server-side avec Prisma)
- [x] 5.4 Créer la fiche produit (`/produits/[slug]`) avec galerie photos, description, prix, bouton panier
- [x] 5.5 Afficher le badge "Rupture de stock" et désactiver le bouton si stock = 0
- [x] 5.6 Optimiser les images produits avec `next/image`
- [x] 5.7 Créer le script d'import catalogue depuis Excel (script Prisma seed + xlsx parser)

## 6. Panier

- [x] 6.1 Implémenter le store panier côté client (Zustand ou Context + localStorage)
- [x] 6.2 Créer le composant CartItem (nom, photo, prix, quantité, suppression)
- [x] 6.3 Créer la page panier (`/panier`) avec récapitulatif et total
- [x] 6.4 Ajouter l'icône panier dans le header avec compteur d'articles
- [x] 6.5 Gérer la persistance du panier (localStorage + hydration SSR)
- [x] 6.6 Vérifier la disponibilité du stock en temps réel lors de l'ouverture du panier

## 7. Checkout

- [x] 7.1 Créer la page checkout (`/checkout`) avec stepper : Informations → Livraison → Paiement
- [x] 7.2 Implémenter le formulaire d'adresse de livraison avec validation Zod
- [x] 7.3 Créer le sélecteur mode livraison : domicile / retrait boutique
- [x] 7.4 Implémenter le calcul automatique des frais de livraison selon la zone (table `DeliveryZone`)
- [x] 7.5 Créer le récapitulatif commande avec sous-total, frais livraison, total
- [x] 7.6 Créer la Server Action pour initialiser une transaction FedaPay
- [x] 7.7 Intégrer le widget/redirect FedaPay pour le paiement Mobile Money
- [x] 7.8 Créer la route webhook FedaPay (`/api/fedapay/webhook`) pour confirmer le paiement
- [x] 7.9 Implémenter la décrémentation atomique du stock après confirmation paiement (transaction Prisma)
- [x] 7.10 Créer la page de confirmation commande (`/commande/[id]/confirmation`)

## 8. Suivi commande & espace client

- [x] 8.1 Créer la page suivi commande publique (`/commande/[id]`) avec timeline des statuts
- [x] 8.2 Créer l'espace client (`/compte`) avec historique des commandes
- [x] 8.3 Implémenter la gestion des adresses sauvegardées dans l'espace client
- [x] 8.4 Pré-remplir l'adresse de livraison au checkout si client connecté avec adresse sauvegardée

## 9. Notifications SMS & Email

- [x] 9.1 Installer et configurer Africa's Talking SDK (Node.js)
- [x] 9.2 Installer et configurer Resend SDK (Next.js)
- [x] 9.3 Créer le service de notification (`lib/notifications.ts`) avec fonctions sendSMS et sendEmail
- [x] 9.4 Créer le template email de confirmation de commande (Resend React Email)
- [x] 9.5 Créer le template email de confirmation de livraison
- [x] 9.6 Implémenter l'envoi automatique SMS + email à la confirmation commande (webhook FedaPay)
- [x] 9.7 Implémenter l'envoi SMS à chaque changement de statut (En préparation, En livraison, Livré)
- [x] 9.8 Implémenter l'envoi SMS au livreur lors de l'assignation
- [x] 9.9 Ajouter gestion d'erreur et logging pour les échecs de notification

## 10. Back-office — Layout & Dashboard

- [x] 10.1 Créer le layout back-office (`app/(admin)/admin/layout.tsx`) avec sidebar shadcn/ui
- [x] 10.2 Créer la sidebar avec navigation : Dashboard, Produits, Stock, Commandes, Livraisons, Employés
- [x] 10.3 Créer le dashboard (`/admin/dashboard`) avec KPIs : commandes du jour, CA, stock faible, commandes en attente
- [x] 10.4 Ajouter le bouton de déconnexion et informations de l'utilisateur connecté

## 11. Back-office — Gestion produits

- [x] 11.1 Créer la liste des produits (`/admin/produits`) avec table shadcn/ui (nom, catégorie, prix, stock, statut)
- [x] 11.2 Créer le formulaire de création produit avec upload photo (Vercel Blob ou Cloudinary)
- [x] 11.3 Créer le formulaire de modification produit
- [x] 11.4 Implémenter la suppression produit avec confirmation (Dialog shadcn/ui)
- [x] 11.5 Implémenter le filtrage et la recherche dans la liste produits

## 12. Back-office — Gestion stock

- [x] 12.1 Créer la page stock (`/admin/stock`) avec liste produits et quantités éditables inline
- [x] 12.2 Implémenter la mise à jour de stock (Server Action)
- [x] 12.3 Afficher les alertes stock faible (badge rouge) selon le seuil configuré
- [x] 12.4 Créer la page de configuration des seuils d'alerte stock

## 13. Back-office — Gestion commandes

- [x] 13.1 Créer la liste des commandes (`/admin/commandes`) avec filtre par statut et recherche
- [x] 13.2 Créer la page détail commande avec articles, infos client, adresse, statuts
- [x] 13.3 Implémenter le changement de statut commande (Server Action) avec historique
- [x] 13.4 Déclencher automatiquement les notifications SMS/email à chaque changement de statut

## 14. Back-office — Gestion livraisons

- [x] 14.1 Créer la page livraisons (`/admin/livraisons`) avec commandes à dispatcher
- [x] 14.2 Créer le formulaire d'assignation livreur (nom, numéro de téléphone) sur une commande
- [x] 14.3 Envoyer le SMS au livreur avec les détails lors de l'assignation
- [x] 14.4 Créer la gestion des zones de livraison et tarifs (`/admin/zones`) : CRUD complet

## 15. Back-office — Gestion employés

- [x] 15.1 Créer la page gestion employés (`/admin/employes`) — accessible admin seulement
- [x] 15.2 Créer le formulaire de création de compte employé (email, nom, mot de passe temporaire)
- [x] 15.3 Implémenter l'activation/désactivation d'un compte employé
- [x] 15.4 Masquer le menu "Employés" aux utilisateurs ayant le rôle EMPLOYEE

## 16. Pages légales

- [x] 16.1 Créer la page Mentions légales (`/mentions-legales`)
- [x] 16.2 Créer la page CGV (`/cgv`) avec mentions obligatoires vente alcool
- [x] 16.3 Ajouter le footer avec liens légaux et mention "L'abus d'alcool est dangereux pour la santé"

- [ ] 17.1 Tester le flux de commande complet en sandbox FedaPay (panier → checkout → paiement → confirmation)
- [ ] 17.2 Tester les notifications SMS Africa's Talking en sandbox
- [ ] 17.3 Tester les emails Resend en sandbox
- [ ] 17.4 Tester le back-office complet (produits, stock, commandes, livraisons, employés)
- [ ] 17.5 Tester l'age gate (accès direct URL, cookie, refus mineur)
- [ ] 17.6 Vérifier la responsivité mobile du site client et du back-office
- [ ] 17.7 Tester le script d'import Excel catalogue

## 18. Mise en production

- [ ] 18.1 Activer le compte marchand FedaPay (mode production)
- [ ] 18.2 Activer le compte Africa's Talking (mode production)
- [ ] 18.3 Configurer le domaine personnalisé sur Vercel
- [ ] 18.4 Mettre à jour les variables d'environnement Vercel avec les clés production
- [ ] 18.5 Configurer les URLs de webhook FedaPay en production
- [ ] 18.6 Importer le catalogue complet (~200 produits) depuis le fichier Excel
- [ ] 18.7 Créer le compte admin initial et les comptes employés
- [ ] 18.8 Effectuer un test d'achat réel end-to-end avant ouverture au public
