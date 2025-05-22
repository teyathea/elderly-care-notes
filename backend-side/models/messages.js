import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
  },
  role: {
    type: String,
  },
  sender: {
    type: String,
    required: [true, "Sender is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model('Message', messageSchema);
