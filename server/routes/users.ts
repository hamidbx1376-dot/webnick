import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database';
import { User, Role } from '../db/schema';
import { authenticateToken, AuthenticatedRequest, requirePermission } from '../middleware/auth';

const router = Router();

// GET /api/users (requires SUPER_ADMIN)
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getTable('users').map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    must_change_password: u.must_change_password,
    last_login_at: u.last_login_at,
    created_at: u.created_at,
  }));

  const roles = db.getTable('roles');
  res.json({ success: true, users, roles });
});

// POST /api/users
router.post('/', authenticateToken, requirePermission('users.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, name, email, password, role } = req.body;
    const adminUser = req.user!;
    const ip = req.ip || '127.0.0.1';

    if (!username || !password || !name) {
      return res.status(400).json({ success: false, message: 'نام کاربری، نام و کلمه عبور الزامی است.' });
    }

    const existing = db.findOne<User>('users', (u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'این نام کاربری قبلاً ثبت شده است.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const newUser = await db.insert<User>('users', {
      username: username.trim(),
      name: name.trim(),
      email: (email || '').trim(),
      password_hash,
      role: role || 'ADMIN',
      status: 'ACTIVE',
      must_change_password: true,
      last_login_at: null,
    });

    await db.logAudit(adminUser.id, adminUser.username, 'USER_CREATED', 'users', newUser.id, ip, `ایجاد کاربر مدیر جدید: ${newUser.username}`);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ثبت کاربر' });
  }
});

// PUT /api/users/:id
router.put('/:id', authenticateToken, requirePermission('users.manage'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role, status, new_password } = req.body;
  const adminUser = req.user!;
  const ip = req.ip || '127.0.0.1';

  const user = db.findById<User>('users', id);
  if (!user) return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });

  const patch: Partial<User> = {
    name: name || user.name,
    email: email !== undefined ? email : user.email,
    role: role || user.role,
    status: status || user.status,
  };

  if (new_password && new_password.trim()) {
    patch.password_hash = bcrypt.hashSync(new_password.trim(), 10);
    patch.must_change_password = true;
  }

  const updated = await db.update<User>('users', id, patch);
  await db.logAudit(adminUser.id, adminUser.username, 'USER_UPDATED', 'users', id, ip, `ویرایش کاربر: ${user.username}`);

  res.json({ success: true, user: updated });
});

// DELETE /api/users/:id
router.delete('/:id', authenticateToken, requirePermission('users.manage'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminUser = req.user!;
  const ip = req.ip || '127.0.0.1';

  if (id === adminUser.id) {
    return res.status(400).json({ success: false, message: 'نمی‌توانید حساب کاربری جاری خود را حذف کنید.' });
  }

  await db.delete('users', id);
  await db.logAudit(adminUser.id, adminUser.username, 'USER_DELETED', 'users', id, ip, `حذف کاربر با شناسه ${id}`);

  res.json({ success: true, message: 'کاربر با موفقیت حذف شد' });
});

export default router;
