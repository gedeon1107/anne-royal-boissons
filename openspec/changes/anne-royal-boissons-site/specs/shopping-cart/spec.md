## ADDED Requirements

### Requirement: Panier d'achat persistant
Le système SHALL permettre aux clients d'ajouter des produits à un panier persistant entre les sessions.

#### Scenario: Ajout d'un produit au panier
- **WHEN** un client clique sur "Ajouter au panier" sur un produit en stock
- **THEN** le système ajoute le produit au panier et affiche le nombre d'articles dans l'icône panier

#### Scenario: Modification de la quantité
- **WHEN** un client modifie la quantité d'un article dans le panier
- **THEN** le système met à jour la quantité et recalcule le total

#### Scenario: Suppression d'un article
- **WHEN** un client supprime un article du panier
- **THEN** le système retire l'article et met à jour le total

#### Scenario: Panier persistant entre sessions
- **WHEN** un client ferme le navigateur et revient sur le site
- **THEN** le système restaure le contenu du panier précédent

#### Scenario: Article en rupture de stock dans le panier
- **WHEN** un article du panier devient en rupture de stock entre deux sessions
- **THEN** le système affiche un avertissement et désactive la commande tant que l'article est en rupture
