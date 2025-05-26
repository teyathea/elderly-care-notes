import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';

import connectDB from "./config/DatabaseConnection.js";
import mainUserRoutes from './routes/mainUserRoutes.js'
import contactUserRoutes from './routes/contactUserRoutes.js'
import notesFeedRoutes from './routes/notesFeedRoutes.js'
import medicationRoutes from './routes/medicationRoutes.js';
import medicalRecordsRoutes from './routes/medicalRecordsRoutes.js';
import profileSettingsRoutes from './routes/profileSettingsRoutes.js';
import symptomsRoutes from './routes/symptomRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import patientsRoutes from './routes/patientsRoutes.js';

import './jobs/autoDeleteMedications.js'
import socketHandler from './socket/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // create an HTTP server using the express app

// connection to db
connectDB();

app.use(cors());
app.use(express.json())

// routing 
app.use('/api/mainusers', mainUserRoutes);
app.use('/api/contactusers', contactUserRoutes)
app.use('/api/notesfeed', notesFeedRoutes)
app.use('/api', medicationRoutes);
app.use('/api/medicalrecords', medicalRecordsRoutes)
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/profilesettings', profileSettingsRoutes )
app.use('/api/chatRoom', chatRoutes)

app.use('/api/patient', patientsRoutes)

// initialize socket.io and pass the server instance
socketHandler(server);

const PORT = process.env.PORT || 8000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))