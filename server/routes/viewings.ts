import { Router, Response } from 'express';
import { db } from '../db';
import { IViewingRequest } from '../types';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/viewings - Admin gets all; User gets their own
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

  let viewings: IViewingRequest[];
  if (req.user.role === 'admin') {
    viewings = db.getViewingRequests();
  } else {
    viewings = db.getViewingRequests(req.user.id);
  }

  return res.json({ success: true, viewings });
});

// POST /api/viewings - Schedule a property viewing
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, name, email, phone, date, time, message } = req.body;

    if (!propertyId || !name || !email || !phone || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please provide property, name, email, phone, date, and preferred time.' });
    }

    const property = db.getPropertyById(propertyId) || db.getPropertyBySlug(propertyId);
    const propertyTitle = property ? property.title : 'Property Viewing';

    const newViewing: IViewingRequest = {
      id: `vr-${Date.now()}`,
      userId: req.user?.id,
      propertyId: property ? property.id : propertyId,
      propertyTitle,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date,
      time,
      message: message ? message.trim() : '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const created = db.createViewingRequest(newViewing);

    return res.status(201).json({
      success: true,
      message: 'Viewing request received. Our property specialist will confirm your private walkthrough appointment.',
      viewing: created
    });
  } catch (error: any) {
    console.error('Viewing request creation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit viewing request.' });
  }
});

// PUT /api/viewings/:id - Admin updates status
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, adminNotes } = req.body;
  const updated = db.updateViewingRequest(req.params.id, { status, adminNotes });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Viewing request not found' });
  }

  return res.json({ success: true, message: 'Viewing request updated.', viewing: updated });
});

// DELETE /api/viewings/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteViewingRequest(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Viewing request not found' });
  }
  return res.json({ success: true, message: 'Viewing request deleted.' });
});

export default router;
