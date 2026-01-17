/**
 * INTELDOC AI - MAIN SERVER ENTRY POINT
 * This file initializes our Express app, connects Socket.io for real-time AI streaming,
 * and sets up the foundation for our RAG (Retrieval-Augmented Generation) system.
 */

// 1. Core Imports
import express from 'express';
import { Server } from 'socket.io'; // Real-time engine
import cors from 'cors';           // Cross-Origin Resource Sharing
import dotenv from 'dotenv';       // Environment variable manager
import uploadRoutes from './routes/upload.js';
import { askQuestion } from './services/chatService.js';
// 2. Load environment variables from our .env file
dotenv.config();

// 3. Initialize the Express Application
const app = express();

/**
 * 4. Middleware Setup
 * app.use() applies functions to every request that enters the server.
 */
app.use(cors());          // Allows our React frontend (port 5173) to talk to this server
app.use(express.json());  // Automatically parses incoming JSON data into JavaScript objects

app.use('/api/upload', uploadRoutes);

/**
 * 5. Server Initialization
 * We use app.listen() to start the server. It returns the "HTTP Server" object
 * which we need to hand over to Socket.io so it can handle real-time traffic.
 */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`✅ IntelDoc Backend active on: http://localhost:${PORT}`);
    console.log(`🚀 Ready for AI Research requests...`);
});

/**
 * 6. Socket.io Integration
 * This sets up a "WebSocket" connection. Unlike a normal API where the user
 * requests and waits, a Socket is a persistent "tunnel" for instant communication.
 */
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Only allow our specific React app
        methods: ["GET", "POST"]
    }
});

/**
 * 7. Real-time Communication Logic
 * This block runs whenever a user opens our website and connects to the socket.
 */
io.on('connection', (socket) => {
    console.log(`📡 Researcher connected: ${socket.id}`);

    /**
     * EVENT: ask-question
     * This is triggered when the user sends a message from the React dashboard.
     */
    socket.on('ask-question', async (data) => {
        try {
            const { text } = data; // The question from the user
            
            console.log(`❓ Received: ${text}`);

            // A. Send immediate feedback so the UI shows a "loading" state
            socket.emit('ai-status', { message: "Analyzing papers..." });

            // B. Trigger the RAG + Streaming process
            // We pass the 'socket' instance so the service can emit tokens directly
            await askQuestion(text, socket);

            // C. Once 'askQuestion' is finished, we don't need to do anything here
            // as the service itself handles the 'ai-response-end' emission.
            
        } catch (error) {
            console.error("❌ Socket Chat Error:", error);
            socket.emit('error', { message: "Something went wrong with the AI." });
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ Researcher disconnected: ${socket.id}`);
    });
});
/**
 * 8. Future Route Registration
 * We will later add 'app.use("/api/upload", uploadRoutes)' here.
 */
