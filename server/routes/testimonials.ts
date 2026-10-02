import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { TestimonialItem } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get Testimonials
router.get('/', (req: Request, res: Response) => {
  const isInternal = req.query.all === 'true';
  let list = db.getTable('testimonials');

  if (!isInternal) {
    list = list.filter((t) => t.status === 'PUBLISHED');
  }

  list.sort((a, b) => a.display_order - b.display_order);
  res.json({ success: true, testimonials: list });
});

// ADMIN: Create Testimonial
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, role, company, quote, rating, avatar_url, avatar_color, display_order, is_featured, status } = req.body;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  if (!name || !quote) {
    return res.status(400).json({ success: false, message: 'نام مشتری و متن نظر الزامی است.' });
  }

  const nextOrder = db.getTable('testimonials').length + 1;
  const newTst = await db.insert<TestimonialItem>('testimonials', {
    name: name.trim(),
    role: (role || '').trim(),
    company: (company || '').trim(),
    quote: quote.trim(),
    rating: rating || 5,
    avatar_color: avatar_color || '#3b82f6',
    avatar_url: avatar_url || '',
    display_order: display_order || nextOrder,
    is_featured: is_featured ?? true,
    status: status || 'PUBLISHED',
  });

  await db.logAudit(user.id, user.username, 'TESTIMONIAL_CREATED', 'testimonials', newTst.id, ip, `ثبت نظر مشتری جدید: ${name}`);

  res.status(201).json({ success: true, testimonial: newTst });
});

// ADMIN: Update Testimonial
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const updated = await db.update<TestimonialItem>('testimonials', id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'نظر یافت نشد' });

  await db.logAudit(user.id, user.username, 'TESTIMONIAL_UPDATED', 'testimonials', id, ip, `ویرایش نظر مشتری: ${updated.name}`);

  res.json({ success: true, testimonial: updated });
});

// ADMIN: Delete Testimonial
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  await db.delete('testimonials', id);
  await db.logAudit(user.id, user.username, 'TESTIMONIAL_DELETED', 'testimonials', id, ip, `حذف نظر مشتری`);

  res.json({ success: true, message: 'نظر با موفقیت حذف شد' });
});

export default router;
