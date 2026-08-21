import { Router, Response } from 'express';
import { db } from '../db';
import { IContactMessage } from '../types';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/contact - Admin only
router.get('/', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response) => {
  const messages = db.getContactMessages();
  return res.json({ success: true, messages });
});

// POST /api/contact - Public contact submission
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, and message.' });
    }

    const newMsg: IContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Growth Realtors Inquiry',
      message: message.trim(),
      status: 'Unread',
      createdAt: new Date().toISOString()
    };

    const created = db.createContactMessage(newMsg);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Growth Realtors. Your message has been routed to our senior advisory team.',
      contactMessage: created
    });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit contact message.' });
  }
});

// PUT /api/contact/:id - Admin updates status
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const updated = db.updateContactMessage(req.params.id, { status });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  return res.json({ success: true, message: 'Message status updated.', contactMessage: updated });
});

// DELETE /api/contact/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteContactMessage(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }
  return res.json({ success: true, message: 'Message deleted.' });
});

export default router;
