import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    
    await mongoose.connect(mongoURI);
    
    console.log(' MongoDB connected successfully');
    console.log(` Database: ${mongoose.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(' MongoDB error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('  MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;