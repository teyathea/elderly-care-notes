import express from 'express';

import { inviteUser , verifyInvite, completeSignup, loginContactUser } from '../controller/contactUser.js';
const router = express.Router()



router.post('/invite', inviteUser)

router.get('/verify-invite', verifyInvite)

router.post('/complete-signup', completeSignup)

router.post('/login', loginContactUser)

export default router;
