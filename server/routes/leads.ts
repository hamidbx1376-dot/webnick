import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { Lead, LeadNote, LeadActivity } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// PUBLIC: Submit Free Consultation Form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, business_name, business_type, requested_service, budget, message, source } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'لطفاً نام و نام خانوادگی و شماره تماس خود را وارد نمایید.',
      });
    }

    // Determine initial priority based on budget or request
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    if (budget && (budget.includes('۸۰') || budget.includes('۱۰۰') || budget.includes('اختصاصی'))) {
      priority = 'HIGH';
    }

    const newLead = await db.insert<Lead>('leads', {
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      business_name: (business_name || '').trim(),
      business_type: (business_type || '').trim(),
      requested_service: requested_service || 'طراحی سایت اختصاصی',
      budget: budget || 'مشاوره و ارزیابی اولیه',
      message: (message || '').trim(),
      source: source || 'public_form',
      status: 'NEW',
      priority,
      assigned_to: 'admin',
      follow_up_date: null,
      notes_count: 0,
    });

    // Record initial activity
    await db.insert<LeadActivity>('lead_activities', {
      lead_id: newLead.id,
      user_id: 'system',
      user_name: 'فرم سایت',
      action_type: 'CREATED',
      description: `سرنخ جدید توسط کاربر ${full_name} (${requested_service}) ثبت شد.`,
    });

    // Create Notification for Admin
    await db.createNotification(
      'سرنخ جدید ثبت شد',
      `${full_name} درخواست مشاوره برای «${requested_service}» ارسال کرد.`,
      'LEAD',
      'leads',
      newLead.id
    );

    await db.logAudit('visitor', 'guest', 'LEAD_CREATED', 'leads', newLead.id, ip, `ثبت سرنخ مشاوره جدید توسط ${full_name}`);

    return res.status(201).json({
      success: true,
      message: 'درخواست مشاوره شما با موفقیت ثبت شد. کارشناسان وبنیک به زودی با شما تماس خواهند گرفت.',
      leadId: newLead.id,
    });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در ثبت درخواست' });
  }
});

// ADMIN: Get all leads with filtering & pagination
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, priority, search, page = '1', limit = '20' } = req.query;
    let leads = db.getTable('leads');

    if (status && status !== 'ALL') {
      leads = leads.filter((l) => l.status === status);
    }

    if (priority && priority !== 'ALL') {
      leads = leads.filter((l) => l.priority === priority);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      leads = leads.filter(
        (l) =>
          l.full_name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.business_name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.requested_service.toLowerCase().includes(q)
      );
    }

    const total = leads.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedLeads = leads.slice(startIndex, startIndex + limitNum);

    // Summary counts
    const allLeads = db.getTable('leads');
    const counts = {
      total: allLeads.length,
      new: allLeads.filter((l) => l.status === 'NEW').length,
      contacted: allLeads.filter((l) => l.status === 'CONTACTED').length,
      qualified: allLeads.filter((l) => l.status === 'QUALIFIED').length,
      won: allLeads.filter((l) => l.status === 'WON').length,
    };

    res.json({
      success: true,
      leads: paginatedLeads,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      counts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت لیست سرنخ‌ها' });
  }
});

// ADMIN: Get Lead Detail with Notes and Activities
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const lead = db.findById<Lead>('leads', id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'سرنخ یافت نشد' });
  }

  const notes = db.find<LeadNote>('lead_notes', (n) => n.lead_id === id);
  const activities = db.find<LeadActivity>('lead_activities', (a) => a.lead_id === id);

  res.json({
    success: true,
    lead,
    notes,
    activities,
  });
});

// ADMIN: Update Lead Status
router.patch('/:id/status', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user!;
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

  const lead = db.findById<Lead>('leads', id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'سرنخ یافت نشد' });
  }

  const prevStatus = lead.status;
  const updated = await db.update<Lead>('leads', id, { status });

  // Record activity
  await db.insert<LeadActivity>('lead_activities', {
    lead_id: id,
    user_id: user.id,
    user_name: user.name,
    action_type: 'STATUS_CHANGE',
    description: `وضعیت سرنخ از ${prevStatus} به ${status} تغییر یافت.`,
  });

  await db.logAudit(user.id, user.username, 'LEAD_STATUS_UPDATE', 'leads', id, ip, `تغییر وضعیت سرنخ ${lead.full_name} به ${status}`);

  res.json({ success: true, lead: updated });
});

// ADMIN: Update Priority
router.patch('/:id/priority', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { priority } = req.body;
  const user = req.user!;

  const lead = db.findById<Lead>('leads', id);
  if (!lead) return res.status(404).json({ success: false, message: 'سرنخ یافت نشد' });

  const updated = await db.update<Lead>('leads', id, { priority });

  await db.insert<LeadActivity>('lead_activities', {
    lead_id: id,
    user_id: user.id,
    user_name: user.name,
    action_type: 'PRIORITY_CHANGE',
    description: `اولویت سرنخ به ${priority} تغییر یافت.`,
  });

  res.json({ success: true, lead: updated });
});

// ADMIN: Add Note to Lead
router.post('/:id/notes', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user!;
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'متن یادداشت نمی‌تواند خالی باشد.' });
  }

  const lead = db.findById<Lead>('leads', id);
  if (!lead) return res.status(404).json({ success: false, message: 'سرنخ یافت نشد' });

  const note = await db.insert<LeadNote>('lead_notes', {
    lead_id: id,
    user_id: user.id,
    user_name: user.name,
    content: content.trim(),
  });

  await db.update<Lead>('leads', id, {
    notes_count: (lead.notes_count || 0) + 1,
  });

  await db.insert<LeadActivity>('lead_activities', {
    lead_id: id,
    user_id: user.id,
    user_name: user.name,
    action_type: 'NOTE_ADDED',
    description: `یادداشت جدید ثبت شد.`,
  });

  await db.logAudit(user.id, user.username, 'LEAD_NOTE_ADDED', 'leads', id, ip, `ثبت یادداشت برای سرنخ ${lead.full_name}`);

  res.status(201).json({ success: true, note });
});

// ADMIN: Delete Lead
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

  const lead = db.findById<Lead>('leads', id);
  if (!lead) return res.status(404).json({ success: false, message: 'سرنخ یافت نشد' });

  await db.delete('leads', id);
  await db.logAudit(user.id, user.username, 'LEAD_DELETED', 'leads', id, ip, `حذف سرنخ ${lead.full_name}`);

  res.json({ success: true, message: 'سرنخ با موفقیت حذف شد.' });
});

// ADMIN: Export leads
router.get('/export/data', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const leads = db.getTable('leads');
  res.json({
    success: true,
    leads,
    exported_at: new Date().toISOString(),
  });
});

export default router;
