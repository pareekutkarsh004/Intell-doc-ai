/**
 * RAG SERVICE
 * Responsible for processing PDFs, chunking text, and storing vectors in Pinecone.
 */

import 'dotenv/config';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { pineconeIndex } from "../config/pinecone.js";

// 1. Initialize Gemini Embeddings
// This is exported so chatService.js can use it for similarity searches
export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "text-embedding-004",
});

/**
 * processAndStorePDF
 * @param {string} filePath - Path to the temporarily saved PDF file
 * @param {string} fileName - Original name of the research paper
 */
export const processAndStorePDF = async (filePath, fileName) => {
    try {
        console.log(`📄 Starting analysis for: ${fileName}`);

        // 1. Load the PDF content
        const loader = new PDFLoader(filePath);
        const rawDocs = await loader.load();

        // 2. Split text into manageable chunks
        // chunkSize 1000 with 200 overlap ensures context isn't lost between chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);

        // 3. Add metadata to each chunk
        // This allows the AI to cite the specific file it's reading from
        const metadataDocs = docs.map(doc => ({
            ...doc,
            metadata: { 
                ...doc.metadata, 
                fileName,
                uploadedAt: new Date().toISOString()
            }
        }));

        // 4. Store the chunks and their embeddings in Pinecone
        // We use "default-namespace" to match our chatService query logic
        await PineconeStore.fromDocuments(metadataDocs, embeddings, {
            pineconeIndex,
            namespace: "default-namespace",
        });

        console.log(`✅ Successfully indexed ${docs.length} chunks into Pinecone.`);
        
        return { 
            success: true, 
            chunks: docs.length,
            fileName 
        };
    } catch (error) {
        console.error("❌ RAG Service Error:", error);
        throw error; // Pass error up to the route handler
    }
};