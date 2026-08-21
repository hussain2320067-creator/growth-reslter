import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require Admin privileges
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats - High-level metrics
router.get('/stats', (_req: AuthRequest, res: Response) => {
  const stats = db.getAdminStats();
  return res.json({ success: true, stats });
});

// GET /api/admin/users - User management
router.get('/users', (_req: AuthRequest, res: Response) => {
  const users = db.getUsers().map(u => {
    const { passwordHash: _, ...safeUser } = u;
    return safeUser;
  });
  return res.json({ success: true, users });
});

// PUT /api/admin/users/:id - Update user role / status
router.put('/users/:id', (req: AuthRequest, res: Response) => {
  const { role, name, phone } = req.body;
  const updated = db.updateUser(req.params.id, { role, name, phone });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { passwordHash: _, ...safeUser } = updated;
  return res.json({ success: true, message: 'User updated.', user: safeUser });
});

// DELETE /api/admin/users/:id - Remove user
router.delete('/users/:id', (req: AuthRequest, res: Response) => {
  if (req.user?.id === req.params.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
  }

  const deleted = db.deleteUser(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, message: 'User deleted.' });
});

export default router;
