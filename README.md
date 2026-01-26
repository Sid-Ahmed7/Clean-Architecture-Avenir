# Clean-Architecture-Avenir

## Système d'Authentification

Ce projet implémente un système d'authentification basé sur l'architecture propre (Clean Architecture) pour une application bancaire. Le système permet aux clients de s'inscrire et aux directeurs (managers de banque) de se connecter.

### Fonctionnalités

- **Inscription des Utilisateurs** : Les clients peuvent s'inscrire avec email, mot de passe et informations personnelles
- **Connexion des Utilisateurs** : Les clients et directeurs peuvent se connecter avec email et mot de passe
- **Autorisation Basée sur les Rôles** : Différentes routes sont protégées selon les rôles utilisateurs
- **Authentification JWT** : Utilise des tokens JWT pour une authentification sécurisée
- **Tokens de Rafraîchissement** : Implémente des refresh tokens pour des sessions prolongées

### Architecture

Le système d'authentification suit les principes de l'architecture propre :

- **Couche Domaine** : Contient les entités, objets valeurs et règles métier
- **Couche Application** : Contient les cas d'usage qui orchestrent la logique métier
- **Couche Infrastructure** : Contient les implémentations des repositories, contrôleurs et services externes

### Points de Terminaison API

#### Points de Terminaison Publics

- `POST /api/auth/register` - Inscription d'un nouveau client
- `POST /api/auth/login` - Connexion en tant que client ou directeur
- `POST /api/auth/logout` - Déconnexion et invalidation des tokens
- `GET /api/health` - Point de terminaison de vérification de santé

#### Points de Terminaison Protégés

- `GET /api/client/profile` - Accès au profil client (client uniquement)
- `GET /api/director/dashboard` - Accès au tableau de bord directeur (directeur uniquement)
- `GET /api/management/users` - Accès à la gestion des utilisateurs (directeurs et admins)

### Flux d'Authentification

1. **Inscription** :
   - Le client soumet un formulaire d'inscription avec email, mot de passe et informations personnelles
   - Le système valide les données et crée un nouvel utilisateur avec le rôle CLIENT
   - Le système retourne un message de succès

2. **Connexion** :
   - L'utilisateur soumet son email et mot de passe
   - Le système valide les identifiants et vérifie le statut de l'utilisateur
   - Le système génère un token d'accès et un refresh token
   - Le système retourne les tokens et les informations utilisateur

3. **Accès aux Routes Protégées** :
   - Le client inclut le token d'accès dans l'en-tête Authorization
   - Le système valide le token et vérifie les rôles utilisateur
   - Le système accorde ou refuse l'accès selon les rôles

### Développement

Pour lancer le serveur en mode développement :

```bash
# Naviguez vers le répertoire racine du projet
cd C:\Users\arthu\WebstormProjects\Clean-Architecture-Avenir

# Installez les dépendances au niveau racine (cela installera les dépendances pour tous les workspaces)
npm install

# Naviguez vers le répertoire du serveur
cd infrastructure\server

# Lancez le serveur de développement
npm run dev
```

Si vous rencontrez des problèmes :

1. Assurez-vous d'avoir Node.js installé (version 14 ou supérieure recommandée)
2. Essayez d'installer les dépendances directement dans le répertoire du serveur :
   ```bash
   cd infrastructure\server
   npm install
   npm run dev
   ```
3. Ce projet utilise Express 5.1.0 (beta) avec le typage TypeScript approprié :
   ```bash
   cd infrastructure\server
   npm install express@5.1.0 @types/express@5.0.3 --save
   ```
4. Vérifiez les messages d'erreur dans la console et résolvez-les en conséquence

### Corrections Récentes

Les améliorations suivantes ont été apportées dans la dernière mise à jour :

1. Ajout du typage TypeScript approprié à tous les gestionnaires de routes Express pour garantir la sécurité des types avec Express 5.1.0 (beta)
2. Mise à jour du package @types/express vers la version 5.0.3 pour correspondre à Express 5.1.0
3. Correction du fichier index.ts vide dans le répertoire du serveur pour exporter correctement depuis src/index.ts
4. Assurance que tous les objets request et response sont correctement typés dans le code
5. Activation de 'esModuleInterop' dans tsconfig.json pour résoudre les problèmes d'import avec les modules CommonJS

