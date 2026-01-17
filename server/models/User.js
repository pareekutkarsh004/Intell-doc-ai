import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebaseId: { type: String, required: true, unique: true }, // The ID from Firebase Auth
    email: { type: String, required: true },
    name: { type: String },
    profilePic: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);