## ADDED Requirements

### Requirement: Vérification d'âge obligatoire à l'entrée du site
Le système SHALL afficher une page de vérification d'âge (age gate) à chaque nouveau visiteur avant tout accès au contenu du site. L'accès ne sera accordé qu'aux personnes confirmant avoir 18 ans ou plus.

#### Scenario: Visiteur confirme avoir 18 ans ou plus
- **WHEN** un visiteur accède au site pour la première fois et clique sur "J'ai 18 ans ou plus"
- **THEN** le système enregistre l'acceptation en cookie de session et redirige vers la page d'accueil

#### Scenario: Visiteur déclare avoir moins de 18 ans
- **WHEN** un visiteur clique sur "J'ai moins de 18 ans"
- **THEN** le système affiche un message de refus d'accès et ne donne pas accès au site

#### Scenario: Visiteur ayant déjà validé l'age gate
- **WHEN** un visiteur précédemment validé revient sur le site
- **THEN** le système ne réaffiche pas l'age gate et l'accès au site est direct

#### Scenario: Contournement côté serveur
- **WHEN** un visiteur tente d'accéder directement à une URL du catalogue sans cookie d'age gate
- **THEN** le middleware serveur redirige vers la page d'age gate
