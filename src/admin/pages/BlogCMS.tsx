import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, X, Clock, Calendar, Check } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUploader } from '../components/ImageUploader';

export const BlogCMS: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('طراحی سایت');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState('۵ دقیقه مطالعه');
  const [tagsStr, setTagsStr] = useState('طراحی وب, سئو');
  const [intro, setIntro] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [isSaving, setIsSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getBlogPosts('', '', true);
      setPosts(res.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('طراحی سایت');
    setCoverImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80');
    setReadTime('۵ دقیقه مطالعه');
    setTagsStr('طراحی وب, سئو');
    setIntro('');
    setStatus('PUBLISHED');
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt);
    setCategory(p.category);
    setCoverImage(p.cover_image || '');
    setReadTime(p.read_time || '۵ دقیقه');
    setTagsStr((p.tags || []).join(', '));
    setIntro(p.content?.intro || p.excerpt || '');
    setStatus(p.status || 'PUBLISHED');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) return alert('عنوان و چکیده مقاله الزامی است.');

    setIsSaving(true);
    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9آ-ی]/g, '-'),
      excerpt,
      category,
      cover_image: coverImage,
      read_time: readTime,
      tags,
      status,
      content: {
        intro: intro || excerpt,
        sections: editingPost?.content?.sections || [],
        conclusion: editingPost?.content?.conclusion || '',
      },
    };

    try {
      if (editingPost) {
        await api.updateBlogPost(editingPost.id, payload);
      } else {
        await api.createBlogPost(payload);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (e) {
      alert('خطا در ذخیره مقاله');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این مقاله اطمینان دارید؟')) return;
    await api.deleteBlogPost(id);
    fetchPosts();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت مقالات وبلاگ (Blog CMS)</h1>
          </div>
          <p className="text-xs text-slate-500">
            انتشار و ویرایش مقالات، آموزش‌ها و اخبار تخصصی در صفحه وبلاگ سایت
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>نگارش مقاله جدید</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="py-3.5 px-4">عنوان مقاله</th>
                <th className="py-3.5 px-4">دسته‌بندی</th>
                <th className="py-3.5 px-4">نویسنده</th>
                <th className="py-3.5 px-4">زمان مطالعه</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">در حال دریافت مقالات...</td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{post.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-md">{post.excerpt}</div>
                    </td>
                    <td className="py-3.5 px-4 text-blue-600 font-semibold">{post.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">{post.author_name}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{post.read_time}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        post.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {post.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditModal(post)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">مقاله‌ای یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingPost ? 'ویرایش مقاله وبلاگ' : 'نگارش مقاله جدید'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان مقاله</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان جذاب و کامل مقاله..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">دسته‌بندی</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="طراحی سایت">طراحی سایت</option>
                    <option value="سئو و گوگل">سئو و گوگل</option>
                    <option value="هوش مصنوعی">هوش مصنوعی</option>
                    <option value="فروشگاه آنلاین">فروشگاه آنلاین</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">زمان تخمینی مطالعه</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="مثال: ۵ دقیقه مطالعه"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="تصویر شاخص مقاله وبلاگ"
                helperText="بارگذاری مستقیم از کامپیوتر یا انتخاب از کتابخانه"
                value={coverImage}
                onChange={setCoverImage}
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">چکیده مقاله (نمایش در کارت‌ها)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  placeholder="خلاصه ۲ خطی از موضوع مقاله..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">مقدمه متن مقاله</label>
                <textarea
                  rows={4}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="پاراگراف آغازین تفصیلی مقاله..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">برچسب‌ها (جدا شده با ویرگول)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="طراحی وب, سئو, تجربه کاربری"
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
                  <option value="PUBLISHED">منتشر شده در وب‌سایت</option>
                  <option value="DRAFT">پیش‌نویس</option>
                </select>
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
                  {isSaving ? 'در حال ذخیره...' : 'ذخیره مقاله'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
