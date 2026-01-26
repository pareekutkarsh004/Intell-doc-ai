/**
 * INTELDOC AI - MAIN SERVER ENTRY POINT
 */

import 'dotenv/config'; 
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import uploadRoutes from './routes/upload.js';
import { askQuestion } from './services/chatService.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:8080" 
}));
app.use(express.json());

app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`✅ Backend listening on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`📡 User Connected: ${socket.id}`);

    socket.on('ask-question', async (data) => {
        try {
            // Extract text whether it's an object or a string
            const text = (typeof data === 'object' && data !== null) ? data.text : data;
            
            console.log(`❓ Received Text: ${text}`);

            if (!text || text === "undefined") {
                return socket.emit('error', { message: "Empty question received." });
            }

            socket.emit('ai-status', { message: "Searching papers..." });

            await askQuestion(text, socket);

        } catch (error) {
            console.error("❌ Socket Error:", error);
            socket.emit('error', { message: "Internal server error." });
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ Disconnected: ${socket.id}`);
    });
});