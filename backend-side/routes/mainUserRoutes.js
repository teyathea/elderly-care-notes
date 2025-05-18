import express from 'express';
import { registerUser, loginUser, getAllUsers} from '../controller/mainUserController.js';
const router = express.Router();

// registration 
router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/all-users', getAllUsers) // fetch all users

export default router