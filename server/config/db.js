/**
 * DATABASE CONNECTION CONFIG
 * This file handles the asynchronous connection to MongoDB Atlas using Mongoose.
 */

import mongoose from 'mongoose';

/**
 * connectDB: An asynchronous function to establish the connection.
 * We use a try-catch block to handle any initial connection errors.
 */
const connectDB = async () => {
    try {
        // We use the URI from your .env file
        // The await keyword pauses execution until the connection is successful
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        
        // If the database fails to connect, we stop the server immediately
        process.exit(1); 
    }
};

export default connectDB;