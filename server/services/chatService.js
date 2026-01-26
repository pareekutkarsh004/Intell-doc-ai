/**
 * CHAT SERVICE
 * Handles the RAG query process with safety checks.
 */

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { HumanMessage, SystemMessage } from "@langchain/core/messages"; 
import { embeddings } from "./ragService.js"; 
import { pineconeIndex } from "../config/pinecone.js";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    streaming: true,
});

export const askQuestion = async (question, socket) => {
    try {
        const cleanQuestion = String(question);
        let context = "";

        // 1. Try to get context, but don't crash if Pinecone is empty
        try {
            const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
                pineconeIndex,
                namespace: "default-namespace", 
            });

            const relevantDocs = await vectorStore.similaritySearch(cleanQuestion, 2);
            context = relevantDocs.map(d => d.page_content).join("\n\n");
        } catch (pinerror) {
            console.log("⚠️ Pinecone is empty or namespace doesn't exist yet. Using general knowledge.");
            context = "No research papers found in the library yet.";
        }

        // 2. Format the messages strictly for Gemini
        const messages = [
            new SystemMessage(`You are an expert Research Assistant. 
            Context from papers: ${context}`),
            new HumanMessage(cleanQuestion),
        ];

        // 3. Stream the response
        const stream = await model.stream(messages);

        for await (const chunk of stream) {
            if (chunk?.content) {
                socket.emit('ai-token', { text: chunk.content });
            }
        }

        socket.emit('ai-response-end');

    } catch (error) {
        // This is what triggers your "AI processing error" in the console
        console.error("❌ Actual Backend Error:", error); 
        socket.emit('error', { message: `AI Error: ${error.message}` });
    }
};