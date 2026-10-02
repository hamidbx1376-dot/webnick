import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PasswordChangePageProps {
  onSuccess: () => void;
}

export const PasswordChangePage: React.FC<PasswordChangePageProps> = ({ onSuccess }) => {
  const { changePassword, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('تکمیل تمامی فیلدهای الزامی است.');
      return;
    }

    if (newPassword.length < 6) {
      setError('کلمه عبور جدید باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    if (newPassword === '1234') {
      setError('کلمه عبور جدید نمی‌تواند همان مقدار پیش‌فرض اولیه باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('کلمه عبور جدید و تکرار آن یکسان نیستند.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changePassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'خطا در تغییر کلمه عبور.');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071324] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white antialiased">
      <div className="relative w-full max-w-md bg-[#0b1c36] border border-amber-900/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-right">
        
        {/* Warning Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <KeyRound className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            تغییر اجباری کلمه عبور اولیه
          </h2>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            به دلایل امنیتی، استفاده از کلمه عبور پیش‌فرض برای دسترسی به پنل مدیریت مجاز نیست. لطفاً یک رمز عبور قوی و جدید تنظیم نمایید.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              کلمه عبور فعلی
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081528] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              کلمه عبور جدید (حداقل ۶ کاراکتر)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081528] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              تکرار کلمه عبور جدید
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081528] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              dir="ltr"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>در حال به‌روزرسانی...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>ثبت کلمه عبور جدید و ورود به پنل</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => logout()}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            انصراف و خروج از حساب
          </button>
        </div>

      </div>
    </div>
  );
};
