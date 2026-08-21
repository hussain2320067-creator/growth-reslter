import { Router, Response } from 'express';
import { db } from '../db';
import { IPropertySubmission } from '../types';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/property-submissions - Admin gets all; User gets their own
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

  let submissions: IPropertySubmission[];
  if (req.user.role === 'admin') {
    submissions = db.getPropertySubmissions();
  } else {
    submissions = db.getPropertySubmissions(req.user.id);
  }

  return res.json({ success: true, submissions });
});

// POST /api/property-submissions - Owner submits property for sale/rent
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const {
      ownerName,
      email,
      phone,
      propertyAddress,
      city,
      propertyType,
      listingType,
      askingPrice,
      area,
      areaUnit,
      bedrooms,
      bathrooms,
      description,
      images
    } = req.body;

    if (!ownerName || !email || !phone || !propertyAddress || !askingPrice) {
      return res.status(400).json({ success: false, message: 'Please provide owner details, property address, and asking price.' });
    }

    const newSubmission: IPropertySubmission = {
      id: `sub-${Date.now()}`,
      userId: req.user?.id,
      ownerName: ownerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      propertyAddress: propertyAddress.trim(),
      city: city ? city.trim() : 'Islamabad',
      propertyType: propertyType || 'Villa',
      listingType: listingType || 'Buy',
      askingPrice: Number(askingPrice),
      area: Number(area) || 0,
      areaUnit: areaUnit || 'sq ft',
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      description: description ? description.trim() : '',
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const created = db.createPropertySubmission(newSubmission);

    return res.status(201).json({
      success: true,
      message: 'Property listing submitted successfully! Our luxury acquisitions team will review your submission and contact you within 24 business hours.',
      submission: created
    });
  } catch (error: any) {
    console.error('Property submission error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit property.' });
  }
});

// PUT /api/property-submissions/:id - Admin updates status (e.g. Approve & Convert to Live Listing)
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status, adminNotes, convertToListing } = req.body;
  const updated = db.updatePropertySubmission(req.params.id, { status, adminNotes });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }

  // If approved and admin wants to automatically publish as a property
  if (convertToListing && status === 'Approved') {
    const newProp = db.createProperty({
      id: `prop-${Date.now()}`,
      title: `${updated.propertyType} in ${updated.city} - ${updated.propertyAddress}`,
      slug: `property-${Date.now()}`,
      description: updated.description || `Exquisite ${updated.propertyType} located at ${updated.propertyAddress}, ${updated.city}.`,
      price: updated.askingPrice,
      priceUsd: Math.round(updated.askingPrice / 278),
      currency: 'PKR',
      location: `${updated.propertyAddress}, ${updated.city}`,
      address: updated.propertyAddress,
      city: updated.city,
      propertyType: updated.propertyType,
      listingType: updated.listingType,
      bedrooms: updated.bedrooms,
      bathrooms: updated.bathrooms,
      area: updated.area,
      areaUnit: updated.areaUnit,
      yearBuilt: new Date().getFullYear(),
      featuredImage: updated.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: updated.images,
      amenities: ['Gated Security', 'Electricity Backup', 'Modern Sanitary'],
      features: ['Prime Location', 'High Capital Growth Potential'],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-1',
      agentName: 'Tariq Malik',
      agentPhone: '+92 321 5550192',
      agentEmail: 'tariq.malik@growthrealtors.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Submission approved and published to live listings!',
      submission: updated,
      property: newProp
    });
  }

  return res.json({ success: true, message: 'Submission status updated.', submission: updated });
});

// DELETE /api/property-submissions/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deletePropertySubmission(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }
  return res.json({ success: true, message: 'Submission deleted.' });
});

export default router;
