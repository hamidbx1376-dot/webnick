import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Monitor, Bot, ArrowLeft, BarChart3 } from 'lucide-react';
import { Service } from '../types';
import { servicesData } from '../data/websiteData';
import { api } from '../services/api';

interface ServicesProps {
  onSelectService: (service: Service) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<Service[]>(servicesData);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices();
        if (res.services && res.services.length > 0) {
          const mapped: Service[] = res.services.map((s: any) => ({
            id: s.id,
            title: s.title,
            shortDesc: s.short_desc,
            longDesc: s.long_desc || s.short_desc,
            iconType: s.icon_type,
            deliverables: s.deliverables || [],
            duration: s.duration || '',
          }));
          setServices(mapped);
        }
      } catch (e) {
        // use fallback seed
      }
    };
    fetchServices();
  }, []);
  const getIcon = (iconType: Service['iconType']) => {
    switch (iconType) {
      case 'seo':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            SEO
          </div>
        );
      case 'search':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-700">
            <Search className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'code':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-700">
            <Monitor className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'marketing':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-700">
            <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'ai':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-700">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <BarChart3 className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <section id="services" className="py-12 md:py-16 bg-[#fafcff] border-t border-b border-slate-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mb-2.5" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            خدمات ما
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-normal">
            همه چیزهایی که برای حضور حرفه‌ای در دنیای آنلاین نیاز دارید
          </p>
        </div>

        {/* 5-Column Grid matching reference UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {servicesData.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/70 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1.5"
            >
              {/* Icon Container */}
              <div className="mb-5 group-hover:scale-110 transition-transform duration-300">
                {getIcon(service.iconType)}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 mb-2.5 group-hover:text-blue-700 transition-colors">
                {service.title}
              </h3>

              {/* Short Description */}
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-6 grow">
                {service.shortDesc}
              </p>

              {/* Action indicator */}
              <div className="pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>جزئیات و تعرفه</span>
                <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
