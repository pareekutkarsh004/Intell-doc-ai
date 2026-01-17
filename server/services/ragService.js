/**
 * RAG SERVICE - THE BRAIN
 * This file handles the "Retrieval-Augmented Generation" logic.
 * It is responsible for document ingestion and vector database management.
 */

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { TaskType } from "@google/generative-ai";

/**
 * 1. Initialize the Embedding Model
 * This turns human words into an array of numbers (Vectors).
 * We use 'text-embedding-004' which is Google's latest for 2026.
 */
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
});

/**
 * 2. Function: processAndStorePDF
 * This is called whenever a researcher uploads a new paper.
 * @param {string} filePath - The path where Multer saved the PDF
 * @param {object} pineconeIndex - The initialized Pinecone index
 */
export const processAndStorePDF = async (filePath, pineconeIndex) => {
    try {
        console.log(`📂 Loading PDF from: ${filePath}`);

        // A. Load the PDF
        const loader = new PDFLoader(filePath);
        const rawDocs = await loader.load();

        // B. Split the text into chunks
        // Why? AI has a "limit" on how much it can read at once. 
        // 1000 characters is a good "bite-size" chunk.
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000, 
            chunkOverlap: 200, // 200 chars overlap to keep context between chunks
        });

        const splitDocs = await splitter.splitDocuments(rawDocs);
        console.log(`✂️ Split into ${splitDocs.length} chunks.`);

        // C. Store in Pinecone
        // This automatically embeds the chunks and uploads them.
        await PineconeStore.fromDocuments(splitDocs, embeddings, {
            pineconeIndex: pineconeIndex,
            namespace: "chemistry-research", // Organizing your data by category
        });

        console.log("✅ Successfully stored in Pinecone.");
        return { success: true, chunkCount: splitDocs.length };

    } catch (error) {
        console.error("❌ RAG Service Error:", error);
        throw error;
    }
};