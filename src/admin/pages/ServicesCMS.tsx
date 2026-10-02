import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Copy, Trash2, X, Check, Search, Eye } from 'lucide-react';
import { api } from '../../services/api';

export const ServicesCMS: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [iconType, setIconType] = useState('code');
  const [duration, setDuration] = useState('۳ الی ۵ هفته');
  const [category, setCategory] = useState('طراحی وب');
  const [deliverablesStr, setDeliverablesStr] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.getServices(true);
      setServices(res.services || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setShortDesc('');
    setLongDesc('');
    setIconType('code');
    setDuration('۳ الی ۵ هفته');
    setCategory('طراحی وب');
    setDeliverablesStr('');
    setStatus('PUBLISHED');
    setDisplayOrder(services.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingService(s);
    setTitle(s.title);
    setSlug(s.slug);
    setShortDesc(s.short_desc);
    setLongDesc(s.long_desc || '');
    setIconType(s.icon_type);
    setDuration(s.duration || '');
    setCategory(s.category || '');
    setDeliverablesStr((s.deliverables || []).join('\n'));
    setStatus(s.status);
    setDisplayOrder(s.display_order);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) return alert('لطفاً عنوان و توضیح کوتاه را وارد نمایید.');

    setIsSaving(true);
    const deliverables = deliverablesStr.split('\n').map((d) => d.trim()).filter(Boolean);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9آ-ی]/g, '-'),
      short_desc: shortDesc,
      long_desc: longDesc,
      icon_type: iconType,
      duration,
      category,
      deliverables,
      status,
      display_order: Number(displayOrder),
    };

    try {
      if (editingService) {
        await api.updateService(editingService.id, payload);
      } else {
        await api.createService(payload);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (e) {
      alert('خطا در ذخیره خدمت');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    await api.duplicateService(id);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این خدمت اطمینان دارید؟')) return;
    await api.deleteService(id);
    fetchServices();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت خدمات تخصصی (CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">
            تغییرات اعمال شده در این بخش فوراً در صفحه اصلی سایت نمایش داده می‌شوند.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن خدمت جدید</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="py-3.5 px-4">ترتیب</th>
                <th className="py-3.5 px-4">عنوان خدمت</th>
                <th className="py-3.5 px-4">توضیح کوتاه</th>
                <th className="py-3.5 px-4">آیکون</th>
                <th className="py-3.5 px-4">دسته‌بندی</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">در حال بارگذاری...</td>
                </tr>
              ) : services.length > 0 ? (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{s.display_order}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.title}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">{s.short_desc}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {s.icon_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{s.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          title="ویرایش"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(s.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          title="تکثیر / کپی"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">هیچ خدمتی ثبت نشده است.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingService ? 'ویرایش اطلاعات خدمت' : 'افزودن خدمت جدید به وب‌سایت'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان خدمت</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: طراحی سایت اختصاصی"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع آیکون</label>
                  <select
                    value={iconType}
                    onChange={(e) => setIconType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="code">کدنویسی / توسعه (Code)</option>
                    <option value="seo">سئو و رتبه گوگل (SEO)</option>
                    <option value="search">فروشگاه آنلاین (Ecommerce)</option>
                    <option value="marketing">دیجیتال مارکتینگ (Marketing)</option>
                    <option value="ai">هوش مصنوعی (AI)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="مثال: طراحی وب"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">توضیح کوتاه (نمایش در کارت)</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  required
                  placeholder="توضیح یک‌خطی مختصر در صفحه اصلی..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">توضیح کامل و جزئیات خدمت</label>
                <textarea
                  rows={3}
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  placeholder="توضیحات تفصیلی نمایش داده شده در مودال..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">خروجی‌ها و دستاوردهای خدمت (هر مورد در یک خط)</label>
                <textarea
                  rows={3}
                  value={deliverablesStr}
                  onChange={(e) => setDeliverablesStr(e.target.value)}
                  placeholder="طراحی اختصاصی در فیگما&#10;سرعت بارگذاری زیر ۱ ثانیه&#10;پنل مدیریت اختصاصی"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">مدت زمان تحویل</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
                    <option value="DRAFT">پیش‌نویس (مخفی)</option>
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
                  {isSaving ? 'در حال ذخیره...' : 'ذخیره خدمت'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
