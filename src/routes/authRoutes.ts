import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// 1. Admin Login Endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'superbike_secret_key_2026',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
});

// 2. Initial Seed Admin Account Endpoint (Run once to create initial admin)
router.post('/register-seed-admin', async (req: Request, res: Response): Promise<void> => {
  try {
    const existingUser = await User.findOne({ username: 'admin' });
    if (existingUser) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const newAdmin = new User({
      username: 'admin',
      passwordHash: hashedPassword,
      name: 'Showroom Admin',
      email: 'admin@superbikes.com',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Initial Admin created! Username: admin, Password: admin123' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating seed admin', error });
  }
});

// 3. Change Admin Password Endpoint
router.put('/change-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
});

export default router;