Ces changements devraient résoudre les problèmes d'exécution du projet tout en maintenant des pratiques de code propre et un typage TypeScript approprié.

## Configuration des Variables d'Environnement

**Important** : Vous devez créer des fichiers `.env` dans **trois emplacements** pour le serveur backend :
1. `infrastructure/server/.env` (configuration racine du serveur)
2. `infrastructure/server/frameworks/express/.env` (pour Express)
3. `infrastructure/server/frameworks/adonisjs/.env` (pour AdonisJS)

### Serveur Backend - Configuration Racine

Créez un fichier `.env` dans le répertoire `infrastructure/server/` avec les variables suivantes :

```env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
APP_NAME=Clean-Architecture-Avenir
APP_KEY=VotreCleAppKey
LOG_LEVEL=info

# URL de base du client (pour les redirections et liens)
CLIENT_BASE_URL=http://localhost:3001

# Secrets JWT pour l'authentification
JWT_SECRET=VotreSecretJWT
JWT_SECRET_REFRESH=VotreSecretRefreshJWT

# Durée d'expiration des tokens (en secondes)
JWT_EXPIRATION=3600
JWT_EXPIRATION_REFRESH=604800

# Clé API Resend pour l'envoi d'emails
RESEND_API_KEY=VotreCleAPIResend
EMAIL_FROM=no-reply@contact-avenir.com

# Type de repository (postgres, inmemory)
REPOSITORY_TYPE=postgres

# Configuration de la base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=VotreMotDePasse
DB_NAME=Avenir

# Mot de passe pour la création de managers
MANAGER_CREATION_PASSWORD=VotreMotDePasseAdmin
```

**Explications :**

- `NODE_ENV` : Environnement d'exécution (development, production)
- `PORT` : Port sur lequel le serveur backend écoute (par défaut 3000)
- `HOST` : Adresse d'écoute du serveur (0.0.0.0 pour écouter sur toutes les interfaces)
- `APP_NAME` : Nom de l'application
- `APP_KEY` : Clé secrète pour l'application (générez une chaîne aléatoire)
- `LOG_LEVEL` : Niveau de logging (info, debug, error, etc.)
- `CLIENT_BASE_URL` : URL de base du client frontend (utilisée pour les redirections et liens dans les emails)
- `JWT_SECRET` : Secret pour signer les tokens d'accès (générez une chaîne aléatoire sécurisée)
- `JWT_SECRET_REFRESH` : Secret pour signer les refresh tokens (différent du JWT_SECRET)
- `JWT_EXPIRATION` : Durée de validité du token d'accès en secondes 
- `JWT_EXPIRATION_REFRESH` : Durée de validité du refresh token en secondes 
- `RESEND_API_KEY` : Clé API Resend pour l'envoi d'emails (**obligatoire** - contactez-moi pour obtenir la clé ou créez votre propre compte sur resend.com)
- `EMAIL_FROM` : Adresse email d'expéditeur pour les emails (vous pouvez utiliser `no-reply@contact-avenir.com` avec ma clé API ou configurer votre propre domaine sur Resend)
- `REPOSITORY_TYPE` : Type de stockage des données (postgres ou inmemory)
- `DB_HOST` : Adresse du serveur PostgreSQL (localhost pour développement local)
- `DB_PORT` : Port PostgreSQL (5432 par défaut)
- `DB_USER` : Nom d'utilisateur PostgreSQL
- `DB_PASSWORD` : Mot de passe de l'utilisateur PostgreSQL
- `DB_NAME` : Nom de la base de données (créez-la avec `CREATE DATABASE Avenir;`)
- `MANAGER_CREATION_PASSWORD` : Mot de passe requis pour créer des comptes managers

### Serveur Backend - Express

