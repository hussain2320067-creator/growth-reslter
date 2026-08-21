import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { IUser } from '../types';
import { authenticateToken, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Sanitize user object to never return password hash
function sanitizeUser(user: IUser) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: IUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: phone ? phone.trim() : '',
      role: (role === 'admin' || role === 'agent') ? role : 'user',
      favorites: [],
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: sanitizeUser(user)
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  return res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
});

// PUT /api/auth/update-profile
router.put('/update-profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, phone, profileImage, password } = req.body;
    const updates: Partial<IUser> = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (profileImage !== undefined) updates.profileImage = profileImage;

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password.trim(), salt);
    }

    const updatedUser = db.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUser(updatedUser)
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'No registered account found with that email address.' });
  }

  return res.json({
    success: true,
    message: 'Password reset link has been dispatched to your email address (Simulated in development mode).'
  });
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
