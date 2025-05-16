import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer';

import ContactUser from '../models/ContactUser.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/invite', verifyAdmin, async (req, res) => {
    try {
        const { fullname, email, role} = req.body;

        const existing = await ContactUser.findOne({ email })
        if (existing) return res.status(400).json({ message: 'Contact already invited' })
        
        const invitationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3d'})

        const newContact = new ContactUser({
            fullname,
            email,
            role,
            created_by: req.user.id,
            invitationToken,
            isActive: false,
        });
        await newContact.save();

        const invitationLink = `http://localhost:8000/accept-invite?token=${invitationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Invitation to Elderly App',
            html: `<p>Hi ${fullname},</p>
                    <p>You are invited! Click the link to activate your account:</p>
                    <a href="${invitationLink}">${invitationLink}</a>`,
        });

        res.json({ message: 'Invitation sent'})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message})
    }
});

router.get('/verify-invite', async (req, res) => {
  const { token } = req.query;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const contact = await ContactUser.findOne({ email: payload.email, invitationToken: token });
    if (!contact) return res.status(400).json({ message: 'Invalid or expired token' });

    res.json({ fullname: contact.fullname, email: contact.email });
  } catch {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

router.post('/complete-signup', async (req, res) => {
    try {
        const { token, password } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const contact = await ContactUser.findOne({ email: payload.email, invitationToken: token })

        if (!contact) return res.status(400).json({ message: 'Invalid token'})
        if (contact.isActive) return res.status(400).json({ message: 'Account already activated' })

        const salt = await bcrypt.genSalt(10);
        contact.password = await bcrypt.hash(password, salt);
        contact.isActive = true;
        contact.invitationToken = null

        await contact.save()

        res.json({ message: 'Account activated'})
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token'})
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await ContactUser.findOne({ email });
        if (!user || !user.isActive) return res.status(400).json({ message: 'Invalid credential or inactive account'})

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(400).json({ message: 'Invalid credentials'})

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.json({ token, fullname: user.fullname, email: user.email})
    } catch (error) {
        res.status(500).json({ message: 'Server error'})
    }
})

export default router;
