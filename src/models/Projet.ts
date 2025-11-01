import mongoose, { Document, Schema } from 'mongoose';

export enum StatutProjet {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ARCHIVE = 'ARCHIVE'
}

export interface IProjet extends Document {
  titre: string;
  description: string;
  descriptionLongue?: string;
  technologies: mongoose.Types.ObjectId[];
  images: string[];
  lienGithub?: string;
  lienDemo?: string;
  statut: StatutProjet;
  dateDebut: Date;
  dateFin?: Date;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjetSchema = new Schema<IProjet>(
  {
    titre: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    descriptionLongue: {
      type: String,
      maxlength: [5000, 'La description longue ne peut pas dépasser 5000 caractères']
    },
    technologies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Competence'
      }
    ],
    images: [
      {
        type: String,
        trim: true
      }
    ],
    lienGithub: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'URL GitHub invalide']
    },
    lienDemo: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.*$/, 'URL invalide']
    },
    statut: {
      type: String,
      enum: Object.values(StatutProjet),
      default: StatutProjet.EN_COURS
    },
    dateDebut: {
      type: Date,
      required: [true, 'La date de début est requise']
    },
    dateFin: {
      type: Date,
      validate: {
        validator: function(this: IProjet, value: Date) {
          return !value || value >= this.dateDebut;
        },
        message: 'La date de fin doit être après la date de début'
      }
    },
    ordre: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);


ProjetSchema.index({ titre: 1 });
ProjetSchema.index({ statut: 1 });
ProjetSchema.index({ dateDebut: -1 });
ProjetSchema.index({ ordre: 1 });

export default mongoose.model<IProjet>('Projet', ProjetSchema);