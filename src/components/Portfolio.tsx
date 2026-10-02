import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Watch, Building2, Coffee } from 'lucide-react';
import { Project } from '../types';
import { projectsData } from '../data/websiteData';
import { api } from '../services/api';

interface PortfolioProps {
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject, onViewAllProjects }) => {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [filter, setFilter] = useState<'all' | 'ecommerce' | 'corporate' | 'cafe'>('all');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.getPortfolio();
        if (res.projects && res.projects.length > 0) {
          const mapped: Project[] = res.projects.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            categoryKey: p.category_key || 'corporate',
            description: p.short_description || '',
            results: p.results || [],
            techStack: p.tech_stack || [],
            year: p.year || '۱۴۰۴',
            client: p.client_name || '',
            accentColor: p.accent_color || '#2563eb',
            previewType: p.preview_type || 'building',
          }));
          setProjects(mapped);
        }
      } catch (e) {
        // fallback to projectsData
      }
    };
    fetchPortfolio();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.categoryKey === filter);

  return (
    <section id="portfolio" className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row with Centered Title and Left-aligned "مشاهده همه" matching UI.png */}
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-8 md:mb-10 gap-4">
          <div className="hidden md:block w-32" /> {/* Spacer to balance layout */}

          <div className="text-center">
            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mb-2.5" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              نمونه‌کارهای ما
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              چند نمونه از پروژه‌هایی که افتخار انجام دادیم
            </p>
          </div>

          <div className="w-full md:w-32 flex justify-center md:justify-start">
            <button
              onClick={onViewAllProjects}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3-Column Grid matching reference UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1.5"
            >
              {/* Project Image / Mockup Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                
                {/* Watch Store preview artwork */}
                {project.previewType === 'watch' && (
                  <div className="w-full h-full relative bg-gradient-to-br from-[#0c0f17] via-[#151a24] to-[#0a0d14] flex items-center justify-between p-6">
                    {/* Dark web browser chrome */}
                    <div className="absolute top-2.5 right-4 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>

                    <div className="space-y-1.5 z-10 max-w-[55%] text-right">
                      <span className="text-[10px] text-amber-400 font-mono tracking-wider">LIMITED CHRONO</span>
                      <h4 className="text-white text-base font-bold leading-tight">شاهکار مهندسی زمان</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">خرید آنلاین مجموعه‌های سفارشی با گارانتی اصالت بین‌المللی</p>
                      <div className="pt-1">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-blue-600/80 text-white">مشاهده مدل‌ها</span>
                      </div>
                    </div>

                    {/* Stylized Luxury Watch Graphic */}
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <div className="w-24 h-24 rounded-full border-4 border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center relative">
                        {/* Watch bezel marks */}
                        <div className="absolute inset-1 rounded-full border border-slate-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 z-10" />
                        {/* Watch hands */}
                        <div className="absolute top-4 w-0.5 h-7 bg-slate-200 transform -rotate-45 origin-bottom" />
                        <div className="absolute top-6 w-0.5 h-5 bg-amber-400 transform rotate-45 origin-bottom" />
                        <Watch className="w-6 h-6 text-slate-700/60" />
                      </div>
                      {/* Watch Straps */}
                      <div className="absolute -top-3 w-10 h-3 bg-slate-800 rounded-t-sm" />
                      <div className="absolute -bottom-3 w-10 h-3 bg-slate-800 rounded-b-sm" />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Aryan Construction preview artwork */}
                {project.previewType === 'building' && (
                  <div className="w-full h-full relative bg-gradient-to-tr from-[#0a192f] via-[#1e293b] to-[#334155] flex items-center justify-between p-6">
                    <div className="absolute top-2.5 right-4 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>

                    <div className="space-y-1.5 z-10 max-w-[55%] text-right">
                      <span className="text-[10px] text-sky-400 font-mono tracking-wider">ARCHITECTURE 2026</span>
                      <h4 className="text-white text-base font-bold leading-tight">سازه پایدار، آینده ماندگار</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2">طراحی و اجرای مجتمع‌های چندمنظوره لوکس و استاندارد سبز</p>
                      <div className="pt-1">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-sky-600/80 text-white">پورتفولیو پروژه‌ها</span>
                      </div>
                    </div>

                    {/* Skyscraper Glass Architectural Illustration */}
                    <div className="relative w-28 h-28 flex items-end justify-center gap-1 shrink-0 pb-1">
                      <div className="w-8 h-24 bg-gradient-to-t from-blue-900 to-sky-700 rounded-t border-t border-sky-400/50 flex flex-col justify-around p-1 shadow-lg">
                        <div className="w-full h-1 bg-sky-300/30 rounded-xs" />
                        <div className="w-full h-1 bg-sky-300/30 rounded-xs" />
                        <div className="w-full h-1 bg-sky-300/30 rounded-xs" />
                        <div className="w-full h-1 bg-sky-300/30 rounded-xs" />
                      </div>
                      <div className="w-10 h-28 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t border-t border-sky-300/50 flex flex-col justify-around p-1 shadow-2xl">
                        <div className="w-full h-1 bg-sky-200/40 rounded-xs" />
                        <div className="w-full h-1 bg-sky-200/40 rounded-xs" />
                        <div className="w-full h-1 bg-sky-200/40 rounded-xs" />
                        <div className="w-full h-1 bg-sky-200/40 rounded-xs" />
                        <div className="w-full h-1 bg-sky-200/40 rounded-xs" />
                      </div>
                      <div className="w-7 h-20 bg-gradient-to-t from-blue-950 to-indigo-800 rounded-t border-t border-indigo-400/50 flex flex-col justify-around p-1 shadow-md">
                        <div className="w-full h-1 bg-indigo-300/30 rounded-xs" />
                        <div className="w-full h-1 bg-indigo-300/30 rounded-xs" />
                        <div className="w-full h-1 bg-indigo-300/30 rounded-xs" />
                      </div>
                      <Building2 className="absolute top-2 left-2 w-5 h-5 text-sky-400/30" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Cafe Latte preview artwork */}
                {project.previewType === 'cafe' && (
                  <div className="w-full h-full relative bg-gradient-to-br from-[#1c130d] via-[#2d1b10] to-[#140c08] flex items-center justify-between p-6">
                    <div className="absolute top-2.5 right-4 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-stone-700" />
                      <div className="w-2 h-2 rounded-full bg-stone-700" />
                      <div className="w-2 h-2 rounded-full bg-stone-700" />
                    </div>

                    <div className="space-y-1.5 z-10 max-w-[55%] text-right">
                      <span className="text-[10px] text-amber-500 font-mono tracking-wider">SPECIALTY COFFEE</span>
                      <h4 className="text-white text-base font-bold leading-tight">طعم اصیل قهوه تخصصی</h4>
                      <p className="text-[11px] text-amber-200/70 line-clamp-2">منوی آنلاین تعاملی و رزرو میز اختصاصی با سیستم QR هوشمند</p>
                      <div className="pt-1">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-amber-700/80 text-white">مشاهده منو</span>
                      </div>
                    </div>

                    {/* Artisan Latte Cup Illustration */}
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <div className="w-22 h-22 rounded-full bg-[#3d2415] border-4 border-[#52331f] shadow-2xl flex items-center justify-center p-2 relative">
                        {/* Coffee surface with rosetta latte art */}
                        <div className="w-full h-full rounded-full bg-[#4a2e1b] flex items-center justify-center overflow-hidden relative">
                          {/* Latte Art leaf curves */}
                          <div className="w-12 h-12 rounded-full border-2 border-amber-100/60 transform rotate-45 scale-y-75" />
                          <div className="absolute w-8 h-8 rounded-full border-2 border-amber-100/70 transform rotate-45 scale-y-75" />
                          <div className="absolute w-4 h-4 rounded-full bg-amber-100/80" />
                        </div>
                      </div>
                      <Coffee className="absolute top-1 left-2 w-5 h-5 text-amber-500/30" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-semibold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                    <span>مشاهده جزئیات پروژه</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </span>
                </div>
              </div>

              {/* Card Footer: Title, Category & Action Button matching reference */}
              <div className="p-5 flex items-center justify-between">
                
                {/* Right in RTL: Title & Category */}
                <div className="text-right">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {project.category}
                  </span>
                </div>

                {/* Left in RTL: Round Arrow Action Button */}
                <div className="w-9 h-9 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center group-hover:bg-[#0b1c36] group-hover:text-white transition-all duration-300 shadow-2xs group-hover:shadow-xs">
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
