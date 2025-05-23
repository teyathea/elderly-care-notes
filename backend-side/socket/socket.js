import { Server } from 'socket.io';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Message } from '../models/messages.js';

dotenv.config();

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error: No token'));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.user;
    const displayName = user.fullname || user.name || user.email || 'Unknown User';

    try {
      const allMessages = await Message.find({}).sort({ timestamp: 1 });
      socket.emit('initial_message', allMessages.map(msg => ({
        _id: msg._id,
        name: msg.name,
        email: msg.email,
        role: msg.role || "user",
        sender: msg.sender,
        text: msg.content,
        timestamp: msg.timestamp?.toISOString() || msg._id.getTimestamp().toISOString(),
      })));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }

    socket.on('send_message', async (data) => {
      if (!data.text?.trim()) return;

      const messageData = {
        name: displayName,
        role: user.role || "user",
        sender: socket.id,
        text: data.text.trim(),
        timestamp: new Date(),
      };

      io.emit('receive_message', messageData);

      try {
        await new Message({
          name: messageData.name,
          email: user.email,
          role: messageData.role,
          sender: messageData.sender,
          content: messageData.text,
          timestamp: messageData.timestamp,
        }).save();
      } catch (error) {
        console.error("Error saving message:", error);
      }

      socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      });
    

    });

    


  });
};

export default socketHandler;