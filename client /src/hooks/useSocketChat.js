import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; 

export const useSocketChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! I'm your IntelliDoc AI assistant. I can help you analyze your research papers. What would you like to know?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Listen for streaming tokens from Gemini
    newSocket.on('ai-token', (data) => {
      setIsTyping(true);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'ai') {
          // Append the new token to the existing AI message
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + data.text,
          };
          return updatedMessages;
        } else {
          // Start a new AI message
          return [...prev, { role: 'ai', content: data.text }];
        }
      });
    });

    // Listen for the end of the stream
    newSocket.on('ai-response-end', () => {
      setIsTyping(false);
    });

    // Handle errors
    newSocket.on('error', (err) => {
      console.error("Socket Error:", err);
      setIsTyping(false);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = useCallback((messageText) => {
    if (!socket || !messageText.trim()) return;

    // 1. Update local UI immediately
    const userMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);

    // 2. FIXED: Send as an object { text: "..." } to match backend index.js
    socket.emit('ask-question', { text: messageText });
    
    setIsTyping(true);
  }, [socket]);

  return { messages, sendMessage, isTyping };
};