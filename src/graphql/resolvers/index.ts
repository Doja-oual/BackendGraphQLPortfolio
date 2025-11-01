import { AuthContext, requireAdmin, requireAuth } from '../../middleware/auth';
import { generateToken } from '../../utils/jwt';
import User from '../../models/User';
import Profil from '../../models/Profil';
import Competence from '../../models/Competence';
import Projet from '../../models/Projet';
import Experience from '../../models/Experience';

export const resolvers = {
  Query: {
    
    hello: () => 'Hello World! GraphQL Server is running ',

    // User
    me: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);
      return await User.findById(context.user?.userId);
    },

    // Portfolio complet
    getPortfolio: async () => {
      const profil = await Profil.findOne();
      const projets = await Projet.find().populate('technologies').sort({ ordre: 1, dateDebut: -1 });
      const competences = await Competence.find().sort({ categorie: 1, nom: 1 });
      const experiences = await Experience.find().populate('competences').sort({ ordre: 1, dateDebut: -1 });

      return {
        profil,
        projets,
        competences,
        experiences
      };
    },

    // Profil
    getProfil: async () => {
      return await Profil.findOne();
    },

    // Projets
    getProjets: async (_: any, { statut }: { statut?: string }) => {
      const filter = statut ? { statut } : {};
      return await Projet.find(filter).populate('technologies').sort({ ordre: 1, dateDebut: -1 });
    },

    getProjet: async (_: any, { id }: { id: string }) => {
      return await Projet.findById(id).populate('technologies');
    },

    // Compétences
    getCompetences: async (_: any, { categorie }: { categorie?: string }) => {
      const filter = categorie ? { categorie } : {};
      return await Competence.find(filter).sort({ categorie: 1, nom: 1 });
    },

    getCompetence: async (_: any, { id }: { id: string }) => {
      return await Competence.findById(id);
    },

    // Expériences
    getExperiences: async () => {
      return await Experience.find().populate('competences').sort({ ordre: 1, dateDebut: -1 });
    },

    getExperience: async (_: any, { id }: { id: string }) => {
      return await Experience.findById(id).populate('competences');
    }
  },

  Mutation: {
    
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { token, user };
    },

    register: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }]
      });

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà');
      }

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password,
        role: 'USER'
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { token, user };
    },

  
    createProfil: async (_: any, { input }: any, context: AuthContext) => {
      requireAdmin(context);

      const existingProfil = await Profil.findOne();
      if (existingProfil) {
        throw new Error('Un profil existe déjà. Utilisez updateProfil pour le modifier.');
      }

      return await Profil.create(input);
    },

    updateProfil: async (_: any, { id, input }: any, context: AuthContext) => {
      requireAdmin(context);

      const profil = await Profil.findByIdAndUpdate(id, input, { new: true, runValidators: true });

      if (!profil) {
        throw new Error('Profil non trouvé');
      }

      return profil;
    },

    deleteProfil: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdmin(context);

      const profil = await Profil.findByIdAndDelete(id);

      if (!profil) {
        throw new Error('Profil non trouvé');
      }

      return true;
    },

  
    createCompetence: async (_: any, { input }: any, context: AuthContext) => {
      requireAdmin(context);
      return await Competence.create(input);
    },

    updateCompetence: async (_: any, { id, input }: any, context: AuthContext) => {
      requireAdmin(context);

      const competence = await Competence.findByIdAndUpdate(id, input, { new: true, runValidators: true });

      if (!competence) {
        throw new Error('Compétence non trouvée');
      }

      return competence;
    },

    deleteCompetence: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdmin(context);

      const competence = await Competence.findByIdAndDelete(id);

      if (!competence) {
        throw new Error('Compétence non trouvée');
      }

      return true;
    },

  
    createProjet: async (_: any, { input }: any, context: AuthContext) => {
      requireAdmin(context);
      const projet = await Projet.create(input);
      return await projet.populate('technologies');
    },

    updateProjet: async (_: any, { id, input }: any, context: AuthContext) => {
      requireAdmin(context);

      const projet = await Projet.findByIdAndUpdate(id, input, { new: true, runValidators: true }).populate('technologies');

      if (!projet) {
        throw new Error('Projet non trouvé');
      }

      return projet;
    },

    deleteProjet: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdmin(context);

      const projet = await Projet.findByIdAndDelete(id);

      if (!projet) {
        throw new Error('Projet non trouvé');
      }

      return true;
    },

    
    createExperience: async (_: any, { input }: any, context: AuthContext) => {
      requireAdmin(context);
      const experience = await Experience.create(input);
      return await experience.populate('competences');
    },

    updateExperience: async (_: any, { id, input }: any, context: AuthContext) => {
      requireAdmin(context);

      const experience = await Experience.findByIdAndUpdate(id, input, { new: true, runValidators: true }).populate('competences');

      if (!experience) {
        throw new Error('Expérience non trouvée');
      }

      return experience;
    },

    deleteExperience: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdmin(context);

      const experience = await Experience.findByIdAndDelete(id);

      if (!experience) {
        throw new Error('Expérience non trouvée');
      }

      return true;
    }
  }
};