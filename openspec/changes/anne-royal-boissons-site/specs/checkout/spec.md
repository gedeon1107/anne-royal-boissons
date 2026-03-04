## ADDED Requirements

### Requirement: Tunnel de commande complet
Le système SHALL guider le client à travers les étapes de commande : informations, mode de livraison, paiement.

#### Scenario: Choix livraison à domicile
- **WHEN** un client choisit "Livraison à domicile" et saisit son adresse
- **THEN** le système calcule et affiche les frais de livraison selon la zone géographique

#### Scenario: Choix retrait en boutique
- **WHEN** un client choisit "Retrait en boutique"
- **THEN** le système affiche les informations de la boutique et applique 0 FCFA de frais de livraison

#### Scenario: Validation de la commande
- **WHEN** un client confirme sa commande après le paiement réussi
- **THEN** le système crée la commande en base, décrémente le stock atomiquement et déclenche les notifications

#### Scenario: Calcul des frais de livraison par zone
- **WHEN** un client saisit une adresse dans une zone couverte
- **THEN** le système affiche le tarif correspondant à la zone (grille Gozem/Yango)

#### Scenario: Zone non couverte
- **WHEN** un client saisit une adresse dans une zone non couverte
- **THEN** le système informe le client que la livraison n'est pas disponible dans cette zone
