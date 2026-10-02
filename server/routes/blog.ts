import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { BlogPostItem } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Get blog posts
router.get('/', (req: Request, res: Response) => {
  const isInternal = req.query.all === 'true';
  const category = req.query.category as string;
  const search = req.query.search as string;

  let posts = db.getTable('blog_posts');

  if (!isInternal) {
    posts = posts.filter((p) => p.status === 'PUBLISHED');
  }

  if (category && category !== 'همه') {
    posts = posts.filter((p) => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  }

  res.json({ success: true, posts });
});

// PUBLIC: Get post by slug
router.get('/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = db.findOne<BlogPostItem>('blog_posts', (p) => p.slug === slug || p.id === slug);
  if (!post) return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
  res.json({ success: true, post });
});

// ADMIN: Create post
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const body = req.body;

    if (!body.title || !body.excerpt) {
      return res.status(400).json({ success: false, message: 'عنوان و چکیده مقاله الزامی است.' });
    }

    const newPost = await db.insert<BlogPostItem>('blog_posts', {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9آ-ی]/g, '-'),
      excerpt: body.excerpt,
      content: body.content || {
        intro: body.excerpt,
        sections: [],
        conclusion: '',
      },
      cover_image: body.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
      author_name: body.author_name || user.name,
      author_role: body.author_role || 'کارشناس محتوای وبنیک',
      author_avatar: body.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      category: body.category || 'طراحی سایت',
      tags: body.tags || ['طراحی وب', 'سئو'],
      read_time: body.read_time || '۵ دقیقه مطالعه',
      published_at: body.published_at || new Intl.DateTimeFormat('fa-IR').format(new Date()),
      status: body.status || 'PUBLISHED',
      seo_title: body.seo_title || body.title,
      seo_description: body.seo_description || body.excerpt,
      canonical_url: body.canonical_url || '',
      og_image: body.og_image || body.cover_image,
    });

    await db.logAudit(user.id, user.username, 'BLOG_CREATED', 'blog_posts', newPost.id, ip, `ایجاد مقاله جدید: ${newPost.title}`);

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد مقاله' });
  }
});

// ADMIN: Update post
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';

    const updated = await db.update<BlogPostItem>('blog_posts', id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });

    await db.logAudit(user.id, user.username, 'BLOG_UPDATED', 'blog_posts', id, ip, `ویرایش مقاله: ${updated.title}`);

    res.json({ success: true, post: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی مقاله' });
  }
});

// ADMIN: Delete post
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const post = db.findById<BlogPostItem>('blog_posts', id);
  if (!post) return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });

  await db.delete('blog_posts', id);
  await db.logAudit(user.id, user.username, 'BLOG_DELETED', 'blog_posts', id, ip, `حذف مقاله: ${post.title}`);

  res.json({ success: true, message: 'مقاله با موفقیت حذف شد' });
});

export default router;
