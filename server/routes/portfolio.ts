import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { PortfolioProject } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get projects
router.get('/', (req: Request, res: Response) => {
  const isInternal = req.query.all === 'true';
  const category = req.query.category as string;
  let projects = db.getTable('portfolio_projects');

  if (!isInternal) {
    projects = projects.filter((p) => p.status === 'PUBLISHED');
  }

  if (category && category !== 'all') {
    projects = projects.filter((p) => p.category_key === category);
  }

  projects.sort((a, b) => a.display_order - b.display_order);
  res.json({ success: true, projects });
});

// ADMIN: Get Single Project
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const project = db.findById<PortfolioProject>('portfolio_projects', id);
  if (!project) return res.status(404).json({ success: false, message: 'پروژه یافت نشد' });
  res.json({ success: true, project });
});

// ADMIN: Create Project
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    if (!body.title || !body.category) {
      return res.status(400).json({ success: false, message: 'عنوان و دسته‌بندی پروژه الزامی است.' });
    }

    const projects = db.getTable('portfolio_projects');
    const nextOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.display_order)) + 1 : 1;

    const newProject = await db.insert<PortfolioProject>('portfolio_projects', {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9آ-ی]/g, '-'),
      client_name: body.client_name || '',
      category: body.category,
      category_key: body.category_key || 'corporate',
      short_description: body.short_description || '',
      full_description: body.full_description || '',
      cover_image: body.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
      gallery_images: body.gallery_images || [],
      project_url: body.project_url || '',
      tech_stack: body.tech_stack || ['React', 'TypeScript', 'Tailwind CSS'],
      results: body.results || ['افزایش ترافیک آنلاین', 'بهبود تجربه کاربری'],
      accent_color: body.accent_color || '#2563eb',
      preview_type: body.preview_type || 'building',
      year: body.year || '۱۴۰۴',
      display_order: body.display_order || nextOrder,
      is_featured: body.is_featured ?? true,
      status: body.status || 'PUBLISHED',
      seo_title: body.seo_title || body.title,
      seo_description: body.seo_description || body.short_description,
    });

    await db.logAudit(user.id, user.username, 'PORTFOLIO_CREATED', 'portfolio_projects', newProject.id, ip, `ایجاد نمونه‌کار جدید: ${newProject.title}`);

    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد نمونه‌کار' });
  }
});

// ADMIN: Update Project
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    const updated = await db.update<PortfolioProject>('portfolio_projects', id, body);
    if (!updated) return res.status(404).json({ success: false, message: 'پروژه یافت نشد' });

    await db.logAudit(user.id, user.username, 'PORTFOLIO_UPDATED', 'portfolio_projects', id, ip, `به‌روزرسانی نمونه‌کار: ${updated.title}`);

    res.json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی نمونه‌کار' });
  }
});

// ADMIN: Duplicate Project
router.post('/:id/duplicate', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const orig = db.findById<PortfolioProject>('portfolio_projects', id);
  if (!orig) return res.status(404).json({ success: false, message: 'پروژه یافت نشد' });

  const duplicated = await db.insert<PortfolioProject>('portfolio_projects', {
    ...orig,
    id: undefined,
    title: `${orig.title} (کپی)`,
    slug: `${orig.slug}-copy-${Date.now()}`,
    status: 'DRAFT',
  });

  await db.logAudit(user.id, user.username, 'PORTFOLIO_DUPLICATED', 'portfolio_projects', duplicated.id, ip, `کپی از نمونه‌کار ${orig.title}`);

  res.status(201).json({ success: true, project: duplicated });
});

// ADMIN: Delete Project
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const project = db.findById<PortfolioProject>('portfolio_projects', id);
  if (!project) return res.status(404).json({ success: false, message: 'پروژه یافت نشد' });

  await db.delete('portfolio_projects', id);
  await db.logAudit(user.id, user.username, 'PORTFOLIO_DELETED', 'portfolio_projects', id, ip, `حذف نمونه‌کار: ${project.title}`);

  res.json({ success: true, message: 'پروژه با موفقیت حذف شد' });
});

export default router;
