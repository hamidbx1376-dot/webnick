import React, { useState, useEffect } from 'react';
import { ArrowUp, Phone, MessageSquare, X, Sparkles, MessageCircle } from 'lucide-react';

interface FloatingUIProps {
  onOpenConsultation: () => void;
}

export const FloatingUI: React.FC<FloatingUIProps> = ({ onOpenConsultation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after user scrolls past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Back to top button (Bottom Left) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-white text-slate-700 hover:text-blue-700 shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        aria-label="بازگشت به بالای صفحه"
        title="بازگشت به بالا"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Floating Consultation Element (Bottom Right) */}
      {!isDismissed && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
          
          {/* Expanded Quick Contact Card */}
          {isExpanded && (
            <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 text-right animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>پاسخگویی سریع وبنیک</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                سوالی دارید یا به مشاوره رایگان برای پروژه‌تان نیاز دارید؟
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenConsultation();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#0b1c36] hover:bg-blue-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>درخواست مشاوره رایگان</span>
                </button>

                <a
                  href="tel:02188990000"
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>تماس: ۰۲۱-۸۸۹۹۰۰۰۰</span>
                </a>

                <a
                  href="https://wa.me/989123456789"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>پیام در واتس‌اپ</span>
                </a>
              </div>
            </div>
          )}

          {/* Collapsed Pill Button */}
          <div className="flex items-center gap-1.5 bg-[#0b1c36] text-white p-1 pr-3 pl-1.5 rounded-full shadow-xl hover:shadow-2xl border border-blue-900/40 transition-all duration-200 hover:scale-105">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs font-bold cursor-pointer focus:outline-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>مشاوره و پشتیبانی آنلاین</span>
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Small Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="w-5 h-5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer mr-1"
              title="بستن"
              aria-label="بستن دکمه شناور"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