Créez un fichier `.env` dans le répertoire `infrastructure/server/frameworks/express/` avec les **mêmes variables** que ci-dessus.

### Serveur Backend - AdonisJS

Créez un fichier `.env` dans le répertoire `infrastructure/server/frameworks/adonisjs/` avec les **mêmes variables** que ci-dessus.

### Client Frontend

Créez un fichier `.env` dans le répertoire `infrastructure/client/src/` avec les variables suivantes :

**Note** : Pour Next.js, vous pouvez aussi créer un fichier `.env.local` à la racine de `infrastructure/client/` qui aura la priorité sur `.env`.

```env
# URL de l'API backend (exposée au navigateur)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# URL du serveur WebSocket (exposée au navigateur)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# URL de l'API backend (côté serveur uniquement)
API_URL=http://localhost:3000/api

# URL du serveur backend (exposée au navigateur)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Clé API Twelve Data pour les données boursières
TWELVE_DATA_API_KEY=VotreCleAPITwelveData

# URL de l'API Twelve Data
TWELVE_DATA_API_URL=https://api.twelvedata.com

# URL de base du client (exposée au navigateur)
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Configuration Resend Email
RESEND_API_KEY=VotreCleAPIResend
EMAIL_FROM=no-reply@contact-avenir.com
```

**Explications :**

- `NEXT_PUBLIC_API_URL` : URL complète de l'API backend accessible depuis le navigateur (doit correspondre à `http://localhost:PORT/api`)
- `NEXT_PUBLIC_SOCKET_URL` : URL du serveur WebSocket pour les communications en temps réel (chat, notifications)
- `API_URL` : URL de l'API utilisée côté serveur Next.js (Server Components, API Routes)
- `NEXT_PUBLIC_SERVER_URL` : URL du serveur backend accessible depuis le navigateur
- `TWELVE_DATA_API_KEY` : Clé API Twelve Data pour récupérer les données boursières en temps réel (obtenez-la sur twelvedata.com)
- `TWELVE_DATA_API_URL` : URL de base de l'API Twelve Data
- `NEXT_PUBLIC_BASE_URL` : URL de base de l'application frontend (utilisée pour les redirections et liens absolus)
- `RESEND_API_KEY` : Clé API Resend pour l'envoi d'emails depuis le client (**obligatoire** - doit être la même que celle du serveur)
- `EMAIL_FROM` : Adresse email d'expéditeur (vous pouvez utiliser `no-reply@contact-avenir.com` avec ma clé API ou configurer votre propre domaine, doit être la même que celle du serveur)

**Note importante :** Les variables préfixées par `NEXT_PUBLIC_` sont exposées au navigateur.

### Génération de Secrets JWT

Pour générer des secrets JWT sécurisés, vous pouvez utiliser :

```bash
# Sous Linux/Mac
openssl rand -hex 32

# Sous Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Ou en Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎯 Fixtures de Données de Test

Le projet inclut des scripts de fixtures pour charger des données de test réalistes dans le système de messagerie. Deux versions sont disponibles selon votre type de repository.

### Fixtures PostgreSQL

Pour charger des fixtures dans PostgreSQL :

```bash
cd infrastructure/server

# 1. Réinitialiser la base de données (supprime toutes les données)
npm run db:reset

# 2. Exécuter les migrations
npm run migrate

# 3. Charger les fixtures de messagerie
npm run fixtures:messaging
```

**Données créées :**
- 5 utilisateurs de test (2 clients, 2 conseillers, 1 manager)
- 3 conversations individuelles avec 12 messages
- 2 conversations de groupe avec 5 participants et 7 messages
- Mots de passe chiffrés avec bcrypt : `Password123!`

### Fixtures In-Memory

Les fixtures in-memory sont **automatiquement chargées au démarrage du serveur** lorsque `REPOSITORY_TYPE=inmemory`.

#### Chargement Automatique (Recommandé)

Lorsque vous démarrez le serveur avec `REPOSITORY_TYPE=inmemory`, les fixtures sont automatiquement chargées :

```bash
cd infrastructure/server

