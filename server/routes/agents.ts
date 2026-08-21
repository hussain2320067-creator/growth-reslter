import { Router, Response } from 'express';
import { db } from '../db';
import { IAgent } from '../types';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/agents
router.get('/', (_req, res) => {
  const agents = db.getAgents();
  return res.json({ success: true, agents });
});

// GET /api/agents/:id
router.get('/:id', (req, res) => {
  const agent = db.getAgentById(req.params.id);
  if (!agent) {
    return res.status(404).json({ success: false, message: 'Agent not found' });
  }

  // Also fetch properties handled by this agent
  const agentProperties = db.getProperties({ limit: 50 }).properties.filter(p => p.agentId === agent.id);

  return res.json({
    success: true,
    agent: {
      ...agent,
      properties: agentProperties
    }
  });
});

// POST /api/agents - Admin only
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, whatsapp, image, position, bio, experienceYears, specialization, socialLinks } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    const newAgent: IAgent = {
      id: `agent-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp || phone.trim(),
      image: image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      position: position || 'Real Estate Consultant',
      bio: bio || '',
      experienceYears: Number(experienceYears) || 5,
      specialization: specialization || 'Residential & Commercial Luxury',
      socialLinks: socialLinks || {},
      propertiesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };

    const created = db.createAgent(newAgent);
    return res.status(201).json({ success: true, message: 'Agent added successfully.', agent: created });
  } catch (error: any) {
    console.error('Agent creation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create agent.' });
  }
});

// PUT /api/agents/:id - Admin only
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const updated = db.updateAgent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Agent not found' });
  }
  return res.json({ success: true, message: 'Agent updated successfully.', agent: updated });
});

// DELETE /api/agents/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteAgent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Agent not found' });
  }
  return res.json({ success: true, message: 'Agent deleted.' });
});

export default router;
