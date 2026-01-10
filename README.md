# Clean-Architecture-Avenir

## Authentication System

This project implements a clean architecture-based authentication system for a banking application. The system allows clients to register and directors (bank managers) to login.

### Features

- **User Registration**: Clients can register with email, password, and personal information
- **User Login**: Both clients and directors can login with email and password
- **Role-Based Authorization**: Different routes are protected based on user roles
- **JWT Authentication**: Uses JWT tokens for secure authentication
- **Refresh Tokens**: Implements refresh tokens for extended sessions

### Architecture

The authentication system follows clean architecture principles:

- **Domain Layer**: Contains entities, value objects, and business rules
- **Application Layer**: Contains use cases that orchestrate the business logic
- **Infrastructure Layer**: Contains implementations of repositories, controllers, and external services

### API Endpoints

#### Public Endpoints

- `POST /api/auth/register` - Register a new client
- `POST /api/auth/login` - Login as a client or director
- `POST /api/auth/logout` - Logout and invalidate tokens
- `GET /api/health` - Health check endpoint

#### Protected Endpoints

- `GET /api/client/profile` - Access client profile (client only)
- `GET /api/director/dashboard` - Access director dashboard (director only)
- `GET /api/management/users` - Access user management (directors and admins)

### Authentication Flow

1. **Registration**:
   - Client submits registration form with email, password, and personal information
   - System validates the input and creates a new user with CLIENT role
   - System returns a success message

2. **Login**:
   - User submits email and password
   - System validates credentials and checks user status
   - System generates access token and refresh token
   - System returns tokens and user information

3. **Accessing Protected Routes**:
   - Client includes access token in Authorization header
   - System validates token and checks user roles
   - System grants or denies access based on roles

### Development

To run the server in development mode:

```bash
# Navigate to the project root directory
cd C:\Users\arthu\WebstormProjects\Clean-Architecture-Avenir

# Install dependencies at the root level (this will install dependencies for all workspaces)
npm install

# Navigate to the server directory
cd infrastructure\server

# Run the development server
npm run dev
```

If you encounter any issues:

1. Make sure you have Node.js installed (version 14 or higher recommended)
2. Try installing dependencies directly in the server directory:
   ```bash
   cd infrastructure\server
   npm install
   npm run dev
   ```
3. This project uses Express 5.1.0 (beta) with proper TypeScript typing:
   ```bash
   cd infrastructure\server
   npm install express@5.1.0 @types/express@5.0.3 --save
   ```
4. Check for any error messages in the console and resolve them accordingly

### Recent Fixes

The following improvements have been made in the latest update:

1. Added proper TypeScript typing to all Express route handlers to ensure type safety with Express 5.1.0 (beta)
2. Updated the corresponding @types/express package to version 5.0.3 to match Express 5.1.0
3. Fixed the empty index.ts file in the server directory to properly export from src/index.ts
4. Ensured all request and response objects are properly typed in the codebase
5. Enabled 'esModuleInterop' in tsconfig.json to resolve import issues with CommonJS modules

These changes should resolve the issues with running the project while maintaining clean code practices and proper TypeScript typing.

## Configuration des Variables d'Environnement

### Serveur Backend (.env)

Créez un fichier `.env` dans le répertoire `infrastructure/server/frameworks/express/` avec les variables suivantes :

```env
# Port du serveur
PORT=3000

# Configuration de la base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=VotreMotDePasse
DB_NAME=Avenir

# URL de base de l'application
BASE_URL=http://localhost:3001/

# Secrets JWT pour l'authentification
JWT_SECRET=VotreSecretJWT
JWT_SECRET_REFRESH=VotreSecretRefreshJWT

# Durée d'expiration des tokens (en secondes)
JWT_EXPIRATION=3600
JWT_EXPIRATION_REFRESH=3600

# Clé API Resend pour l'envoi d'emails
RESEND_API_KEY=VotreCleAPIResend

# Mot de passe pour la création de managers
MANAGER_CREATION_PASSWORD=VotreMotDePasseAdmin

# Type de repository (postgres, memory, etc.)
REPOSITORY_TYPE=postgres
```

**Explications :**

- `PORT` : Port sur lequel le serveur backend écoute (par défaut 3000)
- `DB_HOST` : Adresse du serveur PostgreSQL (localhost pour développement local)
- `DB_PORT` : Port PostgreSQL (5432 par défaut)
- `DB_USER` : Nom d'utilisateur PostgreSQL
- `DB_PASSWORD` : Mot de passe de l'utilisateur PostgreSQL
- `DB_NAME` : Nom de la base de données (créez-la avec `CREATE DATABASE Avenir;`)
- `BASE_URL` : URL de base de l'application (utilisée pour les liens dans les emails)
- `JWT_SECRET` : Secret pour signer les tokens d'accès (générez une chaîne aléatoire sécurisée)
- `JWT_SECRET_REFRESH` : Secret pour signer les refresh tokens (différent du JWT_SECRET)
- `JWT_EXPIRATION` : Durée de validité du token d'accès en secondes (3600 = 1 heure)
- `JWT_EXPIRATION_REFRESH` : Durée de validité du refresh token en secondes
- `RESEND_API_KEY` : Clé API Resend pour l'envoi d'emails (obtenez-la sur resend.com)
- `MANAGER_CREATION_PASSWORD` : Mot de passe requis pour créer des comptes managers
- `REPOSITORY_TYPE` : Type de stockage des données (utilisez 'postgres' pour PostgreSQL)

### Client Frontend (.env)

Créez un fichier `.env.local` dans le répertoire `infrastructure/client/` avec les variables suivantes :

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
```

**Explications :**

- `NEXT_PUBLIC_API_URL` : URL complète de l'API backend accessible depuis le navigateur (doit correspondre à `http://localhost:PORT/api`)
- `NEXT_PUBLIC_SOCKET_URL` : URL du serveur WebSocket pour les communications en temps réel (chat, notifications)
- `API_URL` : URL de l'API utilisée côté serveur Next.js (Server Components, API Routes)
- `NEXT_PUBLIC_SERVER_URL` : URL du serveur backend accessible depuis le navigateur
- `TWELVE_DATA_API_KEY` : Clé API Twelve Data pour récupérer les données boursières en temps réel (obtenez-la sur twelvedata.com)
- `TWELVE_DATA_API_URL` : URL de base de l'API Twelve Data
- `NEXT_PUBLIC_BASE_URL` : URL de base de l'application frontend (utilisée pour les redirections et liens absolus)

**Note importante :** Les variables préfixées par `NEXT_PUBLIC_` sont exposées au navigateur. Ne mettez jamais de secrets sensibles dans ces variables.

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

### Technologies Used

- TypeScript
- Express.js
- JWT (JSON Web Tokens)
- Clean Architecture
