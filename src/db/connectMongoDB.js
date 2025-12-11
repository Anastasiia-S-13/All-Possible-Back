import mongoose from 'mongoose';
import { Booking } from '../models/booking.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI;

    await mongoose.connect(mongoUrl);

    console.log('✅ MongoDB connection established successfully');
    await Booking.syncIndexes();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
