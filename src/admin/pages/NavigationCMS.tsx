import React, { useState, useEffect } from 'react';
import { Compass, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { api } from '../../services/api';

export const NavigationCMS: React.FC = () => {
  const [navItems, setNavItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const fetchNav = async () => {
    setLoading(true);
    try {
      const res = await api.getNavigation(true);
      setNavItems(res.navigation || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setLabel('');
    setUrl('');
    setSectionId('');
    setDisplayOrder(navItems.length + 1);
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setLabel(item.label);
    setUrl(item.url);
    setSectionId(item.section_id || '');
    setDisplayOrder(item.display_order || 1);
    setIsVisible(item.is_visible ?? true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !url) return alert('عنوان و آدرس الزامی است.');

    const payload = {
      label,
      url,
      section_id: sectionId,
      display_order: Number(displayOrder),
      is_visible: isVisible,
    };

    try {
      if (editingItem) {
        await api.updateNavigationItem(editingItem.id, payload);
      } else {
        await api.createNavigationItem(payload);
      }
      setIsModalOpen(false);
      fetchNav();
    } catch (e) {
      alert('خطا در ذخیره منو');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این آیتم منو مطمئنید؟')) return;
    await api.deleteNavigationItem(id);
    fetchNav();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت منوی ناوبری سایت (Navigation CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">تنظیم پیوندهای نوبار بالای صفحه و فوتر وب‌سایت</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن آیتم جدید</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="py-3 px-4">ترتیب</th>
                <th className="py-3 px-4">عنوان</th>
                <th className="py-3 px-4">آدرس لینک (URL)</th>
                <th className="py-3 px-4">شناسه بخش (Section ID)</th>
                <th className="py-3 px-4">وضعیت نمایش</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">در حال دریافت منو...</td>
                </tr>
              ) : navItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{item.display_order}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.label}</td>
                  <td className="py-3 px-4 font-mono text-slate-500" dir="ltr">{item.url}</td>
                  <td className="py-3 px-4 font-mono text-slate-500" dir="ltr">{item.section_id || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.is_visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.is_visible ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-right">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingItem ? 'ویرایش آیتم منو' : 'افزودن آیتم جدید به منو'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان آیتم</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="مثال: خدمات"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">آدرس لینک (URL یا شناسه هش)</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="مثال: #services یا /blog"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شناسه سکشن برای اسکرول روان</label>
                <input
                  type="text"
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  placeholder="مثال: services"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ترتیب</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">وضعیت نمایش</label>
                  <select
                    value={isVisible ? 'true' : 'false'}
                    onChange={(e) => setIsVisible(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="true">نمایش در منو</option>
                    <option value="false">مخفی</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
