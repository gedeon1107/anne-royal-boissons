## ADDED Requirements

### Requirement: Affichage du prix haut uniquement
Le système SHALL afficher uniquement le `displayed_price` (prix haut) sur la fiche produit côté client. Le `floor_price` (prix réel) ne SHALL jamais être exposé dans aucune réponse API publique.

#### Scenario: Consultation d'un produit par un client
- **WHEN** un client consulte la fiche d'un produit
- **THEN** le système retourne le `displayed_price` uniquement, sans aucune mention du `floor_price`

#### Scenario: Tentative d'accès au prix plancher via l'API publique
- **WHEN** toute requête est faite sur l'API publique produit
- **THEN** le champ `floor_price` est absent de la réponse

### Requirement: Soumission d'une offre de prix
Le client SHALL pouvoir soumettre une offre de prix pour un produit avant de finaliser son achat.

#### Scenario: Soumission d'une offre valide
- **WHEN** un client soumet une offre de prix `O` pour un produit avec `displayed_price = P_haut` et `floor_price = P_reel`
- **AND** `P_reel ≤ O ≤ P_haut`
- **THEN** le système accepte l'offre et enregistre `O` comme prix négocié pour la ligne de commande

#### Scenario: Soumission d'une offre inférieure au prix plancher
- **WHEN** un client soumet une offre de prix `O` où `O < floor_price`
- **THEN** le système refuse l'offre et retourne un message d'erreur indiquant que l'offre est trop basse

#### Scenario: Soumission d'une offre supérieure au prix affiché
- **WHEN** un client soumet une offre de prix `O` où `O > displayed_price`
- **THEN** le système accepte l'offre (le client paie le prix soumis ou le prix affiché selon la règle métier)

### Requirement: Limitation des tentatives de négociation
Le système SHALL limiter le nombre d'offres de prix soumises par un même client pour un même produit dans une même session à 3 tentatives maximum.

#### Scenario: Dépassement du nombre de tentatives
- **WHEN** un client a soumis 3 offres refusées consécutives pour un même produit dans la même session
- **THEN** le système refuse toute nouvelle offre pour ce produit dans cette session et retourne un message d'erreur approprié

### Requirement: Validation de cohérence des prix
Le système SHALL garantir que `floor_price < displayed_price` pour tout produit. Toute tentative de créer ou modifier un produit avec `floor_price ≥ displayed_price` SHALL être rejetée.

#### Scenario: Saisie incohérente des prix par l'admin
- **WHEN** un administrateur soumet un produit avec `floor_price ≥ displayed_price`
- **THEN** le système refuse la sauvegarde et retourne une erreur de validation explicitant la contrainte
