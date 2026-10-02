import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  FolderOpen,
  X,
  Check,
  Link as LinkIcon,
  Search,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  helperText,
  aspectRatio = 'auto',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('لطفاً فقط فایل‌های تصویری (PNG, JPG, WebP, SVG) انتخاب کنید.');
      return;
    }

    // 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('حجم فایل تصویر نباید بیشتر از ۱۵ مگابایت باشد.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await api.uploadMedia(file, undefined, file.name, file.name);
      if (res && res.success && res.media?.url) {
        onChange(res.media.url);
      } else {
        setUploadError(res?.message || 'خطا در بارگذاری تصویر.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'خطا در ارتباط با سرور.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openMediaLibrary = async () => {
    setIsMediaModalOpen(true);
    setMediaLoading(true);
    try {
      const res = await api.getMedia();
      if (res && res.media) {
        setMediaList(res.media);
      }
    } catch (e) {
      // fallback
    } finally {
      setMediaLoading(false);
    }
  };

  const selectFromMedia = (url: string) => {
    onChange(url);
    setIsMediaModalOpen(false);
  };

  const filteredMedia = mediaList.filter((m) => {
    if (!mediaSearch.trim()) return true;
    const q = mediaSearch.toLowerCase();
    return (m.title || '').toLowerCase().includes(q) || (m.filename || '').toLowerCase().includes(q);
  });

  return (
    <div className={`space-y-2 text-right ${className}`}>
      {/* Label and Helper */}
      {(label || helperText) && (
        <div className="flex items-center justify-between">
          {label && <label className="block font-bold text-slate-700 text-xs">{label}</label>}
          {helperText && <span className="text-[11px] text-slate-400">{helperText}</span>}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
      />

      {/* Main Container */}
      {value ? (
        /* Image Preview Box when image exists */
        <div className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-3 overflow-hidden group">
          <div className="flex items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/files/logo.webp';
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">تصویر انتخاب شده</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate dir-ltr text-right mb-3">
                {value.startsWith('data:') ? 'تصویر ذخیره شده (Data URL)' : value}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تغییر تصویر از کامپیوتر</span>
                </button>

                <button
                  type="button"
                  onClick={openMediaLibrary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>کتابخانه رسانه</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="حذف تصویر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone / Upload Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
              : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
          }`}
        >
          {isUploading ? (
            <div className="py-4">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">در حال آپلود و پردازش تصویر...</p>
              <p className="text-[11px] text-slate-400 mt-1">لطفاً چند لحظه صبر کنید</p>
            </div>
          ) : (
            <div className="py-2 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  برای بارگذاری تصویر از کامپیوتر کلیک کنید یا فایل را اینجا رها کنید
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  پشتیبانی از فرمت‌های PNG، JPG، WebP، SVG (حداکثر ۱۵ مگابایت)
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-blue-600 shadow-2xs">
                  انتخاب فایل از سیستم
                </span>
                <span className="text-slate-300 text-xs">یا</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMediaLibrary();
                  }}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>انتخاب از کتابخانه رسانه</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-rose-600 text-[11px] bg-rose-50 p-2 rounded-lg border border-rose-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Optional Manual URL Accordion (Secondary) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualUrl ? 'بستن ورودی دستی لینک' : 'یا وارد کردن دستی آدرس اینترنتی (اختیاری)'}</span>
        </button>

        {showManualUrl && (
          <div className="mt-2 animate-in fade-in duration-200">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="مثال: /files/hero.webp یا https://..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              dir="ltr"
            />
          </div>
        )}
      </div>

      {/* Media Library Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col text-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">کتابخانه تصاویر وبنیک</h3>
                  <p className="text-[11px] text-slate-400">یک تصویر را برای درج در بخش مورد نظر انتخاب نمایید</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Quick Upload inside Modal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجو در تصاویر..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMediaModalOpen(false);
                  fileInputRef.current?.click();
                }}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>آپلود تصویر جدید</span>
              </button>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {mediaLoading ? (
                <div className="py-16 text-center">
                  <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">در حال بارگذاری تصاویر...</p>
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => selectFromMedia(m.url)}
                      className={`group relative rounded-xl border p-2 text-right transition-all flex flex-col items-center bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-400 cursor-pointer ${
                        value === m.url ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/60' : 'border-slate-200'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg bg-white border border-slate-100 overflow-hidden flex items-center justify-center p-1.5 mb-2 relative">
                        <img
                          src={m.url}
                          alt={m.title || m.filename}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                        {value === m.url && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                        {m.title || m.filename}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400">
                  هیچ تصویری یافت نشد.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
