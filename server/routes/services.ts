import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { ServiceItem } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get all active services
router.get('/', (req: Request, res: Response) => {
  const isInternal = req.query.all === 'true';
  let services = db.getTable('services');

  if (!isInternal) {
    services = services.filter((s) => s.status === 'PUBLISHED');
  }

  services.sort((a, b) => a.display_order - b.display_order);
  res.json({ success: true, services });
});

// ADMIN: Get Single Service
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const service = db.findById<ServiceItem>('services', id);
  if (!service) return res.status(404).json({ success: false, message: 'خدمت یافت نشد' });
  res.json({ success: true, service });
});

// ADMIN: Create Service
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    if (!body.title || !body.short_desc) {
      return res.status(400).json({ success: false, message: 'عنوان و توضیح کوتاه الزامی است.' });
    }

    const services = db.getTable('services');
    const nextOrder = services.length > 0 ? Math.max(...services.map((s) => s.display_order)) + 1 : 1;

    const newService = await db.insert<ServiceItem>('services', {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9آ-ی]/g, '-'),
      short_desc: body.short_desc,
      long_desc: body.long_desc || '',
      icon_type: body.icon_type || 'code',
      deliverables: body.deliverables || [],
      duration: body.duration || '۳ الی ۵ هفته',
      category: body.category || 'طراحی وب',
      display_order: body.display_order || nextOrder,
      is_featured: body.is_featured ?? true,
      status: body.status || 'PUBLISHED',
      seo_title: body.seo_title || body.title,
      seo_description: body.seo_description || body.short_desc,
    });

    await db.logAudit(user.id, user.username, 'SERVICE_CREATED', 'services', newService.id, ip, `ایجاد خدمت جدید: ${newService.title}`);

    res.status(201).json({ success: true, service: newService });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد خدمت' });
  }
});

// ADMIN: Update Service
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    const updated = await db.update<ServiceItem>('services', id, body);
    if (!updated) return res.status(404).json({ success: false, message: 'خدمت یافت نشد' });

    await db.logAudit(user.id, user.username, 'SERVICE_UPDATED', 'services', id, ip, `به‌روزرسانی خدمت: ${updated.title}`);

    res.json({ success: true, service: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی خدمت' });
  }
});

// ADMIN: Duplicate Service
router.post('/:id/duplicate', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const orig = db.findById<ServiceItem>('services', id);
  if (!orig) return res.status(404).json({ success: false, message: 'خدمت یافت نشد' });

  const duplicated = await db.insert<ServiceItem>('services', {
    ...orig,
    id: undefined,
    title: `${orig.title} (کپی)`,
    slug: `${orig.slug}-copy-${Date.now()}`,
    display_order: orig.display_order + 1,
    status: 'DRAFT',
  });

  await db.logAudit(user.id, user.username, 'SERVICE_DUPLICATED', 'services', duplicated.id, ip, `کپی از خدمت ${orig.title}`);

  res.status(201).json({ success: true, service: duplicated });
});

// ADMIN: Reorder Services
router.patch('/reorder', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { orderMap } = req.body; // { [serviceId: string]: number }
  if (!orderMap) return res.status(400).json({ success: false, message: 'داده نامعتبر است' });

  for (const [id, order] of Object.entries(orderMap)) {
    await db.update<ServiceItem>('services', id, { display_order: Number(order) });
  }

  res.json({ success: true, message: 'ترتیب خدمات با موفقیت ذخیره شد.' });
});

// ADMIN: Delete Service
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const service = db.findById<ServiceItem>('services', id);
  if (!service) return res.status(404).json({ success: false, message: 'خدمت یافت نشد' });

  await db.delete('services', id);
  await db.logAudit(user.id, user.username, 'SERVICE_DELETED', 'services', id, ip, `حذف خدمت: ${service.title}`);

  res.json({ success: true, message: 'خدمت با موفقیت حذف شد' });
});

export default router;
