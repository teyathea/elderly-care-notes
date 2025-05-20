import express from 'express';
import { getSymptoms, createSymptom, deleteSymptom, getSymptomTrends } from '../controller/symptomController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getSymptoms);
router.post('/', authMiddleware, createSymptom);
router.get('/trends', authMiddleware, getSymptomTrends); // for charts
router.delete('/:id', authMiddleware, deleteSymptom);

export default router;
