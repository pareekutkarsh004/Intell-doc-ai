import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true }, // Path to the PDF in your /uploads folder
    fileSize: { type: Number },
    uploadDate: { type: Date, default: Date.now },
    // We store the Pinecone 'namespace' here so we know where to search
    vectorNamespace: { type: String, required: true } 
});

export default mongoose.model('Document', documentSchema);