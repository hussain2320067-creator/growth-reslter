import { Router, Response } from 'express';
import { db } from '../db';
import { IProperty } from '../types';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/properties/featured
router.get('/featured', (_req, res) => {
  const featured = db.getFeaturedProperties(6);
  return res.json({ success: true, properties: featured });
});

// GET /api/properties/search - Quick autocomplete / keyword search
router.get('/search', (req, res) => {
  const q = req.query.q ? String(req.query.q) : '';
  const result = db.getProperties({ search: q, limit: 8 });
  return res.json({ success: true, properties: result.properties });
});

// GET /api/properties
router.get('/', (req, res) => {
  const {
    search,
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    status,
    isFeatured,
    sort,
    page,
    limit
  } = req.query;

  const result = db.getProperties({
    search: search ? String(search) : undefined,
    city: city ? String(city) : undefined,
    propertyType: propertyType ? String(propertyType) : undefined,
    listingType: listingType ? String(listingType) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    bathrooms: bathrooms ? Number(bathrooms) : undefined,
    minArea: minArea ? Number(minArea) : undefined,
    status: status ? String(status) : undefined,
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
    sort: sort ? String(sort) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12
  });

  return res.json({
    success: true,
    ...result
  });
});

// GET /api/properties/:id (or slug)
router.get('/:id', (req, res) => {
  const property = db.getPropertyBySlug(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  return res.json({ success: true, property });
});

// POST /api/properties (Admin only)
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      priceUsd,
      currency,
      location,
      address,
      city,
      propertyType,
      listingType,
      bedrooms,
      bathrooms,
      area,
      areaUnit,
      yearBuilt,
      images,
      featuredImage,
      amenities,
      features,
      status,
      isFeatured,
      agentId,
      videoTourUrl,
      floorPlanUrl,
      coordinates
    } = req.body;

    if (!title || !price || !location || !city || !propertyType || !listingType) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    const agent = agentId ? db.getAgentById(agentId) : undefined;

    const newProperty: IProperty = {
      id: `prop-${Date.now()}`,
      title: title.trim(),
      slug: `${generateSlug(title)}-${Math.random().toString(36).substr(2, 4)}`,
      description: description || '',
      price: Number(price),
      priceUsd: priceUsd ? Number(priceUsd) : Math.round(Number(price) / 278),
      currency: currency || 'PKR',
      location: location.trim(),
      address: address ? address.trim() : location.trim(),
      city: city.trim(),
      propertyType,
      listingType,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area: Number(area) || 0,
      areaUnit: areaUnit || 'sq ft',
      yearBuilt: Number(yearBuilt) || new Date().getFullYear(),
      images: Array.isArray(images) && images.length > 0 ? images : [
        featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      featuredImage: featuredImage || (Array.isArray(images) && images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      amenities: Array.isArray(amenities) ? amenities : [],
      features: Array.isArray(features) ? features : [],
      status: status || 'Available',
      isFeatured: Boolean(isFeatured),
      agentId: agentId || (agent ? agent.id : 'agent-1'),
      agentName: agent ? agent.name : 'Growth Realtors Concierge',
      agentPhone: agent ? agent.phone : '+92 51 8899770',
      agentEmail: agent ? agent.email : 'contact@growthrealtors.com',
      agentImage: agent ? agent.image : undefined,
      videoTourUrl,
      floorPlanUrl,
      coordinates: coordinates || { lat: 33.7294, lng: 73.0768 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createProperty(newProperty);
    return res.status(201).json({ success: true, message: 'Property created successfully.', property: created });
  } catch (error: any) {
    console.error('Create property error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create property.' });
  }
});

// PUT /api/properties/:id (Admin only)
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.id;
    const existing = db.getPropertyById(propertyId) || db.getPropertyBySlug(propertyId);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const updates = { ...req.body };
    if (updates.title && updates.title !== existing.title) {
      updates.slug = `${generateSlug(updates.title)}-${existing.id.replace('prop-', '')}`;
    }

    if (updates.agentId) {
      const agent = db.getAgentById(updates.agentId);
      if (agent) {
        updates.agentName = agent.name;
        updates.agentPhone = agent.phone;
        updates.agentEmail = agent.email;
        updates.agentImage = agent.image;
      }
    }

    const updated = db.updateProperty(existing.id, updates);
    return res.json({ success: true, message: 'Property updated successfully.', property: updated });
  } catch (error: any) {
    console.error('Update property error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update property.' });
  }
});

// DELETE /api/properties/:id (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const propertyId = req.params.id;
  const existing = db.getPropertyById(propertyId) || db.getPropertyBySlug(propertyId);

  if (!existing) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  db.deleteProperty(existing.id);
  return res.json({ success: true, message: 'Property deleted successfully.' });
});

export default router;
