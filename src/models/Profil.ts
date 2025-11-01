import mongoose, { Document, Schema } from 'mongoose';

export interface IProfil extends Document {
  nom: string;
  prenom: string;
  titre: string;
  bio: string;
  email: string;
  telephone?: string;
  photo?: string;
  cv?: string;
  reseauxSociaux: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  adresse?: {
    ville: string;
    pays: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfilSchema = new Schema<IProfil>(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    titre: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    bio: {
      type: String,
      required: [true, 'La bio est requise'],
      maxlength: [2000, 'La bio ne peut pas dépasser 2000 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
    },
    telephone: {
      type: String,
      trim: true,
      match: [/^[\d\s\+\-\(\)]+$/, 'Numéro de téléphone invalide']
    },
    photo: {
      type: String,
      trim: true
    },
    cv: {
      type: String,
      trim: true
    },
    reseauxSociaux: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
      website: { type: String, trim: true }
    },
    adresse: {
      ville: { type: String, trim: true },
      pays: { type: String, trim: true }
    }
  },
  {
    timestamps: true
  }
);


ProfilSchema.index({ nom: 1, prenom: 1 });
ProfilSchema.index({ email: 1 });

export default mongoose.model<IProfil>('Profil', ProfilSchema);