import React, { useState } from 'react';
import { X, CheckCircle, Send, Sparkles, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { ConsultationFormData } from '../types';
import { api } from '../services/api';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedService = 'طراحی سایت اختصاصی'
}) => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    phoneNumber: '',
    businessName: '',
    serviceType: preselectedService,
    budget: '۲۰ الی ۵۰ میلیون تومان',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        serviceType: preselectedService || 'طراحی سایت اختصاصی'
      }));
      setIsSubmitted(false);
      setErrorMsg('');
    }
  }, [isOpen, preselectedService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic validation
    if (!formData.fullName.trim()) {
      setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }

    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      setErrorMsg('لطفاً یک شماره تماس معتبر (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitLead({
        full_name: formData.fullName,
        phone: formData.phoneNumber,
        business_name: formData.businessName,
        requested_service: formData.serviceType,
        budget: formData.budget,
        message: formData.description,
        source: 'consultation_modal',
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در ثبت درخواست. لطفاً مجدداً تلاش نمایید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto text-right"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="بستن پنجره"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pl-8">
              <img
                src="/files/logo.webp"
                onError={(e) => {
                  e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/logo.webp';
                }}
                alt="Webnick"
                className="h-7 w-auto object-contain"
              />
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>مشاوره تخصصی رایگان</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              درخواست مشاوره رایگان
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              اطلاعات پروژه خود را ثبت کنید؛ مشاوران ارشد وبنیک حداکثر تا ۲ ساعت آینده با شما تماس خواهند گرفت.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  نام و نام خانوادگی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: علی احمدی"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    شماره تماس <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50 tabular-nums text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    نام کسب‌وکار یا برند
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً: شرکت آریان"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    نوع خدمت مورد نیاز
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-slate-50/50"
                  >
                    <option value="طراحی سایت اختصاصی">طراحی سایت اختصاصی</option>
                    <option value="فروشگاه اینترنتی">فروشگاه اینترنتی</option>
                    <option value="سئو و بهینه‌سازی">سئو و بهینه‌سازی</option>
                    <option value="دیجیتال مارکتینگ">دیجیتال مارکتینگ</option>
                    <option value="خدمات هوش مصنوعی">خدمات هوش مصنوعی</option>
                    <option value="بازطراحی و توسعه مجدد">بازطراحی و توسعه مجدد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    بودجه تقریبی
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-slate-50/50"
                  >
                    <option value="زیر ۲۰ میلیون تومان">زیر ۲۰ میلیون تومان</option>
                    <option value="۲۰ الی ۵۰ میلیون تومان">۲۰ الی ۵۰ میلیون تومان</option>
                    <option value="۵۰ الی ۱۰۰ میلیون تومان">۵۰ الی ۱۰۰ میلیون تومان</option>
                    <option value="بیش از ۱۰۰ میلیون تومان">بیش از ۱۰۰ میلیون تومان (پروژه‌های کلان)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  توضیحات کوتاه درباره نیاز یا ایده شما
                </label>
                <textarea
                  rows={3}
                  placeholder="مختصری درباره اهداف، نیازها یا ویژگی‌های مد نظرتان بنویسید..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#0b1c36] hover:bg-blue-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>در حال ارسال اطلاعات...</span>
                  ) : (
                    <>
                      <span>ارسال درخواست مشاوره رایگان</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400">
                  اطلاعات شما نزد وبنیک کاملاً محرمانه خواهد بود.
                </span>
              </div>

            </form>
          </div>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-2">
              درخواست شما با موفقیت ثبت شد!
            </h4>

            <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
              کارشناس فنی وبنیک به زودی با شماره <span className="font-bold text-slate-900 tabular-nums">{formData.phoneNumber}</span> تماس خواهد گرفت تا اطلاعات اولیه را بررسی و زمان جلسه آنلاین را تنظیم نماید.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <a
                href="https://wa.me/989123456789"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>گفتگو در واتس‌اپ</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
