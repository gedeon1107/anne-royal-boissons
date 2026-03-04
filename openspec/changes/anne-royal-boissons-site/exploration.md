# Exploration — Anne Royal Boissons · Site e-commerce

> Session du 2026-03-02 — **EXPLORATION COMPLÈTE** ✅

---

## 🏢 Le projet en une phrase

Créer un **site e-commerce complet avec back-office** pour **Anne Royal Boissons** (Bénin), permettant la commande en ligne, le paiement Mobile Money, la livraison à domicile ou le retrait en boutique, avec gestion autonome des produits, stocks, commandes et livraisons.

---

## ✅ Vision complète — toutes décisions prises

### L'entreprise
| Champ | Valeur |
|-------|--------|
| Nom | Anne Royal Boissons |
| Pays | Bénin 🇧🇯 |
| Type | Boutique physique + nouveau canal en ligne |
| Rôle | Vendeur unique |

### Les produits
| Champ | Valeur |
|-------|--------|
| Catégories | Vins · Eaux · Alcools · Spiritueux · Rhums · Champagnes · Cannettes · Jus |
| Volume | ~200 références |
| Alcool | Oui → obligations légales (age gate 18+) |
| Catalogue source | Fichier Excel existant ✓ |
| Photos | Disponibles ✓ |

### Le marché
| Champ | Valeur |
|-------|--------|
| Géographie | National — tout le Bénin |
| Clientèle | Grand public (B2C) |
| Base clients | Existante (boutique physique) |

### Commandes & Livraison
| Champ | Valeur |
|-------|--------|
| Canal actuel | Téléphone + WhatsApp |
| Nouveau canal | Site e-commerce |
| Mode 1 | Livraison à domicile |
| Mode 2 | Retrait en boutique |
| Livreurs | Équipe propre |
| Couverture | Tout le Bénin |
| Calcul des frais | Basé sur les tarifs Gozem / Yango (référence Bénin) |
| Assignation livreurs | Via back-office (par admin/employé) → notif WhatsApp livreur |

### Paiement
| Champ | Valeur |
|-------|--------|
| Opérateurs | MTN Mobile Money · Moov Money · Celtis |
| Moment | Au moment de la commande (en ligne) |
| Passerelle | FedaPay (agrégateur local Bénin) — compte marchand à créer |

### Notifications clients
| Champ | Valeur |
|-------|--------|
| Canal | WhatsApp |
| Événements | Confirmation commande · Préparation · En livraison · Livré |

### Back-office
| Champ | Valeur |
|-------|--------|
| Utilisateurs | Propriétaire + Employés |
| Accès employés | Complet (tout le back-office) |
| Accès livreurs | Aucun (assignation + infos via WhatsApp) |
| Modules | Produits · Stock · Commandes · Livraisons · Employés |
| Niveau | Propriétaire à l'aise — gestion quotidienne autonome |

---

## ⚠️ Obligations légales — Alcool au Bénin

- ☐ Page de vérification d'âge (18+) à l'entrée du site
- ☐ Mention "L'abus d'alcool est dangereux pour la santé" visible
- ☐ Interdiction de vente aux mineurs affichée clairement
- ☐ CGV conformes (mentions obligatoires)
- ☐ Mentions légales complètes (adresse, contacts, registre commerce)

---

## 🗺️ Architecture fonctionnelle complète

```
┌──────────────────────────────────────────────────────────────────┐
│                     ANNE ROYAL BOISSONS                        │
├──────────────────────┬───────────────────────────────────────────┤
│  🛒 SITE CLIENT      │  ⚙️  BACK-OFFICE                         │
│  ─────────────────   │  ─────────────────                       │
│  • Age gate (18+)    │  • Dashboard général                     │
│  • Accueil           │  • Produits : ajout/modif/suppression    │
│  • Catalogue + filtres│ • Stock : quantités temps réel          │
│  • Fiche produit     │  • Commandes : liste/détail/statut       │
│  • Panier            │  • Livraisons : assignation + suivi      │
│  • Checkout          │  • Employés : gestion des accès          │
│    ├ Adresse livraison│                                         │
│    ├ Choix : livraison│                                         │
│    │  ou retrait      │                                         │
│    └ Paiement Mobile  │                                         │
│      Money           │                                         │
│  • Suivi commande    │                                         │
│  • Espace client     │                                         │
└──────────────────────┴───────────────────────────────────────────┘
              │                      │
    ┌─────────┴──────┐    ┌──────────┴──────────┐
    │   PAIEMENT     │    │    NOTIFICATIONS     │
    │  ─────────     │    │   ─────────────      │
    │  MTN · Moov    │    │   WhatsApp           │
    │  Celtis        │    │   (clients +         │
    │  via FedaPay   │    │    livreurs)         │
    └────────────────┘    └─────────────────────┘
```

---

## 🗺️ Parcours client complet

```
Client                   Site web                   Back-office / Livreur
  │                         │                               │
  ├─► Age gate (18+) ──────►│                               │
  ├─► Catalogue ───────────►│ Stock temps réel              │
  ├─► Panier ──────────────►│                               │
  ├─► Checkout ────────────►│                               │
  │    ├ Livraison/retrait  │ Calcule frais Gozem/Yango     │
  │    └ Mobile Money ─────►│ → FedaPay → Confirmation      │
  │◄── WhatsApp confirm ────┤                               │
  │                         │──────────────────────────────►│ Nouvelle commande
  │                         │                              Prépare + assigne livreur
  │                         │                              WhatsApp → livreur
  │◄── WhatsApp : en route ─┤◄────── Mise à jour statut ───┤
  │                         │                               │
  ├─► Reçoit livraison      │                               │
  │   OU vient en boutique  │                               │
```

---

## 🔑 Points d'attention clés

| Point | Détail |
|-------|--------|
| **FedaPay** | Compte marchand à créer avant le lancement |
| **Excel → Catalogue** | Import à prévoir (produits + photos) |
| **WhatsApp Business** | Mettre en place l'API WhatsApp Business pour les notifications |
| **Tarifs livraison** | Définir la grille tarifaire basée sur Gozem/Yango |
| **Age gate** | Obligatoire dès la page d'accueil |

---

## 📝 Prochaines étapes

1. ✅ ~~Questions fondamentales~~ → Résolues
2. ✅ ~~Questions de détail~~ → Résolues
3. ➡️ **Choisir le stack technique**
4. Créer une **proposition formelle** (proposal.md)
5. Décomposer en **tâches d'implémentation**

---

*Document d'exploration finalisé — prêt pour la phase de proposition*
