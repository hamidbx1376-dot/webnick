import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

export const FAQsCMS: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('عمومی');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState('PUBLISHED');
  const [isSaving, setIsSaving] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.getFAQs(true);
      setFaqs(res.faqs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreate = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('عمومی');
    setDisplayOrder(faqs.length + 1);
    setStatus('PUBLISHED');
    setIsModalOpen(true);
  };

  const openEdit = (f: any) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category || 'عمومی');
    setDisplayOrder(f.display_order || 1);
    setStatus(f.status || 'PUBLISHED');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return alert('سوال و پاسخ الزامی است.');

    setIsSaving(true);
    const payload = { question, answer, category, display_order: Number(displayOrder), status };

    try {
      if (editingFaq) {
        await api.updateFAQ(editingFaq.id, payload);
      } else {
        await api.createFAQ(payload);
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (e) {
      alert('خطا در ذخیره پرسش');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این پرسش اطمینان دارید؟')) return;
    await api.deleteFAQ(id);
    fetchFaqs();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت سوالات متداول (FAQ CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">سوالات متداول نمایش داده شده در صفحه اصلی</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن پرسش جدید</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">در حال دریافت سوالات...</div>
        ) : faqs.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {faqs.map((f) => (
              <div key={f.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{f.question}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{f.answer}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-slate-400">سوالی ثبت نشده است.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingFaq ? 'ویرایش پرسش و پاسخ' : 'افزودن پرسش جدید'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">متن سوال</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="مثال: هزینه طراحی سایت چقدر است؟"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">متن پاسخ کامل</label>
                <textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  placeholder="پاسخ روشن و کامل به کاربر..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
