## ADDED Requirements

### Requirement: Notifications SMS et email automatiques
Le système SHALL envoyer des notifications SMS (Africa's Talking) et email (Resend) au client à chaque changement de statut de sa commande.

#### Scenario: Notification confirmation de commande
- **WHEN** une commande est confirmée après paiement réussi
- **THEN** le système envoie un SMS et un email au client avec le numéro de commande et le récapitulatif

#### Scenario: Notification commande en préparation
- **WHEN** l'admin passe une commande au statut "En préparation"
- **THEN** le système envoie un SMS au client l'informant que sa commande est en cours de préparation

#### Scenario: Notification commande en livraison
- **WHEN** l'admin passe une commande au statut "En livraison" et assigne un livreur
- **THEN** le système envoie un SMS au client et un SMS au livreur avec les détails de la livraison

#### Scenario: Notification commande livrée
- **WHEN** l'admin marque une commande comme "Livrée"
- **THEN** le système envoie un SMS et un email de confirmation de livraison au client

#### Scenario: Échec d'envoi de notification
- **WHEN** l'envoi SMS ou email échoue (erreur API)
- **THEN** le système logue l'erreur sans bloquer le flux de commande, et peut réessayer automatiquement
