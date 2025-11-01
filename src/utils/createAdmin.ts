import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/User';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      username: 'admin',
      email: 'admin@portfolio.com',
      password: 'Admin@123',
      role: 'ADMIN' as const
    };

    
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà avec cet email');
      process.exit(0);
    }

  
    const admin = await User.create(adminData);

    console.log('========================================');
    console.log(' Administrateur créé avec succès !');
    console.log('========================================');
    console.log(' Email:', admin.email);
    console.log(' Username:', admin.username);
    console.log(' Password: Admin@123');
    console.log('  Role:', admin.role);
    console.log('========================================');
    console.log('  IMPORTANT: Changez ce mot de passe en production !');
    console.log('========================================');

    process.exit(0);
  } catch (error) {
    console.error(' Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

createAdmin();