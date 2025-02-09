# Activities Agenda 📅

Une application web moderne de gestion d'activités et de réservations développée avec Next.js 15.

## 👥 Développeurs

- **IDRI RAYAN** - Développeur Full Stack - [GitHub](https://github.com/IDRAYNAR)
- **QUINONES ESTEBAN** - Développeur Full Stack - [GitHub](https://github.com/EstebanQui)

## ⚠️ **IMPORTANT**

Cette application utilise une base de données Neon PostgreSQL avec un plan gratuit. En raison des limitations de stockage de ce plan, certaines fonctionnalités pourraient être affectées si la limite est atteinte. Si vous rencontrez des problèmes, veuillez me contacter à rayan.idri@edu.devinci.fr pour que je puisse migrer vers une nouvelle base de données. À l'heure actuelle, toutes les fonctionnalités sont opérationnelles.

## Identifiant Administrateur

Email: admin@admin.com
Mdp: admin@admin.com

## 🎯 À propos du projet

Activities Agenda est une plateforme complète permettant aux utilisateurs de créer, gérer et participer à diverses activités. Le projet a été développé dans le cadre de l'évaluation IIM A5 DFS, mettant l'accent sur l'utilisation des technologies modernes du web et les bonnes pratiques de développement.

## 🚀 Fonctionnalités

### Gestion des utilisateurs
- Inscription et connexion sécurisée
- Profils utilisateurs personnalisables
- Rôles différenciés (utilisateur standard, administrateur)
- Gestion des informations personnelles

### Gestion des activités
- Création d'activités avec localisation
- Modification et suppression d'activités
- Système de réservation en temps réel
- Filtrage et recherche d'activités
- Carte interactive pour localiser les activités

### Interface d'administration
- Tableau de bord avec statistiques détaillées
- Gestion des utilisateurs et des activités
- Suivi des réservations
- Métriques et analyses

### Fonctionnalités techniques
- Interface responsive et moderne
- Validation des données côté client et serveur
- Gestion des erreurs et feedback utilisateur
- SEO optimisé avec métadonnées dynamiques
- Performance optimisée avec Next.js

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React avec SSR/SSG
- **React 19** - Bibliothèque UI
- **TailwindCSS** - Framework CSS utilitaire
- **HeadlessUI** - Composants UI accessibles
- **Leaflet** - Bibliothèque de cartographie interactive

### Backend
- **API Routes Next.js** - Points d'API serverless
- **Prisma** - ORM moderne pour TypeScript
- **PostgreSQL** - Base de données relationnelle
- **NextAuth.js** - Authentification complète
- **TypeScript** - Typage statique

### Outils de développement
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **Git** - Contrôle de version
- **GitHub Actions** - CI/CD

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL
- npm ou yarn
- Git

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
Remplissez le fichier `.env` avec les valeurs suivantes :
```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"
TMDB_API_KEY="your_tmdb_api_key"
TMDB_API_URL="https://api.themoviedb.org/3"

# Configuration Gmail
GMAIL_USER="your.email@gmail.com"
GMAIL_APP_PASSWORD="your_app_password"

# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your.email@gmail.com"
SMTP_PASSWORD="your_smtp_password"
SMTP_FROM="Your App Name <your.email@gmail.com>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

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
│   └── activities/        # Pages des activités
├── prisma/                # Schéma et migrations Prisma
├── public/                # Fichiers statiques
├── lib/                   # Librairies
├── types/                 # Types TypeScript
└── scripts/                # Scripts de développement
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

Pour toute question ou problème :
- Email : rayan.idri@edu.devinci.fr
- GitHub Issues : [Créer une issue](https://github.com/IDRAYNAR/activities-agenda/issues)
