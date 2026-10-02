import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Copy, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUploader } from '../components/ImageUploader';

export const PortfolioCMS: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('سایت شرکتی');
  const [categoryKey, setCategoryKey] = useState<'ecommerce' | 'corporate' | 'cafe' | 'all'>('corporate');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [previewType, setPreviewType] = useState<'watch' | 'building' | 'cafe'>('building');
  const [techStackStr, setTechStackStr] = useState('React, TypeScript, Tailwind');
  const [year, setYear] = useState('۱۴۰۴');
  const [status, setStatus] = useState('PUBLISHED');
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getPortfolio('', true);
      setProjects(res.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setClientName('');
    setCategory('سایت شرکتی');
    setCategoryKey('corporate');
    setShortDesc('');
    setFullDesc('');
    setCoverImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80');
    setAccentColor('#2563eb');
    setPreviewType('building');
    setTechStackStr('React, Next.js, Tailwind');
    setYear('۱۴۰۴');
    setStatus('PUBLISHED');
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProject(p);
    setTitle(p.title);
    setClientName(p.client_name || '');
    setCategory(p.category);
    setCategoryKey(p.category_key || 'corporate');
    setShortDesc(p.short_description || '');
    setFullDesc(p.full_description || '');
    setCoverImage(p.cover_image || '');
    setAccentColor(p.accent_color || '#2563eb');
    setPreviewType(p.preview_type || 'building');
    setTechStackStr((p.tech_stack || []).join(', '));
    setYear(p.year || '۱۴۰۴');
    setStatus(p.status || 'PUBLISHED');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('عنوان پروژه الزامی است.');

    setIsSaving(true);
    const techStack = techStackStr.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      title,
      client_name: clientName,
      category,
      category_key: categoryKey,
      short_description: shortDesc,
      full_description: fullDesc,
      cover_image: coverImage,
      accent_color: accentColor,
      preview_type: previewType,
      tech_stack: techStack,
      year,
      status,
    };

    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
      } else {
        await api.createProject(payload);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (e) {
      alert('خطا در ذخیره پروژه');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این پروژه اطمینان دارید؟')) return;
    await api.deleteProject(id);
    fetchProjects();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت نمونه‌کارها (Portfolio CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">
            پروژه‌های طراحی و توسعه وب نمایش داده شده در گالری عمومی سایت
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن پروژه جدید</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">در حال دریافت پروژه‌ها...</div>
        ) : projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/95 text-blue-800 text-[10px] font-bold shadow-xs">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right">
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.short_description}</p>
                  <div className="text-[11px] text-slate-400">مشتری: {p.client_name || 'نامشخص'}</div>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  p.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'}
                </span>

                <div className="flex items-center gap-1">
                  <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">پروژه‌ای ثبت نشده است.</div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingProject ? 'ویرایش پروژه نمونه‌کار' : 'افزودن نمونه‌کار جدید'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان پروژه</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: فروشگاه ساعت لوکس"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام کارفرما / برند</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: گالری ساعت رولکس"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">دسته‌بندی نمایشی</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="مثال: فروشگاه آنلاین"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="تصویر اصلی پروژه نمونه‌کار"
                helperText="بارگذاری فایل از سیستم یا انتخاب از کتابخانه رسانه"
                value={coverImage}
                onChange={setCoverImage}
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">توضیح کوتاه</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="توضیح مختصر در کارت نمونه‌کار..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تکنولوژی‌ها (جدا شده با ویرگول)</label>
                <input
                  type="text"
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  placeholder="React, Next.js, Tailwind CSS, PostgreSQL"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سال اجرا</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">وضعیت انتشار</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="PUBLISHED">منتشر شده</option>
                    <option value="DRAFT">پیش‌نویس</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                  {isSaving ? 'در حال ذخیره...' : 'ذخیره نمونه‌کار'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
