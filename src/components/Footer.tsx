import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, Send, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
  onNavigate?: (page: 'home' | 'blog' | 'admin', sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#081225] text-slate-400 pt-10 pb-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-8 border-b border-slate-800/70">
          
          {/* Brand Info (Col 5) */}
          <div className="lg:col-span-4 text-right">
            <div className="flex flex-col items-start gap-1 mb-4">
              <img
                src="/files/logo.webp"
                onError={(e) => {
                  e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/logo.webp';
                }}
                alt="Webnick"
                className="h-8 md:h-9 w-auto object-contain brightness-0 invert"
              />
              <span className="block text-[11px] text-blue-400 font-sans tracking-wide mt-1">
                Your Digital Growth Partner
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              آژانس تخصصی طراحی وب‌سایت‌های مدرن، پلتفرم‌های فروشگاهی و استراتژی‌های رشد دیجیتال. ما ایده‌های شما را به تجربیات ماندگار وب تبدیل می‌کنیم.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="لینکدین"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="تلگرام"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="یوتیوب"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (Col 2) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="text-sm font-bold text-white mb-4">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-blue-400 transition-colors cursor-pointer">خانه</button></li>
              <li><button onClick={() => onNavigate?.('home', 'services')} className="hover:text-blue-400 transition-colors cursor-pointer">خدمات</button></li>
              <li><button onClick={() => onNavigate?.('home', 'portfolio')} className="hover:text-blue-400 transition-colors cursor-pointer">نمونه‌کارها</button></li>
              <li><button onClick={() => onNavigate?.('home', 'about')} className="hover:text-blue-400 transition-colors cursor-pointer">درباره ما</button></li>
              <li><button onClick={() => onNavigate?.('blog')} className="hover:text-blue-400 transition-colors cursor-pointer text-blue-300 font-semibold">وبلاگ تخصصی</button></li>
              <li><button onClick={() => onNavigate?.('home', 'process')} className="hover:text-blue-400 transition-colors cursor-pointer">فرآیند کار</button></li>
              <li><button onClick={() => onNavigate?.('home', 'faq')} className="hover:text-blue-400 transition-colors cursor-pointer">سوالات متداول</button></li>
            </ul>
          </div>

          {/* Services (Col 3) */}
          <div className="lg:col-span-3 text-right">
            <h4 className="text-sm font-bold text-white mb-4">خدمات تخصصی</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">طراحی سایت اختصاصی</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">فروشگاه اینترنتی مدرن</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">سئو و رتبه‌بندی در گوگل</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">خدمات و اتوماسیون هوش مصنوعی</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">دیجیتال مارکتینگ و تبلیغات</a></li>
            </ul>
          </div>

          {/* Contact Information (Col 3) */}
          <div className="lg:col-span-3 text-right">
            <h4 className="text-sm font-bold text-white mb-4">اطلاعات تماس</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2.5 justify-start">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:02188990000" className="hover:text-white transition-colors tabular-nums">
                  ۰۲۱-۸۸۹۹۰۰۰۰
                </a>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:info@webnick.agency" className="hover:text-white transition-colors">
                  info@webnick.agency
                </a>
              </li>
              <li className="flex items-start gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  تهران، سعادت‌آباد، بلوار فرهنگ، برج نوآوری وبنیک، طبقه ۶
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with copyright and back to top */}
        <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Copyright & Admin link */}
          <div className="flex flex-wrap items-center gap-3 text-center sm:text-right text-slate-500">
            <span>© 2026 Webnick. All rights reserved. تمامی حقوق مادی و معنوی محفوظ است.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <button
              onClick={() => onNavigate?.('admin')}
              className="text-slate-500 hover:text-blue-400 transition-colors text-[11px] cursor-pointer"
            >
              ورود به پنل مدیریت
            </button>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group cursor-pointer"
          >
            <span>بازگشت به بالا</span>
            <div className="w-7 h-7 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>

        </div>

      </div>
    </footer>
  );
};
