import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import MainUser from '../models/MainUser.js';

export const registerAdmin = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existing = await MainUser.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newAdmin = new MainUser({
      fullname,
      email,
      password: hashed,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await MainUser.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, fullname: user.fullname },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
