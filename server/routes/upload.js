import express from 'express';
import { upload } from '../middleware/upload.js';
import { processAndStorePDF } from '../services/ragService.js';
import { pineconeIndex } from '../config/pinecone.js';

const router = express.Router();

/**
 * POST /api/upload/pdf
 * Handles file reception and triggers the AI indexing process.
 */
router.post('/pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        console.log(`📥 Received file: ${req.file.originalname}`);

        // Trigger the RAG Service to "read" and "store" the PDF
        // We pass the local path where Multer saved it
        const result = await processAndStorePDF(req.file.path, pineconeIndex);

        res.status(200).json({
            message: "Paper analyzed and added to library!",
            data: result
        });

    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ error: "Failed to process research paper." });
    }
});

export default router;