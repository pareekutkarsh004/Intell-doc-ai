/**
 * USER CONTROLLER
 * Synchronizes Firebase Authentication with our MongoDB Database.
 */

import User from '../models/User.js';
import admin from 'firebase-admin'; // Firebase Admin SDK

export const syncUser = async(req,res) => {
    try {
        // 1. Get the token from the header 
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
            return res.status(401).json({ error: "No authentication token provided" });
        }
        // 2. Verify the token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // 3. Find user in MongoDB or create a new one (Upsert logic)
        // We use 'firebaseId' as our unique anchor
        const user = await User.findOne({ firebaseId: uid });
        if (!user) {
            console.log("🆕 Creating new researcher profile...");
            user = new User({
                firebaseId: uid,
                email: email,
                name: name || email.split('@')[0],
                profilePic: picture || ""
            });
            await user.save();
        }
        // 4. Send the MongoDB user object back to the React app
        res.status(200).json({
            message: "User synced successfully",
            user: user
        });
    } catch (error) {
        console.error("Auth Sync Error:", error);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};