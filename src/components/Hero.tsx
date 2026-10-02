import React, { useState, useEffect } from 'react';
import { ArrowLeft, Headphones, Smile, ThumbsUp } from 'lucide-react';
import { HeroLaptopScene } from './HeroLaptopScene';
import { api } from '../services/api';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  const [heroData, setHeroData] = useState({
    eyebrow: 'آژانس طراحی سایت و توسعه وب',
    title: 'وب‌سایتی برای رشد کسب‌وکار شما',
    subtitle: 'ما در وب‌نیک، فقط سایت نمی‌سازیم؛ به کسب‌وکارها کمک می‌کنیم تا در دنیای دیجیتال، دیده شوند، اعتماد، رشد و پیشرفت داشته باشند.',
    primaryCta: 'مشاوره رایگان',
    secondaryCta: 'مشاهده نمونه‌کارها',
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.getSections();
        if (res.sections) {
          const hero = res.sections.find((s: any) => s.section_key === 'hero');
          if (hero) {
            setHeroData((prev) => ({
              ...prev,
              eyebrow: hero.eyebrow || prev.eyebrow,
              title: hero.title || prev.title,
              subtitle: hero.subtitle || prev.subtitle,
              primaryCta: hero.content?.primary_cta_text || prev.primaryCta,
              secondaryCta: hero.content?.secondary_cta_text || prev.secondaryCta,
            }));
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchHero();
  }, []);

  return (
    <section 
      id="home" 
      className="relative pt-24 pb-8 md:pt-28 md:pb-10 overflow-hidden bg-gradient-to-b from-blue-50/20 via-white to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Right Column in RTL: Content & Typography exactly matching UI.png */}
          <div className="lg:col-span-6 flex flex-col items-start text-right z-10">
            
            {/* Eyebrow kicker matching UI.png */}
            <div className="mb-3 text-slate-500 text-xs sm:text-sm font-medium">
              <span>{heroData.eyebrow}</span>
            </div>

            {/* Display Headline in Vazir Bold */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-900 leading-[1.28] tracking-tight mb-5"
              style={{ fontFamily: 'Vazir, Vazirmatn, sans-serif' }}
            >
              {heroData.title}
            </h1>

            {/* Supporting Copy matching UI.png */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              {heroData.subtitle}
            </p>

            {/* Dual CTA Buttons matching UI.png */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              {/* Primary Navy Button */}
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#0b1c36] hover:bg-blue-900 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{heroData.primaryCta}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Secondary White/Border Button */}
              <a
                href="#portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <span>{heroData.secondaryCta}</span>
              </a>
            </div>

            {/* 3 Compact Trust Badges matching UI.png */}
            <div className="w-full pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 sm:gap-6 text-slate-500 text-xs font-medium">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-blue-600" />
                <span>+۴۸۰ پروژه موفق</span>
              </div>
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-500" />
                <span>+۹۸٪ رضایت مشتریان</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-500" />
                <span>پشتیبانی مداوم</span>
              </div>
            </div>

          </div>

          {/* Left Column in RTL: Clean Laptop Scene */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <HeroLaptopScene onOpenConsultation={onOpenConsultation} />
          </div>

        </div>
      </div>
    </section>
  );
};
