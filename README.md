# Portfolio Backend - API GraphQL

Backend GraphQL moderne pour un site de portfolio personnel, construit avec Node.js, TypeScript, Apollo Server et MongoDB.

##  Stack Technique

- **Runtime**: Node.js
- **Langage**: TypeScript
- **Framework**: Express.js
- **API**: GraphQL (Apollo Server)
- **Base de données**: MongoDB (Mongoose)
- **Authentification**: JWT (JSON Web Tokens)
- **Sécurité**: Bcrypt pour le hachage des mots de passe

##  Fonctionnalités

### Queries Publiques (Accessibles à tous)
- `getPortfolio`: Récupère l'intégralité du portfolio (profil, projets, compétences, expériences)
- `getProfil`: Récupère uniquement le profil
- `getProjets`: Liste tous les projets visibles
- `getProjet(id)`: Récupère un projet spécifique
- `getCompetences`: Liste toutes les compétences
- `getExperiences`: Liste toutes les expériences

### Mutations Protégées (Admin uniquement)
- `login(username, password)`: Authentification admin
- `updateProfil(input)`: Mise à jour du profil
- `createProjet(input)`, `updateProjet(id, input)`, `deleteProjet(id)`: Gestion des projets
- `createCompetence(input)`, `updateCompetence(id, input)`, `deleteCompetence(id)`: Gestion des compétences
- `createExperience(input)`, `updateExperience(id, input)`, `deleteExperience(id)`: Gestion des expériences

##  Structure du Projet

```
portfolio-backend/
├── src/
│   ├── config/
│   │   └── database.ts           # Configuration MongoDB
│   ├── middleware/
│   │   └── auth.ts               # Middleware d'authentification
│   ├── models/
│   │   ├── User.ts               # Modèle utilisateur admin
│   │   ├── Profil.ts             # Modèle profil
│   │   ├── Projet.ts             # Modèle projet
│   │   ├── Competence.ts         # Modèle compétence
│   │   └── Experience.ts         # Modèle expérience
│   ├── resolvers/
│   │   └── index.ts              # Resolvers GraphQL
│   ├── schemas/
│   │   └── typeDefs.ts           # Schéma GraphQL
│   ├── utils/
│   │   ├── jwt.ts                # Utilitaires JWT
│   │   └── createAdmin.ts        # Script création admin
│   └── index.ts                  # Point d'entrée
├── .env.example                  # Exemple de configuration
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

##  Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet** (ou copier les fichiers)

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos propres valeurs :
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=votre_secret_jwt_tres_securise_a_changer
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Créer un utilisateur admin**
```bash
npm run create-admin
```

Cela créera un utilisateur avec :
- Username: `admin`
- Password: `Admin123!`

⚠️ **Changez ce mot de passe après votre première connexion !**

5. **Démarrer le serveur en développement**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:4000`
GraphQL Playground disponible sur `http://localhost4000/graphql`

## 🔐 Authentification

### Se connecter

```graphql
mutation {
  login(username: "admin", password: "Admin123!") {
    token
    user {
      id
      username
      role
    }
  }
}
```

### Utiliser le token

Pour les mutations protégées, ajoutez le token dans les headers :
```
Authorization: Bearer <votre_token>
```

##  Exemples de Requêtes

### Récupérer tout le portfolio (Public)

```graphql
query {
  getPortfolio {
    profil {
      nom
      prenom
      titre
      bio
      email
      reseauxSociaux {
        linkedin
        github
      }
    }
    projets {
      id
      titre
      description
      technologies
      lienGithub
    }
    competences {
      id
      nom
      niveau
      categorie
    }
    experiences {
      id
      poste
      entreprise
      dateDebut
      enCours
    }
  }
}
```

### Créer un projet (Admin)

```graphql
mutation {
  createProjet(input: {
    titre: "Mon Super Projet"
    description: "Description détaillée du projet"
    technologies: ["React", "Node.js", "MongoDB"]
    lienGithub: "https://github.com/user/projet"
    lienDemo: "https://demo.com"
    dateDebut: "2024-01-01"
    visible: true
    ordre: 1
  }) {
    id
    titre
    description
  }
}
```

### Mettre à jour le profil (Admin)

```graphql
mutation {
  updateProfil(input: {
    nom: "Doe"
    prenom: "John"
    titre: "Développeur Full Stack"
    bio: "Passionné par le développement web..."
    email: "john@example.com"
    reseauxSociaux: {
      linkedin: "https://linkedin.com/in/johndoe"
      github: "https://github.com/johndoe"
    }
  }) {
    id
    nom
    prenom
    titre
  }
}
```

##  Scripts Disponibles

- `npm run dev` - Démarre le serveur en mode développement avec hot-reload
- `npm run build` - Compile le TypeScript en JavaScript
- `npm start` - Démarre le serveur en production (nécessite `npm run build` avant)
- `npm run create-admin` - Crée un utilisateur admin

##  Sécurité

- Authentification par JWT
- Contrôle d'accès basé sur les rôles (RBAC)
- Hachage des mots de passe avec bcrypt
- Validation des données avec Mongoose
- Protection CORS configurée

##  Déploiement

### Build pour production

```bash
npm run build
npm start
```

### Variables d'environnement en production

Assurez-vous de définir toutes les variables d'environnement sur votre plateforme de déploiement :
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET` (utilisez une valeur très sécurisée)
- `JWT_EXPIRES_IN`
- `NODE_ENV=production`

##  Modèles de Données

### Profil
- Informations personnelles (nom, prénom, titre, bio)
- Coordonnées (email, téléphone)
- Photo de profil
- Réseaux sociaux (LinkedIn, GitHub, Twitter, Website)

### Projet
- Titre et description
- Images
- Technologies utilisées
- Liens (GitHub, Demo)
- Dates de début et fin
- Ordre d'affichage
- Visibilité (public/caché)

### Compétence
- Nom
- Niveau (1-5)
- Catégorie (Frontend, Backend, Database, DevOps, Design, Autre)
- Icône
- Ordre d'affichage

### Expérience
- Poste et entreprise
- Lieu
- Description
- Dates de début et fin
- Statut (en cours ou terminé)
- Technologies utilisées
- Ordre d'affichage

##  Contribution

Pour contribuer :
1. Créez une branche pour votre fonctionnalité
2. Commitez vos changements
3. Ouvrez une Pull Request

##  Licence

Ce projet est sous licence ISC.

##  Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue.