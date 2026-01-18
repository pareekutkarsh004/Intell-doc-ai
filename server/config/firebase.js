import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

// Load your service account JSON file that you downloaded from Firebase console
const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("🔥 Firebase Admin Initialized");

export default admin;