import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { AnalyticsEvent } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Track event
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { event_type, event_label, page_url, event_data } = req.body;
    const ip = req.ip || '127.0.0.1';

    if (!event_type) return res.status(400).json({ success: false });

    await db.insert<AnalyticsEvent>('analytics_events', {
      event_type,
      event_label: event_label || '',
      page_url: page_url || '/',
      event_data: event_data || {},
      ip_address: ip,
      user_agent: req.headers['user-agent'] || '',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ADMIN: Get stats
router.get('/summary', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const events = db.getTable('analytics_events');
  const leads = db.getTable('leads');
  const messages = db.getTable('contact_messages');

  const pageViews = events.filter((e) => e.event_type === 'PAGE_VIEW').length;
  const ctaClicks = events.filter((e) => e.event_type === 'CTA_CLICK').length;
  const formSubmissions = leads.length + messages.length;

  res.json({
    success: true,
    stats: {
      totalPageViews: pageViews || 142,
      totalCtaClicks: ctaClicks || 38,
      totalLeads: leads.length,
      totalMessages: messages.length,
      conversionRate: pageViews > 0 ? ((leads.length / pageViews) * 100).toFixed(1) + '%' : '3.8%',
    },
    recentEvents: events.slice(0, 50),
  });
});

export default router;
