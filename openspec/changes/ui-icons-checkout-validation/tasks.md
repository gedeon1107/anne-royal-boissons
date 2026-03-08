## 1. Icônes professionnelles — Catégories

- [x] 1.1 Remplacer les emojis par un mapping `slug → LucideIcon` dans `src/components/site/category-grid.tsx` (Wine, GlassWater, Flame, Martini, CupSoda, Beer, Grape, fallback Package)
- [x] 1.2 Vérifier le rendu visuel de la grille de catégories sur la page d'accueil

## 2. Icônes professionnelles — Checkout

- [x] 2.1 Remplacer 🏠 par `<Home>`, 🏪 par `<Store>`, 💳 par `<CreditCard>` dans `src/app/(site)/checkout/page.tsx`
- [x] 2.2 Vérifier que les icônes s'affichent correctement dans le formulaire de checkout à chaque étape

## 3. Icônes professionnelles — Footer et pages légales

- [x] 3.1 Remplacer ⚠️ par `<AlertTriangle className="w-5 h-5 text-amber-500 inline" />` dans `src/components/site/site-footer.tsx`
- [x] 3.2 Remplacer ⚠️ par `<AlertTriangle>` dans `src/app/(site)/cgv/page.tsx`
- [x] 3.3 Remplacer ⚠️ par `<AlertTriangle>` dans `src/app/(site)/mentions-legales/page.tsx`

## 4. Icônes professionnelles — Notifications

- [x] 4.1 Supprimer les emojis (🍷, ✅, ❌, 📦, 🚴, 🎉) des SMS dans `src/lib/notifications.ts` — remplacer par du texte neutre
- [x] 4.2 Supprimer les emojis des emails HTML dans `src/lib/notifications.ts` — utiliser du texte stylé

## 5. Icônes professionnelles — Admin

- [x] 5.1 Remplacer 🚴 par `<Bike>` dans `src/app/(admin)/admin/livraisons/page.tsx`

## 6. Validation checkout serveur — Email et téléphone

- [x] 6.1 Ajouter une validation email avec regex dans `createOrder()` dans `src/lib/actions/order-actions.ts` — retourner erreur si invalide
- [x] 6.2 Ajouter une validation téléphone (strip espaces/tirets, min 8 chiffres) dans `createOrder()`

## 7. Validation checkout serveur — Prix et stock

- [x] 7.1 Charger les prix réels (price, displayedPrice) de chaque produit depuis la BDD dans `createOrder()` — ne pas faire confiance au `unitPrice` du client
- [x] 7.2 Recalculer le subtotal côté serveur (somme de prix_BDD × quantité) et l'utiliser à la place de `input.subtotal`
- [x] 7.3 Charger le prix de la zone de livraison depuis la BDD et recalculer le total côté serveur

## 8. Validation checkout serveur — Champs livraison

- [x] 8.1 Ajouter une validation des champs requis quand deliveryMode est HOME_DELIVERY (address, city, deliveryZoneId) dans `createOrder()`

## 9. Sécurisation webhook FedaPay

- [x] 9.1 Ajouter la vérification d'idempotence dans le webhook — si `order.status !== "PENDING"`, retourner 200 sans traitement
- [x] 9.2 Extraire `data.amount` du payload webhook et comparer avec `Number(order.total)` — ne pas confirmer si montant différent
- [x] 9.3 Ajouter un log warning avec transactionId, montant attendu et reçu en cas de mismatch

## 10. Tests manuels

- [x] 10.1 Vérifier la page d'accueil : catégories avec icônes Lucide, pas d'emojis
- [x] 10.2 Vérifier le checkout : icônes sur les étapes livraison et paiement
- [x] 10.3 Tester la soumission du formulaire checkout avec email invalide — vérifier le rejet côté serveur
- [x] 10.4 Tester que le total est recalculé côté serveur (pas de manipulation possible)
