import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/audit-logs
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { action, search, page = '1', limit = '30' } = req.query;
  let logs = db.getTable('audit_logs');

  if (action && action !== 'ALL') {
    logs = logs.filter((l) => l.action === action);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    logs = logs.filter((l) => l.details.toLowerCase().includes(q) || l.username.toLowerCase().includes(q) || l.action.toLowerCase().includes(q));
  }

  const total = logs.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 30;
  const startIndex = (pageNum - 1) * limitNum;

  res.json({
    success: true,
    logs: logs.slice(startIndex, startIndex + limitNum),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  });
});

export default router;
