import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db/database';

// Import route modules
import authRoutes from './server/routes/auth';
import leadsRoutes from './server/routes/leads';
import messagesRoutes from './server/routes/messages';
import servicesRoutes from './server/routes/services';
import portfolioRoutes from './server/routes/portfolio';
import blogRoutes from './server/routes/blog';
import faqsRoutes from './server/routes/faqs';
import testimonialsRoutes from './server/routes/testimonials';
import mediaRoutes from './server/routes/media';
import sectionsRoutes from './server/routes/sections';
import navigationRoutes from './server/routes/navigation';
import settingsRoutes from './server/routes/settings';
import seoRoutes from './server/routes/seo';
import analyticsRoutes from './server/routes/analytics';
import usersRoutes from './server/routes/users';
import auditLogsRoutes from './server/routes/auditLogs';
import notificationsRoutes from './server/routes/notifications';
import searchRoutes from './server/routes/search';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Ensure uploads directory exists and is served statically
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Serve static assets from public/files (logo, hero, footer, etc.)
  const filesDir = path.resolve(process.cwd(), 'public/files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }
  app.use('/files', express.static(filesDir));

  // Dynamic robots.txt
  app.get('/robots.txt', (req, res) => {
    const seo = db.getTable('seo_settings');
    res.type('text/plain');
    res.send(seo.robots_content || 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://webnick.ir/sitemap.xml');
  });

  // Dynamic sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    const posts = db.getTable('blog_posts').filter((p) => p.status === 'PUBLISHED');
    const projects = db.getTable('portfolio_projects').filter((p) => p.status === 'PUBLISHED');
    const services = db.getTable('services').filter((s) => s.status === 'PUBLISHED');

    const urls = [
      'https://webnick.ir/',
      'https://webnick.ir/#services',
      'https://webnick.ir/#portfolio',
      'https://webnick.ir/#about',
      'https://webnick.ir/blog',
      ...services.map((s) => `https://webnick.ir/services/${s.slug}`),
      ...projects.map((p) => `https://webnick.ir/portfolio/${p.slug}`),
      ...posts.map((p) => `https://webnick.ir/blog/${p.slug}`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });

  // Mount API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadsRoutes);
  app.use('/api/messages', messagesRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/faqs', faqsRoutes);
  app.use('/api/testimonials', testimonialsRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/sections', sectionsRoutes);
  app.use('/api/navigation', navigationRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/seo', seoRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/audit-logs', auditLogsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/search', searchRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      time: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0',
    });
  });

  // Frontend integration: Vite in development, static in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Webnick Server] Running on http://localhost:${PORT}`);
    console.log(`[Webnick Server] Admin panel accessible at http://localhost:${PORT}/admin`);
  });
}

startServer().catch((err) => {
  console.error('[Webnick Server] Startup error:', err);
  process.exit(1);
});
