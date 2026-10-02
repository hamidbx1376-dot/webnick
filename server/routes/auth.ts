import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../db/database';
import { User, Session } from '../db/schema';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Track failed attempts in memory for brute-force protection
const failedAttempts: Record<string, { count: number; lockedUntil: number }> = {};

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'نام کاربری و کلمه عبور الزامی است.',
      });
    }

    // Brute-force check
    const attemptRecord = failedAttempts[ip];
    if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
      const waitSeconds = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMITED',
        message: `تعداد تلاش‌های ناموفق بیش از حد مجاز بوده است. لطفاً ${waitSeconds} ثانیه دیگر مجدداً تلاش کنید.`,
      });
    }

    const user = db.findOne<User>('users', (u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user || user.status !== 'ACTIVE') {
      // Record failed attempt
      failedAttempts[ip] = {
        count: (attemptRecord?.count || 0) + 1,
        lockedUntil: (attemptRecord?.count || 0) >= 5 ? Date.now() + 60000 : 0,
      };

      await db.logAudit('system', username, 'AUTH_LOGIN_FAILED', 'users', 'none', ip, `تلاش ناموفق برای ورود با نام کاربری ${username}`);

      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'نام کاربری یا رمز عبور اشتباه است.',
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      failedAttempts[ip] = {
        count: (attemptRecord?.count || 0) + 1,
        lockedUntil: (attemptRecord?.count || 0) >= 5 ? Date.now() + 60000 : 0,
      };

      await db.logAudit(user.id, user.username, 'AUTH_LOGIN_FAILED', 'users', user.id, ip, 'رمز عبور اشتباه وارد شد');

      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'نام کاربری یا رمز عبور اشتباه است.',
      });
    }

    // Reset failed attempts on success
    delete failedAttempts[ip];

    // Generate secure cryptographically random session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await db.insert<Session>('sessions', {
      token,
      user_id: user.id,
      ip_address: ip,
      user_agent: req.headers['user-agent'] || '',
      expires_at: expiresAt,
    });

    // Update user last login
    await db.update<User>('users', user.id, {
      last_login_at: new Date().toISOString(),
    });

    await db.logAudit(user.id, user.username, 'AUTH_LOGIN_SUCCESS', 'users', user.id, ip, 'ورود موفق به پنل مدیریت وبنیک');

    // Set cookie as well
    res.cookie('webnick_session_token', token, {
      httpOnly: false, // Accessible by client fetch
      secure: false, // works in dev environment
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      must_change_password: user.must_change_password,
    };

    return res.json({
      success: true,
      token,
      user: safeUser,
      must_change_password: user.must_change_password,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در فرآیند ورود' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { current_password, new_password, confirm_password } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'تکمیل تمامی فیلدهای رمز عبور الزامی است.',
      });
    }

    if (!bcrypt.compareSync(current_password, user.password_hash)) {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور فعلی وارد شده نادرست است.',
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.',
      });
    }

    if (new_password === '1234') {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور جدید نمی‌تواند همان مقدار پیش‌فرض اولیه (۱۲۳۴) باشد.',
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور جدید با تکرار آن همخوانی ندارد.',
      });
    }

    const newHash = bcrypt.hashSync(new_password, 10);

    await db.update<User>('users', user.id, {
      password_hash: newHash,
      must_change_password: false,
    });

    await db.logAudit(user.id, user.username, 'AUTH_PASSWORD_CHANGED', 'users', user.id, ip, 'تغییر موفقیت‌آمیز رمز عبور مدیر');

    return res.json({
      success: true,
      message: 'رمز عبور شما با موفقیت تغییر یافت. اکنون به پنل دسترسی دارید.',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در تغییر رمز عبور' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      must_change_password: user.must_change_password,
    },
  });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = req.session;
    const user = req.user;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    if (session) {
      await db.delete('sessions', session.id);
    }

    if (user) {
      await db.logAudit(user.id, user.username, 'AUTH_LOGOUT', 'users', user.id, ip, 'خروج از حساب کاربری');
    }

    res.clearCookie('webnick_session_token');
    return res.json({ success: true, message: 'با موفقیت خارج شدید.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'خطا در خروج' });
  }
});

export default router;
