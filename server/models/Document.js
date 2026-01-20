import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL from Firebase Storage
    pineconeNamespace: { type: String, required: true }, // For RAG isolation
    uploadDate: { type: Date, default: Date.now },
    fileSize: Number,
    summary: String // We can store a mini-summary generated later
});

export default mongoose.model('Document', documentSchema);