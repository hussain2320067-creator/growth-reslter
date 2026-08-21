import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// Import API Routers
import authRoutes from './server/routes/auth';
import propertiesRoutes from './server/routes/properties';
import favoritesRoutes from './server/routes/favorites';
import inquiriesRoutes from './server/routes/inquiries';
import viewingsRoutes from './server/routes/viewings';
import propertySubmissionsRoutes from './server/routes/propertySubmissions';
import contactRoutes from './server/routes/contact';
import agentsRoutes from './server/routes/agents';
import blogRoutes from './server/routes/blog';
import testimonialsRoutes from './server/routes/testimonials';
import adminRoutes from './server/routes/admin';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Growth Realtors API',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/properties', propertiesRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/inquiries', inquiriesRoutes);
  app.use('/api/viewings', viewingsRoutes);
  app.use('/api/property-submissions', propertySubmissionsRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/agents', agentsRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/testimonials', testimonialsRoutes);
  app.use('/api/admin', adminRoutes);

  // Global API Error Handler
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Growth Realtors] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Growth Realtors server:', err);
});
