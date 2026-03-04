# Guide de Configuration — Anne Royal Boissons

Ce guide vous explique étape par étape comment configurer tous les services externes,
renseigner les variables d'environnement, migrer la base de données et déployer le projet.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Variables d'environnement](#2-variables-denvironnement)
3. [Neon.tech — Base de données PostgreSQL](#3-neontech--base-de-données-postgresql)
4. [NextAuth — Secret de sécurité](#4-nextauth--secret-de-sécurité)
5. [FedaPay — Paiement Mobile Money](#5-fedapay--paiement-mobile-money)
6. [Africa's Talking — Notifications SMS](#6-africas-talking--notifications-sms)
7. [Resend — Notifications Email](#7-resend--notifications-email)
8. [Migration et seed de la base de données](#8-migration-et-seed-de-la-base-de-données)
9. [Lancer le projet en local](#9-lancer-le-projet-en-local)
10. [Déploiement sur Vercel](#10-déploiement-sur-vercel)
11. [Checklist finale](#11-checklist-finale)

---

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** v18 ou supérieur → https://nodejs.org
- **Git** → https://git-scm.com
- Un compte **GitHub** (pour lier le dépôt à Vercel)

Vérifier les versions :
```bash
node --version   # doit afficher v18.x ou supérieur
npm --version
git --version
```

---

## 2. Variables d'environnement

Le fichier `.env.local` se trouve à la racine du projet (`anne-royal-boissons/.env.local`).
Vous devez remplacer **toutes** les valeurs `CHANGE_ME` ou `your_key` par les vraies valeurs.

```
anne-royal-boissons/
└── .env.local   ← c'est ce fichier que vous éditez
```

> ⚠️ Ne commitez jamais `.env.local` sur GitHub. Il est déjà dans `.gitignore`.

---

## 3. Neon.tech — Base de données PostgreSQL

### 3.1 Créer un compte et un projet

1. Allez sur **https://neon.tech**
2. Cliquez sur **Sign Up** → connectez-vous avec GitHub ou Email
3. Une fois connecté, cliquez sur **New Project**
4. Remplissez :
   - **Project name** : `anne-royal-boissons`
   - **Database name** : `anne_royal` (ou laissez le nom par défaut)
   - **Region** : choisissez `AWS EU West` (le plus proche de l'Afrique de l'Ouest)
5. Cliquez sur **Create Project**

### 3.2 Récupérer la connection string

1. Une fois le projet créé, vous arrivez sur le **Dashboard**
2. Dans la section **Connection Details**, sélectionnez :
   - **Role** : votre rôle par défaut
   - **Database** : votre base
   - **Branch** : `main`
3. Cliquez sur le menu déroulant **Connection string** et choisissez **Prisma**
4. Copiez la chaîne de connexion — elle ressemble à :
   ```
   postgresql://user:password@ep-xxx-xxx.eu-west-2.aws.neon.tech/anne_royal?sslmode=require
   ```

### 3.3 Renseigner dans .env.local

Ouvrez `.env.local` et remplacez :
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```
Par votre vraie connection string Neon, exemple :
```env
DATABASE_URL="postgresql://anne_royal_owner:AbCdEf123@ep-cool-sea-123456.eu-west-2.aws.neon.tech/anne_royal?sslmode=require"
```

---

## 4. NextAuth — Secret de sécurité

### 4.1 Générer un secret aléatoire

Ouvrez un terminal PowerShell et tapez :
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Cela affiche une chaîne comme : `K8xZ2mQ4nP7vL9cR1wY3jH5bT6uF0eA+`

### 4.2 Renseigner dans .env.local

```env
AUTH_SECRET="K8xZ2mQ4nP7vL9cR1wY3jH5bT6uF0eA+"
NEXTAUTH_URL="http://localhost:3000"
```

> En production sur Vercel, `NEXTAUTH_URL` sera l'URL de votre domaine, ex: `https://anne-royal-boissons.vercel.app`

---

## 5. FedaPay — Paiement Mobile Money

FedaPay est la passerelle de paiement Mobile Money (MTN, Moov, Celtis) pour le Bénin.

### 5.1 Créer un compte

1. Allez sur **https://fedapay.com**
2. Cliquez sur **Créer un compte**
3. Remplissez vos informations (nom, email, téléphone)
4. Confirmez votre email

### 5.2 Récupérer les clés API Sandbox (pour les tests)

1. Connectez-vous sur **https://dashboard.fedapay.com**
2. Dans le menu gauche, cliquez sur **Paramètres** → **Clés API**
3. Assurez-vous d'être en mode **Sandbox** (bascule en haut à droite)
4. Copiez :
   - **Clé secrète** (commence par `sk_sandbox_...`)
   - **Clé publique** (commence par `pk_sandbox_...`)

### 5.3 Renseigner dans .env.local

```env
FEDAPAY_SECRET_KEY="sk_sandbox_VOTRE_CLE_SECRETE"
FEDAPAY_PUBLIC_KEY="pk_sandbox_VOTRE_CLE_PUBLIQUE"
NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY="pk_sandbox_VOTRE_CLE_PUBLIQUE"
```

### 5.4 Configurer le webhook (pour la confirmation de paiement)

1. Dans le dashboard FedaPay → **Paramètres** → **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL : `https://VOTRE-DOMAINE.vercel.app/api/fedapay/webhook`
4. Cochez l'événement `transaction.approved`
5. Notez la **clé secrète webhook** si FedaPay en génère une

> En développement local, utilisez [ngrok](https://ngrok.com) pour exposer votre localhost :
> ```bash
> ngrok http 3000
> # puis utilisez l'URL ngrok comme webhook URL
> ```

---

## 6. Africa's Talking — Notifications SMS

### 6.1 Créer un compte

1. Allez sur **https://africastalking.com**
2. Cliquez sur **Get Started** → **Create an Account**
3. Remplissez le formulaire (nom, email, pays : Bénin)
4. Confirmez votre email

### 6.2 Créer une application Sandbox

1. Connectez-vous sur **https://account.africastalking.com**
2. Allez dans **Sandbox** (lien dans le menu)
3. Cliquez sur **Create App** → nommez-la `anne-royal-boissons`
4. Une clé API sandbox est générée automatiquement

### 6.3 Récupérer les identifiants

1. Dans votre application sandbox, cliquez sur **Settings** → **API Key**
2. Copiez la clé API

Pour le sandbox, le `username` est toujours `sandbox`.

### 6.4 Renseigner dans .env.local

```env
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="VOTRE_CLE_API_ICI"
AFRICASTALKING_SENDER_ID=""
```

> En production, votre `username` sera le nom de votre compte/application réelle,
> et vous pourrez acheter un `SENDER_ID` (ex: `ANNEROYAL`) auprès d'Africa's Talking.

---

## 7. Resend — Notifications Email

### 7.1 Créer un compte

1. Allez sur **https://resend.com**
2. Cliquez sur **Sign Up** → connectez-vous avec GitHub ou Email
3. Confirmez votre email

### 7.2 Créer une clé API

1. Dans le dashboard Resend, cliquez sur **API Keys** dans le menu gauche
2. Cliquez sur **Create API Key**
3. Nom : `anne-royal-boissons`
4. Permission : **Full access** (ou **Sending access** uniquement)
5. Copiez la clé (commence par `re_...`) — **elle n'est affichée qu'une seule fois**

### 7.3 Configurer un domaine d'envoi (optionnel en sandbox)

En mode développement, Resend vous autorise à envoyer depuis `onboarding@resend.dev`.
Pour la production, vous devrez vérifier votre domaine :

1. Dashboard Resend → **Domains** → **Add Domain**
2. Entrez `anne-royal-boissons.bj` (ou votre domaine)
3. Ajoutez les enregistrements DNS indiqués chez votre registrar

### 7.4 Renseigner dans .env.local

```env
RESEND_API_KEY="re_VOTRE_CLE_API_ICI"
RESEND_FROM_EMAIL="commandes@anne-royal-boissons.bj"
```

> Pendant les tests sans domaine vérifié, utilisez `onboarding@resend.dev` comme `RESEND_FROM_EMAIL`.

---

## 8. Migration et seed de la base de données

Une fois `DATABASE_URL` correctement renseigné dans `.env.local`, ouvrez un terminal
dans le dossier `anne-royal-boissons/` et exécutez ces commandes dans l'ordre :

### Étape 1 — Créer les tables (migration initiale)

```bash
npm run db:migrate
```

Prisma vous demandera un nom pour la migration. Tapez :
```
init_schema
```
puis appuyez sur Entrée.

> Cette commande crée toutes les tables dans votre base Neon.tech.
> Si vous voyez `✓ Your database is now in sync with your schema`, c'est bon.

### Étape 2 — Peupler la base (catalogue + admin + zones)

```bash
npm run db:seed
```

Le script va créer :
- ✅ Le compte administrateur (`admin@anne-royal-boissons.bj` / `Admin@2024!`)
- ✅ Les 7 catégories de produits
- ✅ 80 produits du catalogue avec leurs images
- ✅ Les 6 zones de livraison

> Si vous voyez `🎉 Seed complete!`, tout s'est bien passé.

### (Optionnel) Ouvrir Prisma Studio pour vérifier

```bash
npm run db:studio
```

Cela ouvre une interface web sur `http://localhost:5555` pour consulter vos données.

---

## 9. Lancer le projet en local

```bash
cd anne-royal-boissons
npm run dev
```

Le projet démarre sur **http://localhost:3000**

### URLs importantes

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Site client (age gate en premier) |
| `http://localhost:3000/catalogue` | Catalogue produits |
| `http://localhost:3000/panier` | Panier |
| `http://localhost:3000/admin/login` | Connexion back-office |
| `http://localhost:3000/admin/dashboard` | Tableau de bord admin |

### Identifiants admin par défaut

```
Email    : admin@anne-royal-boissons.bj
Mot de passe : Admin@2024!
```

> ⚠️ **Changez ce mot de passe immédiatement** après la première connexion en production.

---

## 10. Déploiement sur Vercel

### 10.1 Pousser le code sur GitHub

1. Créez un repository GitHub (si pas encore fait) :
   - https://github.com/new
   - Nom : `anne-royal-boissons`
   - Visibilité : **Private**

2. Dans le terminal, depuis le dossier `anne-royal-boissons/` :
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/anne-royal-boissons.git
git push -u origin main
```

### 10.2 Créer le projet sur Vercel

1. Allez sur **https://vercel.com** → **Sign Up** avec GitHub
2. Cliquez sur **Add New Project**
3. Importez votre repository `anne-royal-boissons`
4. Vercel détecte automatiquement **Next.js** — ne rien changer au framework

### 10.3 Configurer les variables d'environnement sur Vercel

Avant de cliquer sur **Deploy**, ajoutez toutes vos variables :

Dans la section **Environment Variables**, ajoutez une par une :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Votre connection string Neon |
| `AUTH_SECRET` | Votre secret généré |
| `NEXTAUTH_URL` | `https://VOTRE-PROJET.vercel.app` |
| `FEDAPAY_SECRET_KEY` | `sk_live_...` (clé production) |
| `FEDAPAY_PUBLIC_KEY` | `pk_live_...` (clé production) |
| `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY` | `pk_live_...` |
| `AFRICASTALKING_USERNAME` | Votre username production |
| `AFRICASTALKING_API_KEY` | Votre clé API production |
| `AFRICASTALKING_SENDER_ID` | Votre sender ID |
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM_EMAIL` | `commandes@anne-royal-boissons.bj` |
| `NEXT_PUBLIC_APP_URL` | `https://VOTRE-PROJET.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | `Anne Royal Boissons` |

### 10.4 Lancer le déploiement

Cliquez sur **Deploy**. Vercel va :
1. Installer les dépendances (`npm install`)
2. Générer le client Prisma (`npx prisma generate`)
3. Compiler le projet (`next build`)
4. Déployer sur son CDN mondial

Le déploiement prend environ **2-3 minutes**.

### 10.5 Configurer un domaine personnalisé (optionnel)

1. Dans votre projet Vercel → **Settings** → **Domains**
2. Ajoutez votre domaine : `anne-royal-boissons.bj`
3. Ajoutez les enregistrements DNS indiqués chez votre registrar (ex: Gandi, OVH...)

---

## 11. Checklist finale

Cochez chaque point avant d'ouvrir le site au public :

### Configuration
- [ ] `DATABASE_URL` renseigné et base de données migrée (`npm run db:migrate`)
- [ ] Catalogue seedé (`npm run db:seed`)
- [ ] `AUTH_SECRET` généré et renseigné
- [ ] FedaPay en mode **production** (clés `sk_live_` et `pk_live_`)
- [ ] Webhook FedaPay configuré avec l'URL de production
- [ ] Africa's Talking en mode production (username + clé réelle)
- [ ] Sender ID Africa's Talking configuré
- [ ] Domaine email vérifié sur Resend
- [ ] `NEXTAUTH_URL` mis à jour avec l'URL de production

### Tests avant ouverture
- [ ] Age gate fonctionne (redirection si refus)
- [ ] Inscription client fonctionne
- [ ] Ajout au panier fonctionne
- [ ] Checkout avec paiement FedaPay sandbox réussi
- [ ] Email de confirmation reçu
- [ ] SMS de confirmation reçu
- [ ] Connexion admin fonctionne
- [ ] Changement de statut commande déclenche SMS/email
- [ ] Site responsive sur mobile

### Sécurité
- [ ] Mot de passe admin changé (depuis `/admin/employes`)
- [ ] `.env.local` absent du repository GitHub
- [ ] Variables d'environnement définies sur Vercel (pas en clair dans le code)

---

## Dépannage rapide

### `prisma migrate dev` échoue

**Erreur** : `Can't reach database server`
→ Vérifiez que `DATABASE_URL` dans `.env.local` est correct (copié depuis Neon, pas de guillemets manquants)

**Erreur** : `SSL required`
→ Assurez-vous que l'URL se termine par `?sslmode=require`

### Le seed échoue sur "déjà existant"

```bash
npx prisma migrate reset
npm run db:seed
```
> ⚠️ `migrate reset` supprime toutes les données. À n'utiliser qu'en développement.

### Les images ne s'affichent pas

Les images sont dans `public/images/products/`. Si elles n'apparaissent pas :
1. Vérifiez que le dossier existe : `ls public/images/products/`
2. En production Vercel, vous devrez utiliser un service comme **Cloudinary** ou **Vercel Blob** car Vercel ne stocke pas les fichiers statiques uploadés dynamiquement.

### FedaPay ne redirige pas après paiement

Vérifiez que `NEXT_PUBLIC_APP_URL` est bien votre URL de production et non `localhost`.

---

*Documentation générée pour le projet Anne Royal Boissons — Mars 2026*
