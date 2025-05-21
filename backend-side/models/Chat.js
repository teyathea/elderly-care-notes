import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  name: String,
  timestamp: Date,
});

export const Message = mongoose.model('Message', messageSchema);