# 1. Basculer vers in-memory
npm run switch:inmemory

# 2. Démarrer le serveur (les fixtures se chargent automatiquement)
npm run dev
```

**Sortie attendue au démarrage :**
```
Using inmemory repository - loading fixtures...
🚀 Starting to load in-memory messaging fixtures...
👥 Creating test users...
  ✓ Created user: Marie Dupont (CLIENT)
  ✓ Created user: Pierre Martin (CLIENT)
  ✓ Created user: Sophie Bernard (BANK_ADVISOR)
  ✓ Created user: Lucas Petit (BANK_ADVISOR)
  ✓ Created user: Jean Dubois (BANK_MANAGER)
✅ Test users created
💬 Creating individual conversations...
📨 Creating messages...
👥 Creating group conversations...
✅ In-memory fixtures loaded successfully.
Server started on port 3000
```

#### Chargement Manuel (Optionnel)

Vous pouvez aussi charger les fixtures manuellement (uniquement si le serveur n'est **pas** en cours d'exécution) :

```bash
cd infrastructure/server
npm run fixtures:messaging:inmemory
```

**⚠️ Important :** 
- Les données in-memory sont **volatiles** et rechargées à chaque redémarrage du serveur
- Les fixtures se chargent automatiquement dans les **instances singleton** des repositories utilisées par le serveur
- Toute modification des données pendant l'exécution sera perdue au prochain redémarrage

### Identifiants de Test

Tous les utilisateurs utilisent le mot de passe : **`Password123!`**

| Email | Nom | Rôle |
|---|---|---|
| client1@test.com | Marie Dupont | CLIENT |
| client2@test.com | Pierre Martin | CLIENT |
| advisor1@test.com | Sophie Bernard | BANK_ADVISOR |
| advisor2@test.com | Lucas Petit | BANK_ADVISOR |
| manager1@test.com | Jean Dubois | BANK_MANAGER |

### Basculer entre PostgreSQL et In-Memory

```bash
# Utiliser PostgreSQL
npm run switch:postgres
npm run migrate
npm run fixtures:messaging

# Utiliser In-Memory (fixtures chargées automatiquement au démarrage)
npm run switch:inmemory
npm run dev  # Les fixtures se chargent automatiquement
```



## Documentation des Routes API

Cette section documente toutes les routes API disponibles dans l'application, organisées par catégorie avec leurs méthodes HTTP et les rôles requis pour y accéder.

### Légende des Rôles

- 🔓 **Public** : Accessible sans authentification
- 👤 **CLIENT** : Accessible aux clients
- 👔 **BANK_ADVISOR** : Accessible aux conseillers bancaires
- 🏦 **BANK_MANAGER** : Accessible aux directeurs de banque
- 🔐 **Authentifié** : Accessible à tous les utilisateurs authentifiés

---

### 🔐 Authentification (`/api/auth`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/register` | 🔓 Public | Inscription d'un nouveau client |
| GET | `/confirm` | 🔓 Public | Confirmation de l'inscription par email |
| POST | `/login` | 🔓 Public | Connexion (client, conseiller, directeur) |
| POST | `/refresh-token` | 🔓 Public | Rafraîchissement du token d'accès |
| GET | `/profile` | 👤 CLIENT, 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Récupération du profil utilisateur |
| POST | `/logout` | 👤 CLIENT, 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Déconnexion |
| GET | `/getAdvisors` | 👤 CLIENT, 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Liste des conseillers disponibles |
| POST | `/create-advisor` | 🏦 BANK_MANAGER | Création d'un compte conseiller |
| POST | `/create-manager` | 🔓 Public | Création d'un compte directeur |
| POST | `/create-client` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Création d'un compte client |

---

