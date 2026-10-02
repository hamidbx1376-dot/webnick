import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { NotificationItem } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/notifications
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const notifs = db.getTable('notifications');
  const unreadCount = notifs.filter((n) => !n.is_read).length;
  res.json({ success: true, notifications: notifs.slice(0, 30), unreadCount });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await db.update<NotificationItem>('notifications', id, { is_read: true });
  res.json({ success: true });
});

// POST /api/notifications/read-all
router.post('/read-all', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const notifs = db.getTable('notifications');
  const updated = notifs.map((n) => ({ ...n, is_read: true }));
  await db.setTable('notifications', updated);
  res.json({ success: true });
});

export default router;
