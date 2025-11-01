import mongoose, { Document, Schema } from 'mongoose';

export enum TypeExperience {
  CDI = 'CDI',
  CDD = 'CDD',
  FREELANCE = 'FREELANCE',
  STAGE = 'STAGE',
  ALTERNANCE = 'ALTERNANCE'
}

export interface IExperience extends Document {
  entreprise: string;
  poste: string;
  type: TypeExperience;
  description: string;
  competences: mongoose.Types.ObjectId[];
  dateDebut: Date;
  dateFin?: Date;
  enCours: boolean;
  lieu?: string;
  logo?: string;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    entreprise: {
      type: String,
      required: [true, 'Le nom de l\'entreprise est requis'],
      trim: true,
      maxlength: [200, 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères']
    },
    poste: {
      type: String,
      required: [true, 'Le poste est requis'],
      trim: true,
      maxlength: [200, 'Le poste ne peut pas dépasser 200 caractères']
    },
    type: {
      type: String,
      enum: Object.values(TypeExperience),
      required: [true, 'Le type de contrat est requis']
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
    },
    competences: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Competence'
      }
    ],
    dateDebut: {
      type: Date,
      required: [true, 'La date de début est requise']
    },
    dateFin: {
      type: Date,
      validate: {
        validator: function(this: IExperience, value: Date) {
          return !value || value >= this.dateDebut;
        },
        message: 'La date de fin doit être après la date de début'
      }
    },
    enCours: {
      type: Boolean,
      default: false
    },
    lieu: {
      type: String,
      trim: true
    },
    logo: {
      type: String,
      trim: true
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


ExperienceSchema.index({ entreprise: 1 });
ExperienceSchema.index({ dateDebut: -1 });
ExperienceSchema.index({ ordre: 1 });
ExperienceSchema.index({ enCours: 1 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);