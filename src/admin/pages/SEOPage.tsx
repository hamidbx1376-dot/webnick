import React, { useState, useEffect } from 'react';
import { Search, Save, Check, ExternalLink, Globe } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUploader } from '../components/ImageUploader';

export const SEOPage: React.FC = () => {
  const [seo, setSeo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await api.getSEO();
        if (res.seo) setSeo(res.seo);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSEO(seo);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e) {
      alert('خطا در ذخیره سئو');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, val: any) => {
    setSeo((prev: any) => ({ ...prev, [field]: val }));
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-slate-400">در حال دریافت تنظیمات سئو...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">تنظیمات سئو و متاتگ‌ها (SEO Management)</h1>
          </div>
          <p className="text-xs text-slate-500">پیکربندی تایتل‌های گوگل، متای توضیحات، OpenGraph و فایل‌های Sitemap/Robots</p>
        </div>

        {success && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تنظیمات ذخیره شد</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 text-xs text-right">
        
        {/* Meta tags */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">تنظیمات عمومی موتورهای جستجو</h3>
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">عنوان سئو پیش‌فرض (Default SEO Title)</label>
            <input
              type="text"
              value={seo.default_title || ''}
              onChange={(e) => handleChange('default_title', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الگوی عنوان صفحات (Title Template)</label>
            <input
              type="text"
              value={seo.title_template || ''}
              onChange={(e) => handleChange('title_template', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">متای توضیحات پیش‌فرض (Meta Description)</label>
            <textarea
              rows={3}
              value={seo.default_description || ''}
              onChange={(e) => handleChange('default_description', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none leading-relaxed"
            />
          </div>

          <ImageUploader
            label="تصویر پیش‌فرض اشتراک‌گذاری در شبکه‌های اجتماعی (Default OG Image)"
            helperText="تصویر پیشنهادی: ۱۲۰۰ در ۶۳۰ پیکسل با نسبت ۱.۹۱:۱"
            value={seo.default_og_image || ''}
            onChange={(url) => handleChange('default_og_image', url)}
          />

          <div>
            <label className="block font-bold text-slate-700 mb-1">آدرس پایه Canonical</label>
            <input
              type="text"
              value={seo.canonical_base_url || ''}
              onChange={(e) => handleChange('canonical_base_url', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              dir="ltr"
            />
          </div>
        </div>

        {/* Robots.txt and Sitemap */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">محتوای فایل robots.txt</h3>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px]"
            >
              <span>مشاهده robots.txt زنده</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <textarea
            rows={4}
            value={seo.robots_content || ''}
            onChange={(e) => handleChange('robots_content', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-[11px]"
            dir="ltr"
          />
        </div>

        {/* Live Sitemap link */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <span className="font-bold text-slate-900 block">نقشه خودکار سایت (sitemap.xml)</span>
              <span className="text-[11px] text-slate-500">تمامی خدمات، مقالات و صفحات به صورت خودکار در نقشه سایت قرار دارند.</span>
            </div>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1"
          >
            <span>مشاهده sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات سئو'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
