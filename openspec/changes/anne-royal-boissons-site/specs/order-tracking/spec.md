## ADDED Requirements

### Requirement: Suivi de commande en ligne
Le système SHALL permettre au client de suivre l'état de sa commande en temps réel via une URL unique.

#### Scenario: Accès au suivi de commande
- **WHEN** un client accède à l'URL de suivi avec son numéro de commande
- **THEN** le système affiche le statut actuel et l'historique des statuts de la commande

#### Scenario: Commande non trouvée
- **WHEN** un client accède à l'URL de suivi avec un numéro invalide
- **THEN** le système affiche un message "Commande introuvable"

### Requirement: Espace client
Le système SHALL permettre aux clients de créer un compte et accéder à leur historique de commandes.

#### Scenario: Création de compte
- **WHEN** un client s'inscrit avec email et mot de passe
- **THEN** le système crée son compte et l'envoie une confirmation par email via Resend

#### Scenario: Consultation de l'historique des commandes
- **WHEN** un client connecté accède à son espace client
- **THEN** le système affiche la liste de toutes ses commandes avec statuts et montants

#### Scenario: Gestion des adresses de livraison
- **WHEN** un client connecté sauvegarde une adresse de livraison
- **THEN** le système enregistre l'adresse et la propose lors du prochain checkout
