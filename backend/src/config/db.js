import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    if (!uri) {
      throw new Error('MONGO_URI is required');
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      tls: true,
      retryWrites: true,
      w: 'majority',
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);

    process.exit(1);
  }
}