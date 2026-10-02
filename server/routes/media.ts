import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db/database';
import { MediaFile, MediaFolder } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    cb(null, `${safeBase}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فرمت فایل مجاز نیست. تنها فرمت‌های تصویری و PDF پشتیبانی می‌شوند.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
});

// GET /api/media
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { folder_id, search } = req.query;
  let mediaList = db.getTable('media');
  const folders = db.getTable('media_folders');

  if (folder_id && folder_id !== 'ALL') {
    mediaList = mediaList.filter((m) => m.folder_id === folder_id);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    mediaList = mediaList.filter((m) => m.title.toLowerCase().includes(q) || m.filename.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    media: mediaList,
    folders,
    total: mediaList.length,
  });
});

// POST /api/media/upload
router.post('/upload', authenticateToken, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';
    const { folder_id, alt_text, title } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: 'هیچ فایلی انتخاب نشده است.' });
    }

    const publicUrl = `/uploads/${file.filename}`;

    const newMedia = await db.insert<MediaFile>('media', {
      filename: file.filename,
      original_name: file.originalname,
      url: publicUrl,
      mime_type: file.mimetype,
      file_size: file.size,
      folder_id: folder_id || null,
      alt_text: alt_text || file.originalname,
      title: title || file.originalname,
    });

    await db.logAudit(user.id, user.username, 'MEDIA_UPLOADED', 'media', newMedia.id, ip, `بارگذاری فایل: ${file.originalname}`);

    res.status(201).json({ success: true, media: newMedia });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'خطا در بارگذاری فایل' });
  }
});

// POST /api/media/external (Add external media URL)
router.post('/external', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url, title, alt_text, mime_type, folder_id } = req.body;
    const user = req.user!;
    const ip = req.ip || '127.0.0.1';

    if (!url || !title) {
      return res.status(400).json({ success: false, message: 'آدرس و عنوان فایل الزامی است.' });
    }

    const filename = path.basename(url.split('?')[0]);

    const newMedia = await db.insert<MediaFile>('media', {
      filename,
      original_name: filename,
      url,
      mime_type: mime_type || 'image/webp',
      file_size: 0,
      folder_id: folder_id || null,
      alt_text: alt_text || title,
      title,
    });

    await db.logAudit(user.id, user.username, 'MEDIA_EXTERNAL_ADDED', 'media', newMedia.id, ip, `افزودن مدیا خارجی: ${title}`);

    res.status(201).json({ success: true, media: newMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در افزودن مدیا' });
  }
});

// DELETE /api/media/:id
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || '127.0.0.1';

  const media = db.findById<MediaFile>('media', id);
  if (!media) return res.status(404).json({ success: false, message: 'فایل یافت نشد' });

  // If local file, delete from disk
  if (media.url.startsWith('/uploads/')) {
    const filePath = path.join(UPLOADS_DIR, media.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error deleting local file:', e);
      }
    }
  }

  await db.delete('media', id);
  await db.logAudit(user.id, user.username, 'MEDIA_DELETED', 'media', id, ip, `حذف فایل: ${media.filename}`);

  res.json({ success: true, message: 'فایل با موفقیت حذف شد.' });
});

// POST /api/media/folders
router.post('/folders', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, parent_id } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'نام پوشه الزامی است.' });

  const newFolder = await db.insert<MediaFolder>('media_folders', {
    name: name.trim(),
    parent_id: parent_id || null,
  });

  res.status(201).json({ success: true, folder: newFolder });
});

export default router;
