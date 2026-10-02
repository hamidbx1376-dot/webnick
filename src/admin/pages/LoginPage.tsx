import React, { useState } from 'react';
import { Lock, User, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('لطفاً نام کاربری و کلمه عبور را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071324] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white antialiased">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0b1c36] border border-blue-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-right">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/files/logo.webp"
              onError={(e) => {
                e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/logo.webp';
              }}
              alt="Webnick"
              className="h-10 w-auto object-contain rounded-lg shadow-sm"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            ورود به پنل مدیریت وبنیک
          </h1>
          <p className="text-xs text-slate-400">
            سامانه اختصاصی مدیریت محتوا، سرنخ‌ها و تنظیمات سایت
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              نام کاربری
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-[#081528] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                dir="ltr"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              کلمه عبور
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-[#081528] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-pulse">در حال احراز هویت...</span>
            ) : (
              <>
                <span>ورود به سیستم</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick hint for initial credentials */}
        <div 
          onClick={() => {
            setUsername('admin');
            setPassword('1234');
          }}
          className="mt-4 p-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/40 border border-blue-900/50 text-[11px] text-blue-200/90 text-center flex items-center justify-center gap-2 cursor-pointer transition-colors"
          title="برای درج خودکار کلیک کنید"
        >
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>حساب پیش‌فرض: <strong className="text-white font-mono">admin</strong> / رمز: <strong className="text-white font-mono">1234</strong> (جهت درج خودکار کلیک کنید)</span>
        </div>

        {/* Back to Public Site link */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>بازگشت به وب‌سایت اصلی</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
