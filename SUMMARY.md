# 🏦 Projet AVENIR : Plateforme Bancaire Web

Le projet AVENIR vise à développer une **application Web bancaire moderne** en **TypeScript** (Backend et Frontend) pour concurrencer les banques traditionnelles.

L'objectif est de fournir une plateforme complète permettant aux clients de gérer leurs **liquidités, épargne et investissements**, tout en offrant des outils de gestion avancés pour le personnel administratif.

---

## 🎯 Fonctionnalités Clés par Rôle

### 👤 Client

* **Authentification & Inscription :** Inscription sécurisée avec confirmation par lien email. Création automatique du compte.
* **Comptes Multiples :** Possibilité de créer autant de comptes que souhaité. Chaque compte reçoit un **IBAN unique et mathématiquement valide**.
* **Opérations Courantes :** Transferts d'argent entre les comptes du client au sein de la banque.
* **Épargne :** Ouverture d'un compte d'épargne rémunéré **quotidiennement** au taux fixé par l'administrateur.
* **Investissement :** Enregistrement d'ordres d'achat/vente d'actions. Le cours est basé sur le carnet d'ordres. **Frais fixes de 1€** par transaction (achat ou vente). Les clients sont propriétaires de leurs actions.

### 👑 Directeur de Banque

* **Gestion des Comptes Clients :** Création, modification, suppression ou bannissement des comptes clients.
* **Fixation du Taux d'Épargne :** Modification du taux d'intérêt, entraînant une **notification immédiate** aux clients concernés.
* **Gestion des Actions :** Définition des actions disponibles à l'investissement (création, modification, suppression).

### 🧑‍💼 Conseiller de Banque

* **Crédit :** Octroi de crédits utilisant la **méthode de mensualité constante** (incluant intérêts et assurance obligatoire).
* **Messagerie Instantanée :** Gestion des discussions clients. Les discussions sont attribuées au premier répondant mais peuvent être transférées.

---

## ⚙️ Contraintes Techniques et Architecture

### 🧱 Clean Architecture (Architecture Hexagonale)
Séparation stricte des couches pour garantir l'indépendance des frameworks et la maintenabilité :
1.  **Domain** (Logique métier pure)
2.  **Application** (Use Cases)
3.  **Interface** (API / UI)
4.  **Infrastructure** (DB, Frameworks)

### 💻 Stack Technique
| Composant | Langage | Frameworks Proposés | Adaptateurs DB Proposés |
| :--- | :--- | :--- | :--- |
| **Backend** | TypeScript | Nest.js, Fastify | PostgreSQL (SQL), MongoDB (NoSQL) |
| **Frontend** | TypeScript | Angular, React, Solid.js | N/A |

> 🔑 **Clean Code :** Respect des principes de Clean Code et des pratiques documentées (e.g., Bob Martin) pour une qualité de code optimale.