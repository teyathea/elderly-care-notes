import express from 'express';
import { inviteUser, acceptInvite, getAllContactUsers, deleteContactUser, updateContactUser } from '../controller/contactUserControllers.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/invite', authMiddleware, inviteUser);
router.get('/accept-invite', acceptInvite);
router.get('/', authMiddleware, getAllContactUsers);
router.delete('/:id', authMiddleware, deleteContactUser);
router.put('/:id', authMiddleware, updateContactUser)


export default router;
