import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Profil {
    id: ID!
    nom: String!
    prenom: String!
    titre: String!
    bio: String!
    email: String!
    telephone: String
    photo: String
    cv: String
    reseauxSociaux: ReseauxSociaux
    adresse: Adresse
    createdAt: String!
    updatedAt: String!
  }

  type ReseauxSociaux {
    linkedin: String
    github: String
    twitter: String
    website: String
  }

  type Adresse {
    ville: String
    pays: String
  }

  type Competence {
    id: ID!
    nom: String!
    niveau: NiveauCompetence!
    categorie: CategorieCompetence!
    pourcentage: Int
    icone: String
    createdAt: String!
    updatedAt: String!
  }

  type Projet {
    id: ID!
    titre: String!
    description: String!
    descriptionLongue: String
    technologies: [Competence!]!
    images: [String!]!
    lienGithub: String
    lienDemo: String
    statut: StatutProjet!
    dateDebut: String!
    dateFin: String
    ordre: Int
    createdAt: String!
    updatedAt: String!
  }

  type Experience {
    id: ID!
    entreprise: String!
    poste: String!
    type: TypeExperience!
    description: String!
    competences: [Competence!]!
    dateDebut: String!
    dateFin: String
    enCours: Boolean!
    lieu: String
    logo: String
    ordre: Int
    createdAt: String!
    updatedAt: String!
  }

  type Portfolio {
    profil: Profil
    projets: [Projet!]!
    competences: [Competence!]!
    experiences: [Experience!]!
  }

  enum Role {
    ADMIN
    USER
  }

  enum NiveauCompetence {
    DEBUTANT
    INTERMEDIAIRE
    AVANCE
    EXPERT
  }

  enum CategorieCompetence {
    FRONTEND
    BACKEND
    DATABASE
    DEVOPS
    AUTRE
  }

  enum StatutProjet {
    EN_COURS
    TERMINE
    ARCHIVE
  }

  enum TypeExperience {
    CDI
    CDD
    FREELANCE
    STAGE
    ALTERNANCE
  }

  input ReseauxSociauxInput {
    linkedin: String
    github: String
    twitter: String
    website: String
  }

  input AdresseInput {
    ville: String
    pays: String
  }

  input ProfilInput {
    nom: String!
    prenom: String!
    titre: String!
    bio: String!
    email: String!
    telephone: String
    photo: String
    cv: String
    reseauxSociaux: ReseauxSociauxInput
    adresse: AdresseInput
  }

  input CompetenceInput {
    nom: String!
    niveau: NiveauCompetence!
    categorie: CategorieCompetence!
    pourcentage: Int
    icone: String
  }

  input ProjetInput {
    titre: String!
    description: String!
    descriptionLongue: String
    technologies: [ID!]!
    images: [String!]
    lienGithub: String
    lienDemo: String
    statut: StatutProjet
    dateDebut: String!
    dateFin: String
    ordre: Int
  }

  input ExperienceInput {
    entreprise: String!
    poste: String!
    type: TypeExperience!
    description: String!
    competences: [ID!]!
    dateDebut: String!
    dateFin: String
    enCours: Boolean
    lieu: String
    logo: String
    ordre: Int
  }

  type Query {
    hello: String!
    me: User
    getPortfolio: Portfolio!
    getProfil: Profil
    getProjets(statut: StatutProjet): [Projet!]!
    getProjet(id: ID!): Projet
    getCompetences(categorie: CategorieCompetence): [Competence!]!
    getCompetence(id: ID!): Competence
    getExperiences: [Experience!]!
    getExperience(id: ID!): Experience
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(username: String!, email: String!, password: String!): AuthPayload!
    createProfil(input: ProfilInput!): Profil!
    updateProfil(id: ID!, input: ProfilInput!): Profil!
    deleteProfil(id: ID!): Boolean!
    createCompetence(input: CompetenceInput!): Competence!
    updateCompetence(id: ID!, input: CompetenceInput!): Competence!
    deleteCompetence(id: ID!): Boolean!
    createProjet(input: ProjetInput!): Projet!
    updateProjet(id: ID!, input: ProjetInput!): Projet!
    deleteProjet(id: ID!): Boolean!
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: ID!, input: ExperienceInput!): Experience!
    deleteExperience(id: ID!): Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
