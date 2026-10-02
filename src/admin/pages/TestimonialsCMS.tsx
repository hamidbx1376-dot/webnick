import React, { useState, useEffect } from 'react';
import { Quote, Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUploader } from '../components/ImageUploader';

export const TestimonialsCMS: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.getTestimonials(true);
      setTestimonials(res.testimonials || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setCompany('');
    setQuote('');
    setRating(5);
    setAvatarUrl('');
    setIsModalOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingItem(t);
    setName(t.name);
    setRole(t.role);
    setCompany(t.company);
    setQuote(t.quote);
    setRating(t.rating || 5);
    setAvatarUrl(t.avatar_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) return alert('نام و متن نظر الزامی است.');

    setIsSaving(true);
    const payload = {
      name,
      role,
      company,
      quote,
      rating: Number(rating),
      avatar_url: avatarUrl,
    };

    try {
      if (editingItem) {
        await api.updateTestimonial(editingItem.id, payload);
      } else {
        await api.createTestimonial(payload);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (e) {
      alert('خطا در ذخیره');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    await api.deleteTestimonial(id);
    fetchItems();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Quote className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت نظرات مشتریان (Testimonials CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">نظرات و تجربیات مشتریان قبلی نمایش داده شده در سایت</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن نظر جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">در حال دریافت نظرات...</div>
        ) : testimonials.length > 0 ? (
          testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                      <p className="text-[11px] text-slate-500">{t.role} {t.company ? `(${t.company})` : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-4">«{t.quote}»</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">نظری ثبت نشده است.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingItem ? 'ویرایش نظر مشتری' : 'افزودن نظر مشتری جدید'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">نام و نام خانوادگی مشتری</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="مثال: علی رضایی"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سمت / شغل</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="مثال: مدیرعامل"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام شرکت / برند</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="مثال: کافه لته"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="تصویر یا آواتار مشتری (اختیاری)"
                helperText="بارگذاری مستقیم از کامپیوتر یا انتخاب از کتابخانه"
                value={avatarUrl}
                onChange={setAvatarUrl}
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">متن نظر</label>
                <textarea
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                  placeholder="تجربه مشتری از همکاری با وبنیک..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