### 👥 Gestion des Utilisateurs (`/api/user-management`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/` | 🏦 BANK_MANAGER | Liste de tous les utilisateurs |
| GET | `/clients` | 🏦 BANK_MANAGER | Liste des clients |
| GET | `/advisors` | 🏦 BANK_MANAGER | Liste des conseillers |
| PUT | `/:id` | 🏦 BANK_MANAGER | Mise à jour d'un utilisateur |
| DELETE | `/:id` | 🏦 BANK_MANAGER | Suppression d'un utilisateur |
| PUT | `/:id/ban` | 🏦 BANK_MANAGER | Bannir un utilisateur |
| PUT | `/:id/unban` | 🏦 BANK_MANAGER | Débannir un utilisateur |

---

### 💳 Comptes Bancaires (`/api/account`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/my-accounts` | 👤 CLIENT, 🏦 BANK_MANAGER | Récupération des comptes de l'utilisateur |
| POST | `/create` | 👤 CLIENT, 🏦 BANK_MANAGER | Création d'un nouveau compte |
| POST | `/create/sub` | 👤 CLIENT, 🏦 BANK_MANAGER | Création d'un sous-compte |
| PUT | `/update` | 🏦 BANK_MANAGER | Mise à jour d'un compte |
| GET | `/` | 🏦 BANK_MANAGER | Liste de tous les comptes |
| GET | `/:accountNumber` | 👤 CLIENT, 🏦 BANK_MANAGER | Détails d'un compte spécifique |
| DELETE | `/:accountNumber` | 🏦 BANK_MANAGER | Suppression d'un compte |
| GET | `/iban/:iban` | 👤 CLIENT, 🏦 BANK_MANAGER | Recherche de compte par IBAN |
| GET | `/:accountNumber/rib` | 👤 CLIENT, 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Téléchargement du RIB |
| PUT | `/:accountNumber/status` | 🏦 BANK_MANAGER | Changement du statut du compte |
| PUT | `/:accountNumber/name` | 👤 CLIENT, 🏦 BANK_MANAGER | Modification du nom du compte |
| PUT | `/:accountNumber/withdrawal-limit` | 🏦 BANK_MANAGER | Modification de la limite de retrait |
| PUT | `/:accountNumber/transfer-limit` | 👤 CLIENT, 🏦 BANK_MANAGER | Modification de la limite de virement |
| PUT | `/:accountNumber/overdraft-limit` | 🏦 BANK_MANAGER | Modification de la limite de découvert |
| PUT | `/:accountNumber/active` | 🏦 BANK_MANAGER | Activation/désactivation du compte |
| POST | `/transfer` | 👤 CLIENT, 🏦 BANK_MANAGER | Virement entre comptes |
| POST | `/quick-transfer` | 👤 CLIENT, 🏦 BANK_MANAGER | Virement rapide |
| GET | `/transactions/history` | 👤 CLIENT, 🏦 BANK_MANAGER | Historique des transactions |
| GET | `/transactions/last` | 👤 CLIENT, 🏦 BANK_MANAGER | Dernières transactions |

#### Demandes de Découvert

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/:accountNumber/overdraft-limit/request` | 👤 CLIENT, 🏦 BANK_MANAGER | Demande d'augmentation de découvert |
| GET | `/overdraft-requests` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Liste des demandes en attente |
| PUT | `/overdraft-requests/:requestId/response` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Réponse à une demande |
| GET | `/overdraft-requests/:requestId/details` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Détails d'une demande |

---

### 💰 Comptes d'Épargne (`/api/savings-account`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/` | 👤 CLIENT, 🏦 BANK_MANAGER | Liste des comptes d'épargne |
| POST | `/` | 🏦 BANK_MANAGER | Création d'un compte d'épargne |
| GET | `/:accountNumber` | 👤 CLIENT, 🏦 BANK_MANAGER | Détails d'un compte d'épargne |
| PUT | `/:accountNumber` | 🏦 BANK_MANAGER | Mise à jour de la configuration |
| PUT | `/:accountNumber/interest-rate` | 🏦 BANK_MANAGER | Modification du taux d'intérêt |
| PUT | `/:accountNumber/max-deposit` | 🏦 BANK_MANAGER | Modification du dépôt maximum |
| POST | `/calculate-interest` | 🏦 BANK_MANAGER | Calcul des intérêts journaliers |
| GET | `/:accountNumber/interest-summary` | 👤 CLIENT, 🏦 BANK_MANAGER | Résumé des intérêts |
| POST | `/:accountNumber/deposit` | 👤 CLIENT | Dépôt sur le compte d'épargne |
| POST | `/:accountNumber/withdraw` | 👤 CLIENT | Retrait du compte d'épargne |
| DELETE | `/:accountNumber` | 🏦 BANK_MANAGER | Suppression du compte d'épargne |

