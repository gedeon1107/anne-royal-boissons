## Why

Le site utilise des emojis Unicode (🍷, 💳, 🏠, ⚠️, etc.) dans l'interface utilisateur — catégories, checkout, notifications, footer — donnant un aspect peu professionnel. De plus, la logique de validation du checkout et du paiement présente des failles : les champs email et téléphone acceptent des valeurs invalides côté serveur (seule la validation Zod côté client protège le formulaire), le panier n'est pas revalidé avant la création de commande côté serveur (prix, disponibilité), et la confirmation de paiement FedaPay manque de vérification robuste du montant payé vs. le montant attendu.

## What Changes

- **Remplacement de tous les emojis par des icônes Lucide** (déjà inclus via shadcn/ui) dans :
  - `category-grid.tsx` : icônes par catégorie (Wine, GlassWater, Beer, etc.)
  - `checkout/page.tsx` : icônes livraison (Home, Store) et paiement (CreditCard)
  - `site-footer.tsx`, `cgv/page.tsx`, `mentions-legales/page.tsx` : icône AlertTriangle pour l'avertissement alcool
  - `notifications.ts` : suppression des emojis dans les SMS/emails (texte neutre)
  - `admin/livraisons/page.tsx` : icône Bike pour les livreurs
- **Renforcement de la validation checkout côté serveur** :
  - Validation stricte de l'email (regex + format) dans `createOrder` server action
  - Validation du numéro de téléphone béninois (format +229, 8+ chiffres)
  - Revalidation des prix produits depuis la base de données (pas de confiance au client)
  - Vérification du stock en temps réel avec verrouillage optimiste
  - Validation du montant de la zone de livraison côté serveur
- **Sécurisation du flux de paiement** :
  - Vérification du montant payé dans le webhook FedaPay vs. montant stocké en base
  - Ajout d'un statut `PAYMENT_FAILED` pour les transactions échouées
  - Protection contre le rejeu de webhook (idempotence via `fedapayTransactionId`)

## Capabilities

### New Capabilities
- `professional-icons`: Remplacement systématique de tous les emojis par des icônes Lucide/shadcn dans l'ensemble du site et des notifications
- `checkout-validation`: Validation robuste côté serveur du formulaire checkout (email, téléphone, prix, stock, zone de livraison)
- `payment-security`: Sécurisation du flux de paiement FedaPay — vérification de montant, idempotence webhook, gestion des échecs

### Modified Capabilities

## Impact

- **Composants modifiés** : `category-grid.tsx`, `checkout/page.tsx`, `site-footer.tsx`, `cgv/page.tsx`, `mentions-legales/page.tsx`, `admin/livraisons/page.tsx`
- **Logique serveur modifiée** : `order-actions.ts` (validation renforcée), `fedapay/webhook/route.ts` (vérification montant)
- **Notifications** : `notifications.ts` (suppression emojis dans SMS/email)
- **Dépendances** : aucune nouvelle — Lucide React est déjà inclus via shadcn/ui
- **Base de données** : potentiel ajout d'un champ `totalAmount` sur le modèle Order pour comparaison webhook, ou ajout de statut `PAYMENT_FAILED`
