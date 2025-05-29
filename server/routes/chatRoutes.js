import express from 'express';
import { ChatRoom } from '../models/ChatRoom.js';
import MainUser from '../models/MainUser.js';
import ContactUser from '../models/ContactUser.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/', verifyToken, async (req, res) => {
  const { contactId } = req.body;
  const adminId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid IDs' });
  }

  try {
    // Verify that the admin exists and the contact user is associated with them
    const admin = await MainUser.findById(adminId);
    const contactUser = await ContactUser.findById(contactId);

    if (!admin || !contactUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!admin.contactUsers.includes(contactId)) {
      return res.status(403).json({ message: 'Contact user not associated with this admin' });
    }

    const roomId = `${adminId}_${contactId}`;

    let chatRoom = await ChatRoom.findOne({ roomId });
    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        roomId,
        name: `Room ${roomId}`,
        adminId,
        participants: [adminId, contactId]
      });
    }
    res.json({ roomId });
  } catch (err) {
    console.error('Error creating chat room:', err);
    res.status(500).json({ message: 'Error creating chat room' });
  }
});

// Get all chat rooms for the current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let chatRooms;
    if (userRole === 'admin') {
      // If admin, get all rooms where they are the admin
      chatRooms = await ChatRoom.find({ adminId: userId });
    } else {
      // If contact user, get all rooms where they are a participant
      chatRooms = await ChatRoom.find({ participants: userId });
    }

    res.json(chatRooms);
  } catch (err) {
    console.error('Error fetching chat rooms:', err);
    res.status(500).json({ message: 'Error fetching chat rooms' });
  }
});

export default router;
