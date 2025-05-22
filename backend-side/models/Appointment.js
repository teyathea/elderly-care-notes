import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainUser' // The user to whom the appointment is assigned
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainUser', // The creator of the appointment
    required: true
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

export default mongoose.model('Appointments', appointmentSchema);