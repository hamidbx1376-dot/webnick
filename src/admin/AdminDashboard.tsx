import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { PasswordChangePage } from './pages/PasswordChangePage';
import { AdminLayout, AdminTab } from './AdminLayout';

// Subpages
import { DashboardOverview } from './pages/DashboardOverview';
import { LeadsPage } from './pages/LeadsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ServicesCMS } from './pages/ServicesCMS';
import { PortfolioCMS } from './pages/PortfolioCMS';
import { BlogCMS } from './pages/BlogCMS';
import { FAQsCMS } from './pages/FAQsCMS';
import { TestimonialsCMS } from './pages/TestimonialsCMS';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { SectionsCMS } from './pages/SectionsCMS';
import { NavigationCMS } from './pages/NavigationCMS';
import { SettingsPage } from './pages/SettingsPage';
import { SEOPage } from './pages/SEOPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  initialTab?: AdminTab;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome, initialTab = 'dashboard' }) => {
  const { isAuthenticated, mustChangePassword, isLoading, refreshUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071324] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">در حال بررسی نشست کاربری...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> Show clean login page
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {}}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  // Authenticated BUT must change default password -> Show mandatory password change screen!
  if (mustChangePassword) {
    return (
      <PasswordChangePage
        onSuccess={() => {}}
      />
    );
  }

  // Authenticated and password changed -> Render full Admin Dashboard
  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onNavigateHome={onNavigateHome}
    >
      {currentTab === 'dashboard' && <DashboardOverview onNavigateTab={setCurrentTab} />}
      {currentTab === 'leads' && <LeadsPage />}
      {currentTab === 'messages' && <MessagesPage />}
      {currentTab === 'portfolio' && <PortfolioCMS />}
      {currentTab === 'services' && <ServicesCMS />}
      {currentTab === 'blog' && <BlogCMS />}
      {currentTab === 'faqs' && <FAQsCMS />}
      {currentTab === 'testimonials' && <TestimonialsCMS />}
      {currentTab === 'media' && <MediaLibraryPage />}
      {currentTab === 'pages' && <SectionsCMS />}
      {currentTab === 'navigation' && <NavigationCMS />}
      {currentTab === 'seo' && <SEOPage />}
      {currentTab === 'analytics' && <AnalyticsPage />}
      {currentTab === 'users' && <UsersPage />}
      {currentTab === 'settings' && <SettingsPage />}
      {currentTab === 'audit-logs' && <AuditLogsPage />}
    </AdminLayout>
  );
};
