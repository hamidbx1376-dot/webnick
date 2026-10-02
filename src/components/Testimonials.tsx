import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { testimonialsData } from '../data/websiteData';
import { Testimonial } from '../types';
import { api } from '../services/api';

export const Testimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>(testimonialsData);

  useEffect(() => {
    const fetchTst = async () => {
      try {
        const res = await api.getTestimonials();
        if (res.testimonials && res.testimonials.length > 0) {
          const mapped: Testimonial[] = res.testimonials.map((t: any) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            company: t.company,
            quote: t.quote,
            rating: t.rating || 5,
            avatarColor: t.avatar_color || '#3b82f6',
          }));
          setItems(mapped);
        }
      } catch (e) {
        // fallback
      }
    };
    fetchTst();
  }, []);

  return (
    <section id="testimonials" className="py-12 md:py-16 bg-[#fcfdff] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mb-2.5" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            نظرات مشتریان
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            تجربه همکاری با وبنیک از زبان مدیران برندها و کسب‌وکارهایی که به ما اعتماد کردند
          </p>
        </div>

        {/* Multiple Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-right relative overflow-hidden group hover:-translate-y-1"
            >
              {/* Subtle background quote mark */}
              <div className="absolute top-3 left-4 text-blue-100/50 pointer-events-none">
                <Quote className="w-10 h-10 rotate-180" />
              </div>

              <div>
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between mb-3.5 relative z-10">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>پروژه تحویل شده</span>
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed mb-4 relative z-10">
                  «{item.quote}»
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3 relative z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.name.charAt(0)}
                </div>
                <div className="text-right overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {item.role} - {item.company}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
