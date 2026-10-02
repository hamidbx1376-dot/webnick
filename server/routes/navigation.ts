import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { NavigationItem } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get navigation items
router.get('/', (req: Request, res: Response) => {
  let navs = db.getTable('navigation_items');
  const isInternal = req.query.all === 'true';

  if (!isInternal) {
    navs = navs.filter((n) => n.is_visible);
  }

  navs.sort((a, b) => a.display_order - b.display_order);
  res.json({ success: true, navigation: navs });
});

// ADMIN: Create item
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { label, url, section_id, target_blank, display_order, is_visible } = req.body;
  if (!label || !url) return res.status(400).json({ success: false, message: 'عنوان و آدرس الزامی است.' });

  const nextOrder = db.getTable('navigation_items').length + 1;
  const newItem = await db.insert<NavigationItem>('navigation_items', {
    label,
    url,
    section_id: section_id || '',
    target_blank: target_blank || false,
    display_order: display_order || nextOrder,
    is_visible: is_visible ?? true,
  });

  res.status(201).json({ success: true, item: newItem });
});

// ADMIN: Update item
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = await db.update<NavigationItem>('navigation_items', id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'آیتم منو یافت نشد' });
  res.json({ success: true, item: updated });
});

// ADMIN: Reorder
router.patch('/reorder', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { orderMap } = req.body;
  if (!orderMap) return res.status(400).json({ success: false, message: 'داده نامعتبر است' });

  for (const [id, order] of Object.entries(orderMap)) {
    await db.update<NavigationItem>('navigation_items', id, { display_order: Number(order) });
  }

  res.json({ success: true, message: 'ترتیب منو ذخیره شد' });
});

// ADMIN: Delete item
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await db.delete('navigation_items', id);
  res.json({ success: true, message: 'آیتم حذف شد' });
});

export default router;
