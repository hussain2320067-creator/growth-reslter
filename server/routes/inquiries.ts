import { Router, Response } from 'express';
import { db } from '../db';
import { IInquiry } from '../types';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/inquiries - Admin gets all; User gets their own
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

  let inquiries: IInquiry[];
  if (req.user.role === 'admin') {
    inquiries = db.getInquiries();
  } else {
    inquiries = db.getInquiries(req.user.id);
  }

  return res.json({ success: true, inquiries });
});

// POST /api/inquiries - Public / user submitted inquiry
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    if (!propertyId || !name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide property, name, email, and message.' });
    }

    const property = db.getPropertyById(propertyId) || db.getPropertyBySlug(propertyId);
    const propertyTitle = property ? property.title : 'General Property Inquiry';

    const newInquiry: IInquiry = {
      id: `inq-${Date.now()}`,
      userId: req.user?.id,
      propertyId: property ? property.id : propertyId,
      propertyTitle,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const created = db.createInquiry(newInquiry);

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our dedicated agent will contact you shortly.',
      inquiry: created
    });
  } catch (error: any) {
    console.error('Inquiry creation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
});

// PUT /api/inquiries/:id - Admin updates status or notes
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, adminNotes } = req.body;
  const updated = db.updateInquiry(req.params.id, { status, adminNotes });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  return res.json({ success: true, message: 'Inquiry updated successfully.', inquiry: updated });
});

// DELETE /api/inquiries/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteInquiry(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  return res.json({ success: true, message: 'Inquiry deleted.' });
});

export default router;
