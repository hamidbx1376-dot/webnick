import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import { User, Session } from '../db/schema';

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: Session;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1].trim();
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === 'webnick_session_token') {
        token = val;
        break;
      }
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'احراز هویت انجام نشده است.' });
  }

  const session = db.findOne<Session>('sessions', (s) => s.token === token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'INVALID_SESSION', message: 'نشست کاربری نامعتبر است.' });
  }

  // Check expiration
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.delete('sessions', session.id);
    return res.status(401).json({ success: false, error: 'SESSION_EXPIRED', message: 'نشست کاربری منقضی شده است. لطفاً مجدداً وارد شوید.' });
  }

  const user = db.findById<User>('users', session.user_id);
  if (!user || user.status !== 'ACTIVE') {
    return res.status(403).json({ success: false, error: 'USER_INACTIVE', message: 'حساب کاربری غیرفعال است.' });
  }

  req.user = user;
  req.session = session;

  // Enforce mandatory first-time password change (allow /me, /change-password, /logout)
  const targetUrl = (req.originalUrl || req.path || '').toLowerCase();
  if (
    user.must_change_password &&
    !targetUrl.includes('change-password') &&
    !targetUrl.includes('logout') &&
    !targetUrl.includes('me')
  ) {
    return res.status(403).json({
      success: false,
      error: 'MUST_CHANGE_PASSWORD',
      message: 'شما باید پیش از استفاده از پنل، رمز عبور پیش‌فرض خود را تغییر دهید.',
      must_change_password: true,
    });
  }

  next();
}

export function requirePermission(permissionCode: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'دسترسی غیرمجاز' });
    }

    // Super Admin has all permissions
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // In a production RBAC, we check role_permissions.
    // For ADMIN role, standard write/read is permitted
    if (req.user.role === 'ADMIN' && !permissionCode.startsWith('users.')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'شما دسترسی لازم برای انجام این عملیات را ندارید.',
    });
  };
}
