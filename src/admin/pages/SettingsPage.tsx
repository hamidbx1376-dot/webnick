import React, { useState, useEffect } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUploader } from '../components/ImageUploader';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.settings) setSettings(res.settings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e) {
      alert('خطا در ذخیره تنظیمات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, val: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: val }));
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-slate-400">در حال دریافت تنظیمات...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-slate-700" />
            <h1 className="text-lg font-black text-slate-900">تنظیمات عمومی وب‌سایت</h1>
          </div>
          <p className="text-xs text-slate-500">مشخصات برند، تلفن‌ها، شبکه‌های اجتماعی و کدهای رهگیری</p>
        </div>

        {success && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تنظیمات ذخیره شد</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 text-xs text-right">
        
        {/* Brand Details */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">هویت برند</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">نام وب‌سایت</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">شعار برند (Slogan)</label>
              <input
                type="text"
                value={settings.site_slogan || ''}
                onChange={(e) => handleChange('site_slogan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                dir="ltr"
              />
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="لوگوی رسمی هدر وبنیک (Header Logo)"
                helperText="بارگذاری فایل از سیستم یا انتخاب از کتابخانه"
                value={settings.logo_url || ''}
                onChange={(url) => handleChange('logo_url', url)}
              />

              <ImageUploader
                label="فاوآیکون تب مرورگر (Favicon)"
                helperText="پیشنهاد: تصویر مربعی ۱:۱ (فرمت ICO, PNG, WebP)"
                value={settings.favicon_url || ''}
                onChange={(url) => handleChange('favicon_url', url)}
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">راه‌های ارتباطی</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">شماره تلفن ثابت</label>
              <input
                type="text"
                value={settings.phone_number || ''}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ایمیل رسمی</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">آدرس پستی دفتر</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">شبکه‌های اجتماعی</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اینستاگرام</label>
              <input
                type="text"
                value={settings.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">لینکدین</label>
              <input
                type="text"
                value={settings.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">تلگرام</label>
              <input
                type="text"
                value={settings.telegram || ''}
                onChange={(e) => handleChange('telegram', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">واتس‌اپ</label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
