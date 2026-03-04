## ADDED Requirements

### Requirement: Authentification back-office sécurisée
Le système SHALL permettre uniquement aux utilisateurs autorisés d'accéder au back-office via authentification par email et mot de passe.

#### Scenario: Connexion réussie
- **WHEN** un employé saisit des identifiants valides sur la page de connexion admin
- **THEN** le système crée une session sécurisée et redirige vers le dashboard

#### Scenario: Connexion avec mauvais identifiants
- **WHEN** un utilisateur saisit un email ou mot de passe incorrect
- **THEN** le système affiche un message d'erreur générique sans révéler si c'est l'email ou le mot de passe

#### Scenario: Accès non autorisé au back-office
- **WHEN** un utilisateur non connecté tente d'accéder à une URL /admin
- **THEN** le middleware redirige vers la page de connexion admin

#### Scenario: Déconnexion
- **WHEN** un employé clique sur "Se déconnecter"
- **THEN** le système invalide la session et redirige vers la page de connexion

### Requirement: Gestion des employés (back-office admin uniquement)
Le système SHALL permettre à l'administrateur de créer et gérer les comptes employés.

#### Scenario: Création d'un compte employé
- **WHEN** l'admin crée un compte employé avec email et mot de passe temporaire
- **THEN** le système enregistre le compte avec le rôle EMPLOYEE

#### Scenario: Désactivation d'un compte employé
- **WHEN** l'admin désactive un compte employé
- **THEN** le système empêche immédiatement l'accès au back-office pour cet employé

#### Scenario: Accès limité aux paramètres admin
- **WHEN** un employé (non admin) accède au back-office
- **THEN** le système masque la section "Employés" accessible uniquement à l'admin
