import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { FAQEntry } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get FAQs
router.get('/', (req: Request, res: Response) => {
  const isInternal = req.query.all === 'true';
  let faqs = db.getTable('faqs');

  if (!isInternal) {
    faqs = faqs.filter((f) => f.status === 'PUBLISHED');
  }

  faqs.sort((a, b) => a.display_order - b.display_order);
  res.json({ success: true, faqs });
});

// ADMIN: Create FAQ
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { question, answer, category, display_order, status } = req.body;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'سوال و پاسخ الزامی است.' });
  }

  const nextOrder = db.getTable('faqs').length + 1;
  const newFAQ = await db.insert<FAQEntry>('faqs', {
    question: question.trim(),
    answer: answer.trim(),
    category: category || 'عمومی',
    display_order: display_order || nextOrder,
    status: status || 'PUBLISHED',
  });

  await db.logAudit(user.id, user.username, 'FAQ_CREATED', 'faqs', newFAQ.id, ip, `افزودن پرسش و پاسخ جدید`);

  res.status(201).json({ success: true, faq: newFAQ });
});

// ADMIN: Update FAQ
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const updated = await db.update<FAQEntry>('faqs', id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'پرسش یافت نشد' });

  await db.logAudit(user.id, user.username, 'FAQ_UPDATED', 'faqs', id, ip, `ویرایش پرسش و پاسخ`);

  res.json({ success: true, faq: updated });
});

// ADMIN: Delete FAQ
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  await db.delete('faqs', id);
  await db.logAudit(user.id, user.username, 'FAQ_DELETED', 'faqs', id, ip, `حذف پرسش`);

  res.json({ success: true, message: 'پرسش با موفقیت حذف شد' });
});

export default router;
