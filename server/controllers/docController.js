// This is the document controller
// It just stores/ Manages the Metadata of uploaded research papers in MongoDb

import Document from "../models/Document.js";
import { processAndStorePDF } from "../services/ragService.js";
import { pineconeIndex } from "../config/pinecone.js";

export const uploadPaper = async(req,res) => {
    try {
        // 1. Check if the file exits or not 
        if(!req.file){
            return res.status(400).json({ error: "No PDF file provided." });
        }
        // 2. Call the AI service to process chunks and store in pinecone 
        // We already wrote this in RagService.js

        const aiResult = await processAndStorePDF(req.file.path, pineconeIndex)
    } catch (error) {
        
    }
}