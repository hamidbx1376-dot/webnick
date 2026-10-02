import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { WhyWebnick } from './components/WhyWebnick';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { FloatingUI } from './components/FloatingUI';
import { ConsultationModal } from './components/ConsultationModal';
import { ServiceModal } from './components/ServiceModal';
import { ProjectModal } from './components/ProjectModal';
import { AllProjectsModal } from './components/AllProjectsModal';
import { BlogPage } from './components/BlogPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminTab } from './admin/AdminLayout';
import { Service, Project } from './types';

function getInitialRoute(): { mode: 'public' | 'admin'; page: 'home' | 'blog'; adminTab?: AdminTab } {
  if (typeof window === 'undefined') return { mode: 'public', page: 'home' };

  const pathname = window.location.pathname;
  const hash = window.location.hash;

  if (pathname.startsWith('/admin') || hash.startsWith('#admin') || hash.startsWith('#/admin')) {
    // Extract subtab
    const pathPart = pathname.replace('/admin', '').replace(/^\//, '');
    const hashPart = hash.replace(/^#(admin|\/admin)/, '').replace(/^\//, '');
    const sub = pathPart || hashPart;

    const validTabs: AdminTab[] = [
      'dashboard',
      'leads',
      'messages',
      'portfolio',
      'services',
      'blog',
      'faqs',
      'testimonials',
      'media',
      'pages',
      'navigation',
      'seo',
      'analytics',
      'users',
      'settings',
      'audit-logs',
    ];

    const matchedTab = validTabs.find((t) => t === sub) || 'dashboard';
    return { mode: 'admin', page: 'home', adminTab: matchedTab };
  }

  if (pathname.startsWith('/blog') || hash === '#blog') {
    return { mode: 'public', page: 'blog' };
  }

  return { mode: 'public', page: 'home' };
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);
  const [preselectedServiceTitle, setPreselectedServiceTitle] = useState('طراحی سایت اختصاصی');

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = (page: 'home' | 'blog' | 'admin', sectionId?: string) => {
    if (page === 'admin') {
      try {
        window.history.pushState({}, '', '/admin');
      } catch (e) {
        // fallback for sandbox
      }
      window.location.hash = '#admin';
      setRoute({ mode: 'admin', page: 'home', adminTab: 'dashboard' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'blog') {
      try {
        window.history.pushState({}, '', '/blog');
      } catch (e) {}
      window.location.hash = '#blog';
      setRoute({ mode: 'public', page: 'blog' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      try {
        window.history.pushState({}, '', '/');
      } catch (e) {}

      if (window.location.hash.startsWith('#admin') || window.location.hash === '#blog') {
        window.location.hash = sectionId ? `#${sectionId}` : '';
      }

      setRoute({ mode: 'public', page: 'home' });

      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenConsultationWithService = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedServiceTitle(serviceTitle);
    }
    setIsConsultationOpen(true);
  };

  return (
    <AuthProvider>
      {route.mode === 'admin' ? (
        /* ============================================================== */
        /* PRODUCTION ADMIN DASHBOARD (Accessible at /admin) */
        /* ============================================================== */
        <AdminDashboard
          initialTab={route.adminTab || 'dashboard'}
          onNavigateHome={() => handleNavigate('home')}
        />
      ) : (
        /* ============================================================== */
        /* PUBLIC WEBNICK WEBSITE */
        /* ============================================================== */
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white antialiased flex flex-col justify-between">
          
          {/* 1. Header / Navigation */}
          <Header
            currentPage={route.page}
            onNavigate={(p, s) => handleNavigate(p, s)}
            onOpenConsultation={() => handleOpenConsultationWithService()}
          />

          <main className="grow">
            {route.page === 'blog' ? (
              /* Dedicated Blog Page View */
              <BlogPage
                onOpenConsultation={() => handleOpenConsultationWithService()}
                onNavigateHome={() => handleNavigate('home')}
              />
            ) : (
              /* One-Page Webnick Landing Experience */
              <>
                {/* 2. Hero Section (Spacious desktop spacing) */}
                <Hero onOpenConsultation={() => handleOpenConsultationWithService()} />

                {/* 3. Services Section */}
                <Services onSelectService={(service) => setSelectedService(service)} />

                {/* 4. Portfolio / Selected Projects */}
                <Portfolio
                  onSelectProject={(project) => setSelectedProject(project)}
                  onViewAllProjects={() => setIsAllProjectsOpen(true)}
                />

                {/* 5. Why Webnick («چرا وبنیک؟») */}
                <WhyWebnick />

                {/* 6. Work Process («فرآیند کار ما») */}
                <Process />

                {/* 7. Testimonials («نظرات مشتریان») */}
                <Testimonials />

                {/* 8. FAQ («سوالات متداول») */}
                <FAQ />

                {/* 9. Final Dedicated Consultation Call To Action (BEFORE Footer) */}
                <FinalCTA onOpenConsultation={() => handleOpenConsultationWithService()} />
              </>
            )}
          </main>

          {/* 10. Footer (Dark Navy, Visually Separate) */}
          <Footer
            onOpenConsultation={() => handleOpenConsultationWithService()}
            onNavigate={(p, s) => handleNavigate(p, s)}
          />

          {/* Floating Action Button & Back to Top (Appears after scroll) */}
          <FloatingUI onOpenConsultation={() => handleOpenConsultationWithService()} />

          {/* Interactive Modals */}
          <ConsultationModal
            isOpen={isConsultationOpen}
            onClose={() => setIsConsultationOpen(false)}
            preselectedService={preselectedServiceTitle}
          />

          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onRequestService={(title) => handleOpenConsultationWithService(title)}
          />

          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onRequestSimilar={(title: string) => handleOpenConsultationWithService(title)}
          />

          <AllProjectsModal
            isOpen={isAllProjectsOpen}
            onClose={() => setIsAllProjectsOpen(false)}
            onSelectProject={(project) => {
              setIsAllProjectsOpen(false);
              setSelectedProject(project);
            }}
          />
        </div>
      )}
    </AuthProvider>
  );
}
