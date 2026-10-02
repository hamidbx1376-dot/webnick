import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { SEOSettings } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/seo
router.get('/', (req: Request, res: Response) => {
  const seo = db.getTable('seo_settings');
  res.json({ success: true, seo });
});

// PUT /api/seo
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    const current = db.getTable('seo_settings');
    const updated = {
      ...current,
      ...body,
      updated_at: new Date().toISOString(),
    };

    await db.setTable('seo_settings', updated);
    await db.logAudit(user.id, user.username, 'SEO_UPDATED', 'seo_settings', 'global', ip, 'به‌روزرسانی تنظیمات سئو و متاتگ‌ها');

    res.json({ success: true, seo: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ذخیره سئو' });
  }
});

export default router;