---

### 📦 Produits d'Épargne (`/api/savings-product`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/` | 🔓 Public | Liste de tous les produits d'épargne |
| POST | `/` | 🏦 BANK_MANAGER | Création d'un produit d'épargne |
| PUT | `/:productId` | 🏦 BANK_MANAGER | Mise à jour d'un produit |
| POST | `/subscribe` | 👤 CLIENT | Souscription à un produit |

---

### 💸 Prêts (`/api/loan`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/request` | 👤 CLIENT | Création d'une demande de prêt |
| GET | `/client/requests` | 👤 CLIENT | Demandes de prêt du client |
| GET | `/client/repayments` | 👤 CLIENT | Échéanciers de remboursement du client |
| POST | `/client/requests/:id/respond` | 👤 CLIENT | Réponse à une proposition de taux |
| GET | `/advisor/requests` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Demandes pour le conseiller |
| POST | `/advisor/requests/:id/decision` | 👔 BANK_ADVISOR | Décision du conseiller |
| GET | `/director/requests` | 🏦 BANK_MANAGER | Demandes pour le directeur |
| POST | `/director/requests/:id/decision` | 🏦 BANK_MANAGER | Décision du directeur |
| POST | `/director/requests/:id/propose-rate` | 🏦 BANK_MANAGER | Proposition de taux |
| POST | `/director/rate` | 🏦 BANK_MANAGER | Définition du taux indicatif |
| GET | `/rate` | 🔐 Authentifié | Récupération du taux indicatif |
| GET | `/client/:id/requests` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Historique des demandes d'un client |
| GET | `/client/:id/repayments` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Remboursements d'un client |
| GET | `/client/:id/info` | 👔 BANK_ADVISOR, 🏦 BANK_MANAGER | Informations d'un client |

---

### 👥 Bénéficiaires (`/api/beneficiary`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/` | 👤 CLIENT, 🏦 BANK_MANAGER | Création d'un bénéficiaire |
| GET | `/` | 👤 CLIENT, 🏦 BANK_MANAGER | Liste des bénéficiaires |
| PUT | `/:beneficiaryId` | 👤 CLIENT, 🏦 BANK_MANAGER | Mise à jour d'un bénéficiaire |
| DELETE | `/:beneficiaryId` | 👤 CLIENT, 🏦 BANK_MANAGER | Suppression d'un bénéficiaire |
| POST | `/transfer` | 👤 CLIENT, 🏦 BANK_MANAGER | Virement vers un bénéficiaire |

---

### 📈 Actions Boursières (`/api/stock`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/create` | 🏦 BANK_MANAGER | Création d'une action |
| GET | `/` | 🔐 Authentifié | Liste de toutes les actions |
| GET | `/available` | 🔐 Authentifié | Actions disponibles |
| GET | `/symbol/:symbol` | 🔐 Authentifié | Action par symbole |
| GET | `/:id` | 🔐 Authentifié | Action par ID |
| PUT | `/update` | 🏦 BANK_MANAGER | Mise à jour d'une action |
| DELETE | `/:id` | 🏦 BANK_MANAGER | Suppression d'une action |
| PATCH | `/:id/availability` | 🏦 BANK_MANAGER | Modification de la disponibilité |
| POST | `/:symbol/update-price` | 🏦 BANK_MANAGER | Mise à jour du prix |
| POST | `/ipo/purchase` | 🔐 Authentifié | Achat d'actions IPO |
| POST | `/:symbol/ipo/close` | 🏦 BANK_MANAGER | Clôture d'une IPO |
| POST | `/:symbol/ipo/open` | 🏦 BANK_MANAGER | Ouverture d'une IPO |

