import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/favorites - Get current user's favorite properties
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = db.findUserById(req.user.id);
  const favoriteIds = user?.favorites || [];

  const properties = favoriteIds
    .map(id => db.getPropertyById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return res.json({
    success: true,
    favorites: favoriteIds,
    properties
  });
});

// POST /api/favorites/:propertyId - Toggle favorite
router.post('/:propertyId', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const propertyId = req.params.propertyId;
  const property = db.getPropertyById(propertyId) || db.getPropertyBySlug(propertyId);

  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const result = db.toggleFavorite(req.user.id, property.id);

  return res.json({
    success: true,
    message: result.isFavorite ? 'Property saved to your favorites.' : 'Property removed from your favorites.',
    isFavorite: result.isFavorite,
    favorites: result.favorites
  });
});

// DELETE /api/favorites/:propertyId
router.delete('/:propertyId', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const propertyId = req.params.propertyId;
  const property = db.getPropertyById(propertyId) || db.getPropertyBySlug(propertyId);
  const targetId = property ? property.id : propertyId;

  const user = db.findUserById(req.user.id);
  if (user) {
    user.favorites = (user.favorites || []).filter(id => id !== targetId);
    db.updateUser(user.id, { favorites: user.favorites });
  }

  return res.json({
    success: true,
    message: 'Removed from favorites.',
    favorites: user?.favorites || []
  });
});

export default router;
