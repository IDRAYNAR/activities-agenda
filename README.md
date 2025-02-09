# Activities Agenda 📅

Une application web moderne de gestion d'activités et de réservations développée avec Next.js 15.

## 🚀 Fonctionnalités

- Authentification des utilisateurs
- Gestion des activités (création, modification, suppression)
- Système de réservation
- Interface d'administration
- Carte interactive pour localiser les activités
- Interface responsive et moderne
- Tableau de bord avec statistiques

## 🛠️ Technologies Utilisées

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: API Routes Next.js, Prisma
- **Base de données**: PostgreSQL
- **Authentification**: NextAuth.js
- **Cartographie**: Leaflet
- **Style**: TailwindCSS, HeadlessUI

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/IDRAYNAR/activities-agenda.git
cd activities-agenda
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```
Remplissez le fichier `.env` avec vos propres valeurs.

4. Initialisez la base de données :
```bash
npx prisma migrate dev
npm run seed
```

5. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## 🔧 Scripts Disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée la version de production
- `npm run start` : Démarre le serveur de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run seed` : Remplit la base de données avec des données de test
- `npm run seed:reservations` : Ajoute des réservations de test

## 📁 Structure du Projet

```
activities-agenda/
├── app/                    # Code source principal
│   ├── api/               # Routes API
│   ├── components/        # Composants React réutilisables
│   ├── contexts/          # Contextes React
│   ├── login/             # Page de connexion
│   ├── profile/           # Page de profil
│   ├── register/          # Page d'inscription
│   ├── dashboard/         # Interface d'administration
│   ├── types/             # Types TypeScript
│   ├── utils/             # Fonctions utilitaires
│   ├── dashboard/         # Interface d'administration
│   └── activities/        # Pages des activités
├── prisma/                # Schéma et migrations Prisma
├── public/                # Fichiers statiques
├── lib/                   # Librairies
├── types/                 # Types TypeScript
└── scripts/                # Scripts de développement
```

## 👥 Développeurs

- IDRI RAYAN
- QUINONES ESTEBAN

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