---

### 📊 Ordres Boursiers (`/api/stock-order`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/create` | 🔐 Authentifié | Placement d'un ordre |
| GET | `/` | 🔐 Authentifié | Ordres de l'utilisateur |
| GET | `/all` | 🏦 BANK_MANAGER | Tous les ordres |
| GET | `/book/:symbol` | 🔐 Authentifié | Carnet d'ordres par symbole |
| POST | `/match/:symbol` | 🔐 Authentifié | Appariement des ordres |
| PATCH | `/:id/cancel` | 🔐 Authentifié | Annulation d'un ordre |

---

### 🔔 Notifications (`/api/notification`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/subscribe` | 🔐 Authentifié | Souscription aux notifications SSE |
| POST | `/create` | 🔐 Authentifié | Création d'une notification |
| POST | `/send-notification` | 👔 BANK_ADVISOR | Envoi d'une notification à un client |
| GET | `/` | 🔐 Authentifié | Notifications de l'utilisateur |
| PUT | `/read` | 🔐 Authentifié | Marquer comme lue |
| DELETE | `/:id` | 🔐 Authentifié | Suppression d'une notification |

---

### 📰 Actualités (`/api/news`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/stream` | 🔐 Authentifié | Flux SSE des actualités |
| POST | `/create` | 👔 BANK_ADVISOR | Création d'une actualité |
| GET | `/` | 🔐 Authentifié | Liste des actualités |
| GET | `/:id` | 🔐 Authentifié | Détails d'une actualité |
| PUT | `/update` | 👔 BANK_ADVISOR | Mise à jour d'une actualité |
| DELETE | `/delete/:id` | 👔 BANK_ADVISOR | Suppression d'une actualité |

---

### 💬 Chat (`/api/chat`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| POST | `/conversation/create` | 👤 CLIENT | Création d'une conversation |
| GET | `/conversations` | 👔 BANK_ADVISOR | Conversations en attente |
| GET | `/conversations/assigned` | 👔 BANK_ADVISOR | Conversations assignées au conseiller |
| GET | `/conversations/client` | 👤 CLIENT | Conversations du client |
| GET | `/:conversationId/messages` | 👤 CLIENT, 👔 BANK_ADVISOR | Messages d'une conversation |
| POST | `/send` | 👤 CLIENT, 👔 BANK_ADVISOR | Envoi d'un message |
| POST | `/mark-read` | 👔 BANK_ADVISOR | Marquer comme lu |
| POST | `/transfer` | 👔 BANK_ADVISOR | Transfert de conversation |

---

### 👨‍💼 Gestion des Utilisateurs (`/api/user-management`)

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/` | 🏦 BANK_MANAGER | Liste de tous les utilisateurs |
| GET | `/clients` | 🏦 BANK_MANAGER | Liste des clients |
| GET | `/advisors` | 🏦 BANK_MANAGER | Liste des conseillers |
| PUT | `/:id` | 🏦 BANK_MANAGER | Mise à jour d'un utilisateur |
| DELETE | `/:id` | 🏦 BANK_MANAGER | Suppression d'un utilisateur |

---

### 🤖 SEO & Indexation

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/sitemap.xml` | 🔓 Public | Plan du site pour les moteurs de recherche |
| GET | `/robots.txt` | 🔓 Public | Instructions pour les robots d'indexation |

**Sitemap** : Génère automatiquement un sitemap XML avec toutes les pages publiques de l'application (accueil, pages légales, etc.)

**Robots.txt** : Configure les règles d'exploration pour les moteurs de recherche (Google, Bing, etc.)

---

### Technologies Used

- TypeScript
- Express.js
- JWT (JSON Web Tokens)
- Clean Architecture

---

## 📝 Copyright & Auteurs

© 2026 Clean-Architecture-Avenir. Tous droits réservés.

**Développé par :**
- Arthur BROUARD
- Sofiane Chadili
- Sid-Ahmed Moussi