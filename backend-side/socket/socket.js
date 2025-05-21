import { Server } from "socket.io";
import { Message } from "../models/Chat.js";

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', async (socket) => {

    const recentMessages = await Message.find().sort({ timestamp: 1 }).limit(50);
    socket.emit('initial_message', recentMessages);

    socket.on('send_message', async (data) => {
      const message = new Message(data);
      const savedMessage = await message.save();

      socket.broadcast.emit('receive_message', savedMessage);
      socket.emit('receive_message', savedMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
