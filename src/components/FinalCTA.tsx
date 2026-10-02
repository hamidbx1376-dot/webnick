import React, { useState, useEffect } from 'react';
import { Phone, MessageSquareText, Clock, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface FinalCTAProps {
  onOpenConsultation: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenConsultation }) => {
  const [data, setData] = useState({
    title: 'برای مشاوره رایگان با ما در ارتباط باشید',
    subtitle: 'نیاز کسب‌وکارتان را با ما در میان بگذارید؛ کارشناسان وب‌نیک آماده‌اند تا بهترین مسیر را برای حضور آنلاین و رشد شما پیشنهاد دهند.',
    eyebrow: 'هنوز مطمئن نیستید؟',
    image: '/files/footer.webp',
    primaryButton: 'درخواست مشاوره رایگان',
    secondaryButton: 'تماس با ما (۰۲۱-۸۸۹۹۰۰۰۰)',
    phone: '02188990000',
    perks: ['مشاوره کاملاً رایگان', 'پاسخگویی سریع', 'ارائه راهکار اختصاصی'],
  });

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await api.getSections();
        if (res.sections) {
          const cta = res.sections.find((s: any) => s.section_key === 'final_cta');
          if (cta) {
            setData((prev) => ({
              ...prev,
              title: cta.title || prev.title,
              subtitle: cta.subtitle || prev.subtitle,
              eyebrow: cta.eyebrow || prev.eyebrow,
              image: cta.content?.image_url || prev.image,
              primaryButton: cta.content?.primary_button_text || prev.primaryButton,
              secondaryButton: cta.content?.secondary_button_text || prev.secondaryButton,
              phone: cta.content?.phone_number || prev.phone,
              perks: cta.content?.perks || prev.perks,
            }));
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchSection();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-[#081528] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b1c36] via-[#0f284e] to-[#0b1c36] border border-blue-900/60 shadow-2xl p-8 sm:p-12 lg:p-14">
          
          {/* Subtle geometric & light effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Visual Area in RTL: Ending Photo matching UI.png */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center items-center">
              <div className="relative w-full max-w-[360px] flex items-center justify-center select-none group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl -z-10 scale-90" />
                
                <img
                  src={data.image}
                  onError={(e) => {
                    e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/footer.webp';
                  }}
                  alt="Webnick Consultation"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Content Area in RTL (Headlines, CTAs, Feature List) */}
            <div className="lg:col-span-7 order-1 lg:order-2 text-right">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>{data.eyebrow}</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4 leading-snug">
                {data.title}
              </h2>

              {/* Supporting Copy */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
                {data.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5"
                >
                  <MessageSquareText className="w-4 h-4 text-blue-700" />
                  <span>{data.primaryButton}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${data.phone}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>{data.secondaryButton}</span>
                </a>
              </div>

              {/* 3 Key Trust Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-slate-300">
                {data.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
