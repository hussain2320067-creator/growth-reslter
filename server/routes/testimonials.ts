import { Router, Response } from 'express';
import { db } from '../db';
import { ITestimonial } from '../types';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/testimonials
router.get('/', (_req, res) => {
  const testimonials = db.getTestimonials();
  return res.json({ success: true, testimonials });
});

// POST /api/testimonials - Admin only
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { clientName, clientTitle, clientImage, rating, review, propertyType, location, transactionType } = req.body;

    if (!clientName || !review) {
      return res.status(400).json({ success: false, message: 'Client name and review are required.' });
    }

    const newTestimonial: ITestimonial = {
      id: `test-${Date.now()}`,
      clientName: clientName.trim(),
      clientTitle: clientTitle || 'Verified Client',
      clientImage: clientImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: Number(rating) || 5,
      review: review.trim(),
      propertyType: propertyType || 'Luxury Property Transaction',
      location: location || 'Islamabad',
      transactionType: transactionType || 'Bought',
      createdAt: new Date().toISOString()
    };

    const created = db.createTestimonial(newTestimonial);
    return res.status(201).json({ success: true, message: 'Testimonial added.', testimonial: created });
  } catch (error: any) {
    console.error('Testimonial create error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add testimonial.' });
  }
});

// PUT /api/testimonials/:id - Admin only
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const updated = db.updateTestimonial(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  return res.json({ success: true, message: 'Testimonial updated.', testimonial: updated });
});

// DELETE /api/testimonials/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteTestimonial(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  return res.json({ success: true, message: 'Testimonial deleted.' });
});

export default router;
