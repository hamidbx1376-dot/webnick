import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, PhoneCall } from 'lucide-react';

interface HeaderProps {
  onOpenConsultation: () => void;
  currentPage: 'home' | 'blog';
  onNavigate: (page: 'home' | 'blog', sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenConsultation, 
  currentPage, 
  onNavigate 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (currentPage === 'home') {
        const sections = ['home', 'services', 'portfolio', 'about', 'contact'];
        const scrollPosition = window.scrollY + 200;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const navItems = [
    { id: 'home', label: 'خانه', isPage: 'home' as const },
    { id: 'services', label: 'خدمات', isPage: 'home' as const, section: 'services' },
    { id: 'portfolio', label: 'نمونه‌کارها', isPage: 'home' as const, section: 'portfolio' },
    { id: 'about', label: 'درباره ما', isPage: 'home' as const, section: 'about' },
    { id: 'blog', label: 'وبلاگ', isPage: 'blog' as const },
    { id: 'contact', label: 'تماس با ما', isPage: 'home' as const, section: 'contact' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    onNavigate(item.isPage, item.section);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled || currentPage === 'blog'
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-3.5 border-b border-slate-100'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Right Zone in RTL: Webnick Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 cursor-pointer"
          >
            <img
              src="/files/logo.webp"
              onError={(e) => {
                e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/logo.webp';
              }}
              alt="Webnick"
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </button>

          {/* Center Zone: Nav Links matching UI.png */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = 
                item.id === 'blog' 
                  ? currentPage === 'blog'
                  : currentPage === 'home' && (item.section ? activeSection === item.section : activeSection === 'home');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`relative py-1 transition-colors duration-200 hover:text-blue-700 cursor-pointer ${
                    isActive ? 'text-blue-700 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Zone in RTL: Primary CTA button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0b1c36] hover:bg-blue-900 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <span>مشاوره رایگان</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenConsultation}
              className="p-2 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              aria-label="تماس سریع"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl text-right animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-[#0b1c36] shadow-sm cursor-pointer"
            >
              <span>درخواست مشاوره رایگان</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
