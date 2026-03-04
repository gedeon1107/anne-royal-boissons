## ADDED Requirements

### Requirement: Paiement Mobile Money via FedaPay
Le système SHALL permettre le paiement en ligne via MTN Mobile Money, Moov Money et Celtis, en utilisant FedaPay comme passerelle.

#### Scenario: Paiement Mobile Money réussi
- **WHEN** un client initie un paiement et confirme sur son téléphone mobile
- **THEN** FedaPay notifie le système via webhook, la commande est confirmée et le stock est décrémenté

#### Scenario: Paiement échoué ou annulé
- **WHEN** un client abandonne ou le paiement est refusé
- **THEN** le système maintient le panier intact et affiche un message d'erreur avec option de réessayer

#### Scenario: Webhook FedaPay reçu (confirmation paiement)
- **WHEN** FedaPay envoie un webhook `transaction.approved`
- **THEN** le système valide la commande, décrémente le stock et déclenche les notifications

#### Scenario: Timeout de paiement
- **WHEN** le client ne complète pas le paiement dans le délai imparti (15 min)
- **THEN** le système annule la session de paiement et libère les réservations éventuelles
