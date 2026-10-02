import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { SiteSettings } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get settings
router.get('/', (req: Request, res: Response) => {
  const settings = db.getTable('site_settings');
  res.json({ success: true, settings });
});

// ADMIN: Update settings
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    const current = db.getTable('site_settings');
    const updated = {
      ...current,
      ...body,
      updated_at: new Date().toISOString(),
    };

    await db.setTable('site_settings', updated);
    await db.logAudit(user.id, user.username, 'SETTINGS_UPDATED', 'site_settings', 'main', ip, 'به‌روزرسانی تنظیمات عمومی وب‌سایت');

    res.json({ success: true, settings: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ذخیره تنظیمات' });
  }
});

export default router;
