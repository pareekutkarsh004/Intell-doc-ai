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

        const aiResult = await processAndStorePDF(req.file.path, pineconeIndex);

        // 3. Save the record in MongoDb so the user can see it in their library later

        const newDoc = new Document({
                owner: req.body.userId,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileSize: req.file.size,
                // We store the Pinecone 'namespace' here so we know where to search
                vectorNamespace: "research-papers"  // matches our rag service namespace
        });

        const savedDoc = await newDoc.save();

        // 4. Send success response back to React 

        res.status(201).json({
            message: "Research paper analyzed and saved!",
            document: savedDoc
        })
    } catch (error) {
        console.error("Upload Controller Error:", error);
        res.status(500).json({ error: "Failed to process the document." });
    }
};

// Get all documents
// Fethches the list of papers uploaded by a specific user 
export const getUserPapers = async (req, res) => {
    try {
        const { userId } = req.params;
        const papers = await Document.find({ owner: userId });
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch your papers." });
    }
};