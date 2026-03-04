## ADDED Requirements

### Requirement: Catalogue produits consultable en ligne
Le système SHALL afficher un catalogue de ~200 produits organisé par catégories (Vins, Eaux, Alcools, Spiritueux, Rhums, Champagnes, Cannettes, Jus) avec filtres et recherche.

#### Scenario: Affichage du catalogue
- **WHEN** un client navigue vers la page catalogue
- **THEN** le système affiche les produits en stock avec photo, nom, prix et catégorie

#### Scenario: Filtrage par catégorie
- **WHEN** un client sélectionne une catégorie (ex: Vins)
- **THEN** le système affiche uniquement les produits de cette catégorie

#### Scenario: Recherche par nom
- **WHEN** un client saisit un terme dans la barre de recherche
- **THEN** le système affiche les produits dont le nom ou la description contient le terme

#### Scenario: Produit en rupture de stock
- **WHEN** un produit a un stock égal à 0
- **THEN** le système affiche le produit avec la mention "Rupture de stock" et désactive le bouton d'ajout au panier

### Requirement: Fiche produit détaillée
Le système SHALL afficher une page dédiée pour chaque produit avec toutes les informations.

#### Scenario: Accès à une fiche produit
- **WHEN** un client clique sur un produit
- **THEN** le système affiche la fiche avec : photo(s), nom, description, prix, catégorie, disponibilité, bouton "Ajouter au panier"

#### Scenario: Import catalogue depuis Excel
- **WHEN** l'administrateur exécute le script d'import
- **THEN** le système crée ou met à jour les produits en base à partir des données du fichier Excel
