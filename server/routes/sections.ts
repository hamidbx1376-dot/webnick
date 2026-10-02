import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { PageSection } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get sections
router.get('/', (req: Request, res: Response) => {
  const sections = db.getTable('page_sections');
  res.json({ success: true, sections });
});

// ADMIN: Update section
router.put('/:section_key', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { section_key } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';
  const { title, subtitle, eyebrow, content, is_active } = req.body;

  const section = db.findOne<PageSection>('page_sections', (s) => s.section_key === section_key);
  if (!section) return res.status(404).json({ success: false, message: 'بخش مورد نظر یافت نشد' });

  const updated = await db.update<PageSection>('page_sections', section.id, {
    title: title !== undefined ? title : section.title,
    subtitle: subtitle !== undefined ? subtitle : section.subtitle,
    eyebrow: eyebrow !== undefined ? eyebrow : section.eyebrow,
    content: content !== undefined ? { ...section.content, ...content } : section.content,
    is_active: is_active !== undefined ? is_active : section.is_active,
  });

  await db.logAudit(user.id, user.username, 'SECTION_UPDATED', 'page_sections', section.id, ip, `ویرایش محتوای بخش: ${section_key}`);

  res.json({ success: true, section: updated });
});

export default router;
