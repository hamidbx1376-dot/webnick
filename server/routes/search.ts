import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/search?q=...
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const query = ((req.query.q as string) || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, results: [] });
  }

  const results: Array<{
    type: 'lead' | 'message' | 'service' | 'portfolio' | 'blog' | 'faq' | 'media';
    typeLabel: string;
    title: string;
    subtitle: string;
    url: string;
  }> = [];

  // 1. Leads
  const leads = db.getTable('leads');
  leads.forEach((l) => {
    if (
      l.full_name.toLowerCase().includes(query) ||
      l.phone.includes(query) ||
      l.business_name.toLowerCase().includes(query)
    ) {
      results.push({
        type: 'lead',
        typeLabel: 'سرنخ مشاوره',
        title: l.full_name,
        subtitle: `${l.business_name || 'شخصی'} - ${l.requested_service}`,
        url: `/admin/leads?id=${l.id}`,
      });
    }
  });

  // 2. Services
  const services = db.getTable('services');
  services.forEach((s) => {
    if (s.title.toLowerCase().includes(query) || s.short_desc.toLowerCase().includes(query)) {
      results.push({
        type: 'service',
        typeLabel: 'خدمت',
        title: s.title,
        subtitle: s.short_desc,
        url: `/admin/services`,
      });
    }
  });

  // 3. Portfolio
  const projects = db.getTable('portfolio_projects');
  projects.forEach((p) => {
    if (p.title.toLowerCase().includes(query) || p.client_name.toLowerCase().includes(query)) {
      results.push({
        type: 'portfolio',
        typeLabel: 'نمونه‌کار',
        title: p.title,
        subtitle: p.client_name || p.category,
        url: `/admin/portfolio`,
      });
    }
  });

  // 4. Blog
  const posts = db.getTable('blog_posts');
  posts.forEach((p) => {
    if (p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query)) {
      results.push({
        type: 'blog',
        typeLabel: 'مقاله وبلاگ',
        title: p.title,
        subtitle: p.category,
        url: `/admin/blog`,
      });
    }
  });

  // 5. Messages
  const messages = db.getTable('contact_messages');
  messages.forEach((m) => {
    if (m.full_name.toLowerCase().includes(query) || m.message.toLowerCase().includes(query)) {
      results.push({
        type: 'message',
        typeLabel: 'پیام تماس',
        title: m.full_name,
        subtitle: m.subject,
        url: `/admin/messages`,
      });
    }
  });

  // 6. Media
  const media = db.getTable('media');
  media.forEach((m) => {
    if (m.title.toLowerCase().includes(query) || m.filename.toLowerCase().includes(query)) {
      results.push({
        type: 'media',
        typeLabel: 'رسانه',
        title: m.title,
        subtitle: m.filename,
        url: `/admin/media`,
      });
    }
  });

  res.json({ success: true, results: results.slice(0, 20) });
});

export default router;
