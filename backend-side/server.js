import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import connectDB from "./config/DatabaseConnection.js";
import mainUserRoutes from './routes/mainUserRoutes.js'
import contactUserRoutes from './routes/contactUserRoutes.js'
import notesFeedRoutes from './routes/notesFeedRoutes.js'
import medicationRoutes from './routes/medicationRoutes.js';
import medicalRecordsRoutes from './routes/medicalRecordsRoutes.js';
import './jobs/autoDeleteMedications.js'
import symptomsRoutes from './routes/symptomRoutes.js';
const app = express();

// connection to db
connectDB();
dotenv.config()

app.use(cors());
app.use(express.json())

// routing 
app.use('/api/mainusers', mainUserRoutes);
app.use('/api/contactusers', contactUserRoutes)
app.use('/api/notesfeed', notesFeedRoutes)
app.use('/api', medicationRoutes);
app.use('/api/medicalrecords', medicalRecordsRoutes)
app.use('/api/symptoms', symptomsRoutes);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))