import mongoose, { Document, Schema } from 'mongoose';

export enum NiveauCompetence {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE',
  EXPERT = 'EXPERT'
}

export enum CategorieCompetence {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  AUTRE = 'AUTRE'
}

export interface ICompetence extends Document {
  nom: string;
  niveau: NiveauCompetence;
  categorie: CategorieCompetence;
  pourcentage?: number;
  icone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompetenceSchema = new Schema<ICompetence>(
  {
    nom: {
      type: String,
      required: [true, 'Le nom de la compétence est requis'],
      unique: true,
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    niveau: {
      type: String,
      enum: Object.values(NiveauCompetence),
      required: [true, 'Le niveau est requis']
    },
    categorie: {
      type: String,
      enum: Object.values(CategorieCompetence),
      required: [true, 'La catégorie est requise']
    },
    pourcentage: {
      type: Number,
      min: [0, 'Le pourcentage doit être entre 0 et 100'],
      max: [100, 'Le pourcentage doit être entre 0 et 100']
    },
    icone: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index pour la recherche
CompetenceSchema.index({ nom: 1 });
CompetenceSchema.index({ categorie: 1 });
CompetenceSchema.index({ niveau: 1 });

export default mongoose.model<ICompetence>('Competence', CompetenceSchema);