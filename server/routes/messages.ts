import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { ContactMessage } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Submit Contact Message
router.post('/', async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    if (!full_name || (!email && !phone) || !message) {
      return res.status(400).json({
        success: false,
        message: 'لطفاً نام، حداقل یک راه ارتباطی (ایمیل یا شماره تلفن) و پیام خود را وارد نمایید.',
      });
    }

    const newMessage = await db.insert<ContactMessage>('contact_messages', {
      full_name: full_name.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'پیام از فرم تماس با ما').trim(),
      message: message.trim(),
      ip_address: ip,
      is_read: false,
      is_replied: false,
      status: 'ACTIVE',
    });

    // Notify Admin
    await db.createNotification(
      'پیام جدید از فرم تماس',
      `${full_name} پیامی با موضوع «${newMessage.subject}» ارسال کرد.`,
      'MESSAGE',
      'messages',
      newMessage.id
    );

    await db.logAudit('visitor', 'guest', 'MESSAGE_SUBMITTED', 'messages', newMessage.id, ip, `ارسال پیام تماس توسط ${full_name}`);

    return res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ارسال شد. تیم وبنیک در کوتاه‌ترین زمان پاسخگوی شما خواهد بود.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'خطای سرور در ارسال پیام' });
  }
});

// ADMIN: Get messages
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { status = 'ACTIVE' } = req.query;
  let list = db.getTable('contact_messages');

  if (status !== 'ALL') {
    list = list.filter((m) => m.status === status);
  }

  const unreadCount = list.filter((m) => !m.is_read).length;

  res.json({
    success: true,
    messages: list,
    unreadCount,
    total: list.length,
  });
});

// ADMIN: Mark as Read
router.patch('/:id/read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = await db.update<ContactMessage>('contact_messages', id, { is_read: true });
  res.json({ success: true, message: updated });
});

// ADMIN: Mark as Replied
router.patch('/:id/reply', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = await db.update<ContactMessage>('contact_messages', id, { is_replied: true, is_read: true });
  res.json({ success: true, message: updated });
});

// ADMIN: Delete Message
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await db.delete('contact_messages', id);
  res.json({ success: true, message: 'پیام حذف شد' });
});

export default router;
