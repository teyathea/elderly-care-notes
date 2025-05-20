import express from 'express'; // for routing

const router = express.Router()

router.post('/addmedicalrecord', addMedicalRecord)

export default router