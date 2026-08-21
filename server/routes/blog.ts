import { Router, Response } from 'express';
import { db } from '../db';
import { IBlogPost } from '../types';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/blog
router.get('/', (req, res) => {
  const category = req.query.category ? String(req.query.category) : undefined;
  const posts = db.getBlogPosts(category);
  return res.json({ success: true, posts });
});

// GET /api/blog/:slug
router.get('/:slug', (req, res) => {
  const post = db.getBlogPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  // Related posts from same category
  const related = db.getBlogPosts()
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return res.json({ success: true, post, related });
});

// POST /api/blog - Admin only
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags, readTime, authorName, authorRole, authorAvatar } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const newPost: IBlogPost = {
      id: `blog-${Date.now()}`,
      title: title.trim(),
      slug: `${generateSlug(title)}-${Math.random().toString(36).substr(2, 4)}`,
      content: content.trim(),
      excerpt: excerpt || content.substring(0, 160) + '...',
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: authorName || (req.user ? req.user.name : 'Growth Editorial Team'),
        role: authorRole || 'Senior Real Estate Analyst',
        avatar: authorAvatar || (req.user?.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80')
      },
      category: category || 'Market Trends',
      tags: Array.isArray(tags) ? tags : ['Real Estate', 'Luxury Living'],
      readTime: readTime || '5 min read',
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createBlogPost(newPost);
    return res.status(201).json({ success: true, message: 'Article published successfully.', post: created });
  } catch (error: any) {
    console.error('Blog creation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create article.' });
  }
});

// PUT /api/blog/:id - Admin only
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const updated = db.updateBlogPost(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }
  return res.json({ success: true, message: 'Article updated successfully.', post: updated });
});

// DELETE /api/blog/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteBlogPost(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }
  return res.json({ success: true, message: 'Article deleted.' });
});

export default router;
