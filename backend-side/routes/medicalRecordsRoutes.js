import express from 'express';
import { addMedicalRecord, getAllMedicalRecords, uploadFile } from '../controller/medicalRecordControllers.js';
import upload from '../config/cloudinary.js'; // use import instead of require // middleware

const router = express.Router();

router.get('/getAllRecords', getAllMedicalRecords);

router.post('/addRecord', addMedicalRecord);

// Upload route
router.post('/upload', upload.single('file'), uploadFile)

export default router;
