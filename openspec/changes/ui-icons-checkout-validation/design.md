## Context

Anne Royal Boissons est un site e-commerce Next.js 16 (App Router) pour la vente de boissons au Bénin. Le site utilise actuellement des emojis Unicode dans l'UI (catégories, checkout, footer, notifications), une validation checkout principalement côté client via Zod/react-hook-form, et un flux de paiement FedaPay (Mobile Money) dont le webhook ne vérifie pas le montant payé.

**Stack** : Next.js 16, Prisma 7, PostgreSQL (Neon), Zustand (panier), FedaPay (paiement), Lucide React (déjà installé via shadcn/ui).

**État actuel des problèmes** :
1. 18+ emojis dispersés dans 8 fichiers (catégories, checkout, footer, CGV, mentions légales, notifications SMS/email, admin livraisons)
2. La validation serveur dans `createOrder()` ne vérifie ni le format email, ni le format téléphone, ni la cohérence des prix envoyés par le client
3. Le webhook FedaPay ne compare pas le montant payé au total de la commande stocké en base — un paiement partiel serait validé
4. Pas de protection contre le rejeu de webhook (une même transaction pourrait être confirmée deux fois)

## Goals / Non-Goals

**Goals:**
- Remplacer tous les emojis par des icônes Lucide cohérentes et professionnelles
- Valider côté serveur : email (format RFC), téléphone (format béninois 8+ chiffres), et recalculer les prix depuis la BDD
- Vérifier dans le webhook que le montant payé correspond au total de la commande
- Rendre le webhook idempotent (ignorer si commande déjà confirmée)

**Non-Goals:**
- Refonte complète du design UI (pas de changement de layout/couleurs)
- Ajout d'un nouveau provider de paiement
- Modification du schéma Prisma (le champ `total` existe déjà sur Order)
- Validation d'adresse postale (hors périmètre)

## Decisions

### 1. Mapping icônes par catégorie

Utiliser un objet de mapping `slug → LucideIcon` dans `category-grid.tsx` plutôt qu'un emoji fallback. Icônes choisies :

| Slug | Icône Lucide |
|------|-------------|
| champagnes | `GlassWater` |
| vins | `Wine` |
| rhums | `Flame` |
| spiritueux | `Martini` |
| liqueurs | `CupSoda` |
| cannettes | `Beer` |
| sans-alcool | `Grape` |
| (fallback) | `Package` |

**Justification** : Lucide est déjà inclus dans le projet via shadcn/ui. Les icônes sont SVG, accessibles, et cohérentes visuellement.

### 2. Remplacement dans checkout et footer

- `🏠` → `<Home className="w-5 h-5" />`
- `🏪` → `<Store className="w-5 h-5" />`
- `💳` → `<CreditCard className="w-5 h-5" />`
- `⚠️` → `<AlertTriangle className="w-5 h-5 text-amber-500" />`
- `🚴` → `<Bike className="w-5 h-5" />`

### 3. Notifications : suppression des emojis

Les emojis dans les SMS et emails seront remplacés par du texte ou des icônes ASCII :
- SMS : supprimer les emojis, garder un marqueur textuel (ex: `[Anne Royal]` au lieu de `🍷`)
- Email HTML : utiliser des icônes HTML/CSS ou simplement du texte stylé

### 4. Validation serveur renforcée dans `createOrder()`

```
1. Valider email avec regex RFC 5322 simplifiée
2. Valider téléphone : strip whitespace/dashes, vérifier 8+ digits
3. Pour chaque item du panier :
   a. Charger le produit depuis la BDD (inclure price, displayedPrice, isActive, stock)
   b. Vérifier que le prix envoyé (unitPrice) correspond au prix réel en BDD
   c. Vérifier le stock
4. Recalculer le subtotal côté serveur (somme des unitPrice * quantity depuis la BDD)
5. Charger la zone de livraison et son prix depuis la BDD
6. Recalculer le total côté serveur
```

**Alternative envisagée** : Faire confiance au client pour les prix → rejeté car vulnérable à la manipulation.

### 5. Sécurisation webhook FedaPay

```
1. Si order.status !== "PENDING" → retourner 200 (idempotent, ne pas retraiter)
2. Extraire le montant du payload FedaPay (data.amount)
3. Comparer data.amount avec Number(order.total)
4. Si montant différent → log warning, NE PAS confirmer, retourner 200
5. Si montant correct → confirmer et décrémenter stock (comme actuellement)
```

**Alternative envisagée** : Ajouter un statut `PAYMENT_FAILED` → rejeté pour simplifier. On se contente de ne pas confirmer la commande (elle reste en `PENDING` et l'admin peut investiguer).

## Risks / Trade-offs

- **[Risque] Mapping icônes incomplet** → Si une nouvelle catégorie est ajoutée, elle utilisera l'icône fallback `Package`. Mitigation : le mapping est centralisé dans un seul fichier, facile à étendre.
- **[Risque] Regex email trop stricte** → Pourrait rejeter des emails valides rares. Mitigation : utiliser la même regex que Zod (déjà validée côté client), pas de sur-ingénierie.
- **[Risque] Webhook FedaPay change de format** → Le champ `data.amount` pourrait changer dans une future version de l'API. Mitigation : log le payload complet en warning si le champ est absent.
- **[Trade-off] Recalcul côté serveur = requêtes DB supplémentaires** → Acceptable car `createOrder` est appelé une seule fois par commande. La sécurité prime sur la performance ici.
