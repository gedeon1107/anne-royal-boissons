## ADDED Requirements

### Requirement: Gestion du catalogue produits (back-office)
Le système SHALL permettre aux employés et à l'admin de créer, modifier et supprimer des produits depuis le back-office.

#### Scenario: Création d'un produit
- **WHEN** un employé remplit le formulaire et clique sur "Créer le produit"
- **THEN** le système enregistre le produit en base et le rend visible dans le catalogue client

#### Scenario: Modification d'un produit
- **WHEN** un employé modifie les informations d'un produit existant
- **THEN** le système met à jour les informations et les reflète immédiatement sur le site client

#### Scenario: Suppression d'un produit
- **WHEN** un admin supprime un produit
- **THEN** le système remove le produit du catalogue client, mais conserve l'historique dans les commandes passées

#### Scenario: Upload photo produit
- **WHEN** un employé upploade une photo pour un produit
- **THEN** le système stocke l'image optimisée et l'affiche dans la fiche produit

### Requirement: Gestion des stocks (back-office)
Le système SHALL afficher et permettre la modification des quantités en stock pour chaque produit.

#### Scenario: Mise à jour du stock
- **WHEN** un employé modifie la quantité en stock d'un produit
- **THEN** le système met à jour le stock et met à jour la disponibilité sur le site client

#### Scenario: Alerte stock faible
- **WHEN** le stock d'un produit passe en dessous du seuil configuré
- **THEN** le système affiche une alerte visuelle dans le back-office pour cet article
