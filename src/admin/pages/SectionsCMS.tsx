import React, { useState, useEffect } from 'react';
import { FileText, Save, Check, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUploader } from '../components/ImageUploader';

export const SectionsCMS: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero' | 'final_cta' | 'why_webnick'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hero form fields
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroEyebrow, setHeroEyebrow] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroPrimaryCta, setHeroPrimaryCta] = useState('');
  const [heroSecondaryCta, setHeroSecondaryCta] = useState('');

  // Final CTA form fields
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');
  const [ctaEyebrow, setCtaEyebrow] = useState('');
  const [ctaImage, setCtaImage] = useState('');
  const [ctaPrimaryText, setCtaPrimaryText] = useState('');
  const [ctaSecondaryText, setCtaSecondaryText] = useState('');

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await api.getSections();
      if (res.sections) {
        setSections(res.sections);
        const hero = res.sections.find((s) => s.section_key === 'hero');
        if (hero) {
          setHeroTitle(hero.title);
          setHeroSubtitle(hero.subtitle);
          setHeroEyebrow(hero.eyebrow);
          setHeroImage(hero.content?.hero_image || 'https://webnick.ir/files/hero.webp');
          setHeroPrimaryCta(hero.content?.primary_cta_text || 'مشاوره رایگان');
          setHeroSecondaryCta(hero.content?.secondary_cta_text || 'مشاهده نمونه‌کارها');
        }

        const cta = res.sections.find((s) => s.section_key === 'final_cta');
        if (cta) {
          setCtaTitle(cta.title);
          setCtaSubtitle(cta.subtitle);
          setCtaEyebrow(cta.eyebrow);
          setCtaImage(cta.content?.image_url || 'https://webnick.ir/files/footer.webp');
          setCtaPrimaryText(cta.content?.primary_button_text || 'درخواست مشاوره رایگان');
          setCtaSecondaryText(cta.content?.secondary_button_text || 'تماس با ما');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSection('hero', {
        title: heroTitle,
        subtitle: heroSubtitle,
        eyebrow: heroEyebrow,
        content: {
          hero_image: heroImage,
          primary_cta_text: heroPrimaryCta,
          secondary_cta_text: heroSecondaryCta,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      alert('خطا در ذخیره بخش هیرو');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSection('final_cta', {
        title: ctaTitle,
        subtitle: ctaSubtitle,
        eyebrow: ctaEyebrow,
        content: {
          image_url: ctaImage,
          primary_button_text: ctaPrimaryText,
          secondary_button_text: ctaSecondaryText,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      alert('خطا در ذخیره کادر مشاوره');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت محتوای بخش‌های اصلی سایت (Sections CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">
            ویرایش متن‌ها، تیترها و تصاویر بخش هیرو (Hero) و کادر مشاوره پایانی (Final CTA)
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تغییرات با موفقیت ذخیره شد!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'hero' ? 'bg-[#0b1c36] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          بخش هیرو (Hero Section)
        </button>
        <button
          onClick={() => setActiveTab('final_cta')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'final_cta' ? 'bg-[#0b1c36] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          کادر مشاوره پایانی (Final CTA)
        </button>
      </div>

      {/* Hero Form */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs text-right">
          <div>
            <label className="block font-bold text-slate-700 mb-1">برچسب بالا (Eyebrow)</label>
            <input
              type="text"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">تیتر اصلی هیرو (Headline H1)</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-base font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">توضیحات و بیانیه ارزش</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">متن دکمه اصلی (Primary CTA)</label>
              <input
                type="text"
                value={heroPrimaryCta}
                onChange={(e) => setHeroPrimaryCta(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">متن دکمه فرعی (Secondary CTA)</label>
              <input
                type="text"
                value={heroSecondaryCta}
                onChange={(e) => setHeroSecondaryCta(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <ImageUploader
            label="تصویر اصلی بخش هیرو (Hero Image)"
            helperText="بارگذاری مستقیم از کامپیوتر یا انتخاب از کتابخانه"
            value={heroImage}
            onChange={setHeroImage}
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات هیرو'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Final CTA Form */}
      {activeTab === 'final_cta' && (
        <form onSubmit={handleSaveCta} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs text-right">
          <div>
            <label className="block font-bold text-slate-700 mb-1">برچسب بالا (Eyebrow)</label>
            <input
              type="text"
              value={ctaEyebrow}
              onChange={(e) => setCtaEyebrow(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">تیتر اصلی کادر مشاوره پایانی</label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-base font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">توضیحات تکمیلی</label>
            <textarea
              rows={3}
              value={ctaSubtitle}
              onChange={(e) => setCtaSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">متن دکمه ثبت درخواست</label>
              <input
                type="text"
                value={ctaPrimaryText}
                onChange={(e) => setCtaPrimaryText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">متن دکمه تماس مستقیم</label>
              <input
                type="text"
                value={ctaSecondaryText}
                onChange={(e) => setCtaSecondaryText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <ImageUploader
            label="تصویر بخش مشاوره پایانی (Final CTA Image)"
            helperText="بارگذاری مستقیم از کامپیوتر یا انتخاب از کتابخانه"
            value={ctaImage}
            onChange={setCtaImage}
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات مشاوره پایانی'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
