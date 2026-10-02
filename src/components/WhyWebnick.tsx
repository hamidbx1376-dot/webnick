import React from 'react';
import { Star, Headphones, BarChart2, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import { valuePropsData } from '../data/websiteData';

export const WhyWebnick: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'star':
        return <Star className="w-5 h-5 text-blue-600 stroke-[2]" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 text-blue-600 stroke-[2]" />;
      case 'chart':
        return <BarChart2 className="w-5 h-5 text-blue-600 stroke-[2]" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-blue-600 stroke-[2]" />;
      default:
        return <Star className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="about" className="py-12 md:py-16 bg-[#f8faff] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column in RTL (Visual Card with Phone & Modern Typography) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/70 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
                
                {/* Visual Artwork: Desk dock with Smartphone & Succulent */}
                <div className="relative w-44 h-60 shrink-0 bg-gradient-to-b from-slate-100 to-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-between border border-slate-200/60 shadow-inner">
                  {/* Smartphone */}
                  <div className="w-28 h-44 bg-slate-900 rounded-xl border-2 border-slate-700 shadow-xl overflow-hidden flex flex-col">
                    {/* Phone speaker notch */}
                    <div className="h-3 bg-slate-800 flex items-center justify-center">
                      <div className="w-6 h-1 bg-slate-600 rounded-full" />
                    </div>
                    {/* Screen content */}
                    <div className="grow bg-[#0c182d] p-2 flex flex-col justify-between text-white text-right">
                      <div className="flex items-center justify-between text-[7px] text-blue-300">
                        <span className="font-bold">Webnick</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="w-16 h-1.5 bg-blue-500 rounded-xs" />
                        <div className="w-12 h-1 bg-slate-400 rounded-xs" />
                      </div>
                      <div className="bg-blue-600 rounded-sm py-0.5 text-center text-[7px] font-semibold">
                        سفارش آنلاین
                      </div>
                    </div>
                  </div>

                  {/* Wooden Stand Base */}
                  <div className="w-32 h-3 bg-amber-800/80 rounded-sm shadow-md" />

                  {/* Potted succulent plant */}
                  <div className="absolute -bottom-2 -left-2 flex flex-col items-center">
                    {/* Green Succulent leaves */}
                    <div className="flex items-end justify-center -space-x-1 mb-0.5">
                      <div className="w-3 h-5 bg-emerald-600 rounded-t-full transform -rotate-12" />
                      <div className="w-3.5 h-6 bg-emerald-500 rounded-t-full z-10" />
                      <div className="w-3 h-5 bg-emerald-600 rounded-t-full transform rotate-12" />
                    </div>
                    {/* Ceramic pot */}
                    <div className="w-8 h-7 bg-white border border-slate-300 rounded-b-md shadow-xs flex items-center justify-center">
                      <div className="w-6 h-0.5 bg-amber-900/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Typography Block matching reference */}
                <div className="text-right space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>استاندارد Responsive</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    طراحی مدرن <br />
                    <span className="text-blue-700">تجربه کاربری عالی</span>
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    سایت شما، ویترین اصلی برند شماست و شایسته زیباترین طراحی، بالاترین سرعت و بهترین تجربه کاربری برای مشتریان شماست.
                  </p>

                  <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>طراحی متناسب با روانشناسی رنگ و رفتار کاربر ایرانی</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>بهینه‌سازی کامل برای موتورهای جستجو و هوش مصنوعی</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column in RTL (Header & 2x2 Value Props) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            
            {/* Centered Header */}
            <div className="text-center flex flex-col items-center mb-8">
              <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mb-2.5" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                چرا وبنیک؟
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                ما متفاوت فکر می‌کنیم و متفاوت عمل می‌کنیم.
              </p>
            </div>

            {/* 2x2 Value Props Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {valuePropsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/70 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col text-right group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(item.iconType)}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <span className="text-xs text-blue-600 font-medium mb-2">
                    {item.subtitle}
                  </span>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
