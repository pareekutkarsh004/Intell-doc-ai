import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Standard 2026 practice: Initializing via environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The replace() is needed to handle the newline characters in the key
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

console.log("🔥 Firebase Admin (Cloud Mode) Initialized");

export default admin;