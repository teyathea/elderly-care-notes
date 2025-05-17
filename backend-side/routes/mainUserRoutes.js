import express from 'express';
import { registerUser, loginUser} from '../controller/mainUserController.js';
const router = express.Router();

// registration 
router.post('/register', registerUser)

router.post('/login', loginUser)

export default router