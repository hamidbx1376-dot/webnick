import React, { useState } from 'react';
import { X, ArrowLeft, ExternalLink, Watch, Building2, Coffee, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { projectsData } from '../data/websiteData';

interface AllProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

// Extra projects for complete showcase
const extendedProjects: Project[] = [
  ...projectsData,
  {
    id: 'health-app',
    title: 'سامانه نوبت‌دهی مدیکال‌پلاس',
    category: 'پلتفرم اختصاصی سلامت',
    categoryKey: 'corporate',
    description: 'سامانه یکپارچه نوبت‌دهی آنلاین پزشکان، مشاوره ویدیویی و پرونده الکترونیک سلامت بیماران.',
    results: ['بیش از ۳۵ هزار نوبت ماهانه', 'کاهش ۷۰٪ تماس‌های تلفنی مطب‌ها', 'پایداری ۹۹.۹۸٪'],
    techStack: ['React', 'Next.js', 'WebRTC', 'PostgreSQL'],
    year: '۱۴۰۳',
    client: 'شبکه کلینیک‌های مدیکال',
    accentColor: '#0369a1',
    previewType: 'building'
  },
  {
    id: 'fashion-store',
    title: 'بوتیک آنلاین آدرین',
    category: 'طراحی سایت فروشگاهی پوشاک',
    categoryKey: 'ecommerce',
    description: 'فروشگاه آنلاین فشن با امکان پرو مجازی هوش مصنوعی، فیلتر سایز هوشمند و درگاه پرداخت سریع.',
    results: ['رشد ۲۱۰٪ میانگین سبد خرید', 'کاهش نرخ مرجوعی به زیر ۵٪', 'لود زیر ۰.۹ ثانیه'],
    techStack: ['Tailwind CSS', 'Shopify API', 'React 19'],
    year: '۱۴۰۴',
    client: 'برند پوشاک آدرین',
    accentColor: '#475569',
    previewType: 'watch'
  }
];

export const AllProjectsModal: React.FC<AllProjectsModalProps> = ({
  isOpen,
  onClose,
  onSelectProject
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ecommerce' | 'corporate' | 'cafe'>('all');

  if (!isOpen) return null;

  const filtered = activeCategory === 'all'
    ? extendedProjects
    : extendedProjects.filter(p => p.categoryKey === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto text-right"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="بستن پنجره"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold">پورتفولیو جامع وبنیک</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">
          تمامی نمونه‌کارهای اجرا شده
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          نگاهی به مجموعه‌ای از پروژه‌های موفق وبنیک در حوزه‌های تجارت الکترونیک، سازمانی، خدماتی و رستورانی
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-100">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === 'all' ? 'bg-[#0b1c36] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه پروژه‌ها
          </button>
          <button
            onClick={() => setActiveCategory('ecommerce')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === 'ecommerce' ? 'bg-[#0b1c36] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            فروشگاهی ({extendedProjects.filter(p => p.categoryKey === 'ecommerce').length})
          </button>
          <button
            onClick={() => setActiveCategory('corporate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === 'corporate' ? 'bg-[#0b1c36] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            شرکتی و اختصاصی ({extendedProjects.filter(p => p.categoryKey === 'corporate').length})
          </button>
          <button
            onClick={() => setActiveCategory('cafe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === 'cafe' ? 'bg-[#0b1c36] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            کافه و رستوران ({extendedProjects.filter(p => p.categoryKey === 'cafe').length})
          </button>
        </div>

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                onClose();
                onSelectProject(project);
              }}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-4 shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-32 rounded-xl bg-slate-900 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                  {project.previewType === 'watch' && <Watch className="w-10 h-10 text-slate-400" />}
                  {project.previewType === 'building' && <Building2 className="w-10 h-10 text-sky-400" />}
                  {project.previewType === 'cafe' && <Coffee className="w-10 h-10 text-amber-500" />}
                  <span className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/60 text-white font-mono">
                    {project.year}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                  {project.title}
                </h4>
                <p className="text-xs text-blue-600 font-medium mb-2">{project.category}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 group-hover:text-blue-600 font-semibold">
                <span>مشاهده پرونده کامل</span>
                <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
