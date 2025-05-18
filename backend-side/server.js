import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import connectDB from "./config/DatabaseConnection.js";
import mainUserRoutes from './routes/mainUserRoutes.js'
import contactUserRoutes from './routes/contactUserRoutes.js'
import notesFeedRoutes from './routes/notesFeedRoutes.js'

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


const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))