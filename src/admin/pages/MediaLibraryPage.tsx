import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Check, Folder, Plus, X } from 'lucide-react';
import { api } from '../../services/api';

export const MediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Folder Modal
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  // External URL Modal
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalTitle, setExternalTitle] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMedia(selectedFolder, search);
      setMediaList(res.media || []);
      setFolders(res.folders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadMedia(
        file,
        selectedFolder !== 'ALL' ? selectedFolder : undefined,
        file.name,
        file.name
      );
      if (res.success) {
        fetchMedia();
      } else {
        alert(res.message || 'خطا در بارگذاری');
      }
    } catch (e: any) {
      alert(e.message || 'خطا در آپلود');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddExternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl || !externalTitle) return;

    try {
      await api.addExternalMedia({
        url: externalUrl,
        title: externalTitle,
        folder_id: selectedFolder !== 'ALL' ? selectedFolder : null,
      });
      setIsExternalModalOpen(false);
      setExternalUrl('');
      setExternalTitle('');
      fetchMedia();
    } catch (e) {
      alert('خطا در افزودن مدیا');
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      await api.createFolder(folderName.trim());
      setIsFolderModalOpen(false);
      setFolderName('');
      fetchMedia();
    } catch (e) {
      alert('خطا در ساخت پوشه');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این فایل مطمئنید؟')) return;
    await api.deleteMedia(id);
    fetchMedia();
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">کتابخانه چندرسانه‌ای (Media Library)</h1>
          </div>
          <p className="text-xs text-slate-500">
            مدیریت تصاویر، بنرها و فایل‌های مورد استفاده در بخش‌های مختلف وب‌سایت
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'در حال آپلود...' : 'بارگذاری فایل جدید'}</span>
            <input type="file" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
          </label>

          <button
            onClick={() => setIsExternalModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <span>لینک مستقیم URL</span>
          </button>

          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <Folder className="w-4 h-4 text-amber-500" />
            <span>پوشه جدید</span>
          </button>
        </div>
      </div>

      {/* Filter and Folder Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => setSelectedFolder('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedFolder === 'ALL'
              ? 'bg-[#0b1c36] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          همه فایل‌ها ({mediaList.length})
        </button>

        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFolder(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedFolder === f.id
                ? 'bg-[#0b1c36] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">در حال دریافت فایل‌ها...</div>
        ) : mediaList.length > 0 ? (
          mediaList.map((m) => (
            <div
              key={m.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                {m.mime_type.startsWith('image/') ? (
                  <img src={m.url} alt={m.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}

                {/* Quick copy overlay */}
                <button
                  onClick={() => handleCopy(m.id, m.url)}
                  className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-slate-700 hover:text-blue-600 shadow-sm transition-colors cursor-pointer"
                  title="کپی آدرس تصویر"
                >
                  {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 text-right">
                <span className="block font-bold text-slate-800 text-[11px] truncate mb-0.5" title={m.title}>
                  {m.title}
                </span>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{m.file_size ? `${Math.round(m.file_size / 1024)} KB` : 'External'}</span>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-slate-400 hover:text-rose-600"
                    title="حذف فایل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">هیچ فایلی یافت نشد.</div>
        )}
      </div>

      {/* External Modal */}
      {isExternalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">افزودن لینک مستقیم عکس / مدیا</h3>
              <button onClick={() => setIsExternalModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExternal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان فایل</label>
                <input
                  type="text"
                  value={externalTitle}
                  onChange={(e) => setExternalTitle(e.target.value)}
                  placeholder="مثال: بنر تبلیغاتی"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">آدرس اینترنتی فایل (URL)</label>
                <input
                  type="text"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  dir="ltr"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsExternalModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">
                  ثبت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-right">
            <h3 className="font-bold text-sm text-slate-900 mb-3">ایجاد پوشه جدید</h3>
            <form onSubmit={handleCreateFolder} className="space-y-3 text-xs">
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="نام پوشه..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">
                  ساخت پوشه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
