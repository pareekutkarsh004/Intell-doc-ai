/**
 * UPLOAD ROUTE
 * Connects the Multer middleware to the RAG processing service.
 */

import express from 'express';
// FIXED: Path to middleware (ensuring it matches your 'middleware' folder)
import { upload } from '../middleware/uploads.js'; 
import { processAndStorePDF } from '../services/ragService.js'; 
import fs from 'fs';

const router = express.Router();

/**
 * POST /api/upload
 * Receives a PDF file, extracts text, converts it to vectors, and stores it in Pinecone.
 */
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No research paper provided." });
        }

        console.log(`📂 Processing: ${req.file.originalname}`);

        // 1. Trigger the RAG pipeline 
        // FIXED: Using 'processAndStorePDF' to match your ragService.js export
        const result = await processAndStorePDF(req.file.path, req.file.originalname);

        // 2. Cleanup: Delete file from local server 'uploads' folder after successful indexing
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(200).json({ 
            message: "Paper analyzed and added to library!", 
            details: result 
        });

    } catch (error) {
        console.error("❌ Upload Route Error:", error);
        
        // 3. Safety Cleanup: Ensure file is deleted even if the processing fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: "Failed to process research paper." });
    }
});

export default router;