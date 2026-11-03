import mongoose from "mongoose";
import { MONGODB_URI } from './config';

export async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🟢 Connected to MongoDB successful')
    }catch (error){
        console.error('🔴 MongoDB connection error: ', error);
        process.exit(1);
    }
}
