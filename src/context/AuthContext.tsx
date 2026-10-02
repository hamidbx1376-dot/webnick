import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SEO_MANAGER' | 'MARKETING_MANAGER' | 'SUPPORT';
  must_change_password: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; must_change_password?: boolean; message?: string }>;
  changePassword: (current_password: string, new_password: string, confirm_password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('webnick_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('webnick_admin_token');
  });
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    return localStorage.getItem('webnick_must_change_pwd') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('webnick_admin_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setMustChangePassword(Boolean(res.user.must_change_password));
        localStorage.setItem('webnick_admin_user', JSON.stringify(res.user));
        localStorage.setItem('webnick_must_change_pwd', String(Boolean(res.user.must_change_password)));
      } else {
        logout();
      }
    } catch (e: any) {
      const msg = e?.message || '';
      // Only clear session if explicitly unauthenticated or token revoked
      if (msg.includes('احراز هویت') || msg.includes('UNAUTHORIZED') || msg.includes('منقضی') || msg.includes('نامعتبر')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.login({ username, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setMustChangePassword(res.must_change_password);

        localStorage.setItem('webnick_admin_token', res.token);
        localStorage.setItem('webnick_admin_user', JSON.stringify(res.user));
        localStorage.setItem('webnick_must_change_pwd', String(res.must_change_password));

        return { success: true, must_change_password: res.must_change_password };
      }
      return { success: false, message: 'ورود ناموفق بود' };
    } catch (err: any) {
      return { success: false, message: err.message || 'خطا در برقراری ارتباط' };
    }
  };

  const changePassword = async (current_password: string, new_password: string, confirm_password: string) => {
    const res = await api.changePassword({ current_password, new_password, confirm_password });
    if (res.success) {
      setMustChangePassword(false);
      localStorage.setItem('webnick_must_change_pwd', 'false');
      if (user) {
        const updated = { ...user, must_change_password: false };
        setUser(updated);
        localStorage.setItem('webnick_admin_user', JSON.stringify(updated));
      }
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      setMustChangePassword(false);
      localStorage.removeItem('webnick_admin_token');
      localStorage.removeItem('webnick_admin_user');
      localStorage.removeItem('webnick_must_change_pwd');
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        mustChangePassword,
        isLoading,
        login,
        changePassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
