import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import ContactUser from '../models/ContactUser.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const inviteUser = async (req, res) => {
  try {
    const { fullname, email, role } = req.body;

    const existing = await ContactUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Contact already invited' });
    }

    const invitationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3d' });

    const newContact = new ContactUser({
      fullname,
      email,
      role,
      created_by: req.user.id,
      invitationToken,
      isActive: false,
    });

    await newContact.save();

    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite?token=${invitationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation to Elderly App',
      html: `
        <p>Hi ${fullname},</p>
        <p>You are invited! Click the link to activate your account:</p>
        <a href="${invitationLink}">${invitationLink}</a>
      `,
    });

    res.json({ message: 'Invitation sent' });
  } catch (error) {
    console.error('Invite error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const acceptInvite = async (req, res) => {
  const { token } = req.query;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const contact = await ContactUser.findOne({ email: payload.email, invitationToken: token });

    if (!contact) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (!contact.isActive) {
      contact.isActive = true;
      contact.invitationToken = null;
      await contact.save();
    }

    const loginToken = jwt.sign(
      { id: contact._id, role: contact.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token: loginToken,
      fullname: contact.fullname,
      email: contact.email,
      role: contact.role,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const getAllContactUsers = async (req, res) => {
  try {
    const users = await ContactUser.find({
      role: { $in: ['family', 'caregiver'] },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteContactUser = async (req, res) => {
  try {
    const deleted = await ContactUser.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

export const updateContactUser = async (req, res) => {
  try {
    const updated = await ContactUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};
