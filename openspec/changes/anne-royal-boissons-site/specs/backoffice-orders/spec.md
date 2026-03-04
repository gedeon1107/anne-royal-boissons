## ADDED Requirements

### Requirement: Gestion des commandes (back-office)
Le système SHALL permettre aux employés de consulter et gérer toutes les commandes reçues.

#### Scenario: Liste des commandes
- **WHEN** un employé accède à la section "Commandes" du back-office
- **THEN** le système affiche la liste des commandes triées par date, avec statut, client et montant

#### Scenario: Détail d'une commande
- **WHEN** un employé clique sur une commande
- **THEN** le système affiche le détail : articles commandés, adresse, mode livraison, statut de paiement, historique des statuts

#### Scenario: Mise à jour du statut d'une commande
- **WHEN** un employé change le statut d'une commande (ex: "En préparation")
- **THEN** le système met à jour le statut, enregistre l'horodatage et déclenche la notification SMS/email au client

#### Scenario: Filtrage des commandes par statut
- **WHEN** un employé filtre par statut (ex: "En attente")
- **THEN** le système affiche uniquement les commandes correspondantes

### Requirement: Gestion des livraisons (back-office)
Le système SHALL permettre d'assigner les commandes à des livreurs et de suivre l'état des livraisons.

#### Scenario: Assignation d'un livreur
- **WHEN** un employé assigne un livreur à une commande en livraison
- **THEN** le système enregistre l'assignation et envoie un SMS au livreur avec les détails de la livraison (adresse, articles, client)

#### Scenario: Confirmation de livraison
- **WHEN** un employé marque une commande comme "Livrée"
- **THEN** le système met à jour le statut et déclenche la notification de confirmation au client
