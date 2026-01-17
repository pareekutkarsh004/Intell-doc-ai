/**
 * PINECONE CONFIGURATION
 * This file initializes the connection to your Vector Database.
 * It provides the 'index' object which we use for RAG operations.
 */

import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

// 1. Initialize the Pinecone Client
// The client is the "bridge" to the Pinecone cloud service.
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// 2. Export the specific Index
// We use 'process.env.PINECONE_INDEX_NAME' so we can change 
// indexes easily in different environments (dev/prod).
export const pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME);

/**
 * PRO TIP FOR PLACEMENTS:
 * If a recruiter asks why you chose Pinecone, tell them:
 * "I used Pinecone's Serverless architecture because it provides 
 * sub-second latency for semantic search and scales automatically 
 * with my document ingestion needs."
 */