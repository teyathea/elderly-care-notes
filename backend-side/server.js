import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import connectDB from "./config/DatabaseConnection.js";
import mainUserRoutes from './routes/mainUserRoutes.js';
import contactUserRoutes from './routes/contactUserRoutes.js';
import notesFeedRoutes from './routes/notesFeedRoutes.js';
import medicationRoutes from './routes/medicationRoutes.js';
import medicalRecordsRoutes from './routes/medicalRecordsRoutes.js';
import symptomsRoutes from './routes/symptomRoutes.js';

import { initializeSocket } from '../backend-side/socket/socket.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/mainusers', mainUserRoutes);
app.use('/api/contactusers', contactUserRoutes);
app.use('/api/notesfeed', notesFeedRoutes);
app.use('/api', medicationRoutes);
app.use('/api/medicalrecords', medicalRecordsRoutes);
app.use('/api/symptoms', symptomsRoutes);

const server = http.createServer(app);

// Initialize socket.io and pass the server instance
const io = initializeSocket(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
