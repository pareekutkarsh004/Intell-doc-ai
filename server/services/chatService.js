/**
 * CHAT SERVICE
 * Handles the RAG query process: Search Pinecone -> Ask Gemini -> Stream to User
 */

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./ragService.js"; // Reuse the same embedding model
import { pineconeIndex } from "../config/pinecone.js";

// Initialize the Chat Model
const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    streaming: true, // Crucial for word-by-word response
});

export const askQuestion = async (question, socket) => {
    try {
        // 1. Connect to our existing "Memory" in Pinecone
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            namespace: data.userId,
        });

        // 2. Search for the top 3 most relevant chunks in the PDF
        const relevantDocs = await vectorStore.similaritySearch(question, 3);
        
        // 3. Combine the found text to create "Context"
        const context = relevantDocs.map(d => d.page_content).join("\n\n");

        // 4. Create a prompt that forces the AI to use the PDF data
        const prompt = `
            You are an expert Research Assistant. 
            Use the following context from the uploaded research paper to answer the question.
            If the answer isn't in the context, say you don't know based on the paper.
            
            Context: ${context}
            Question: ${question}
            Answer:
        `;

        // 5. Stream the answer word-by-word to the frontend
        const stream = await model.stream(prompt);

        for await (const chunk of stream) {
            // We emit each small "token" (word/part of word) as it's generated
            socket.emit('ai-token', { text: chunk.content });
        }

        // Tell the frontend the message is finished
        socket.emit('ai-response-end');

    } catch (error) {
        console.error("Chat Error:", error);
        socket.emit('error', { message: "AI failed to process that question." });
    }
};