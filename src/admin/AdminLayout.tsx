import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UsersRound,
  MessageSquare,
  Briefcase,
  Layers,
  BookOpen,
  HelpCircle,
  Quote,
  Image as ImageIcon,
  FileText,
  Compass,
  Search,
  BarChart3,
  ShieldCheck,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'messages'
  | 'portfolio'
  | 'services'
  | 'blog'
  | 'faqs'
  | 'testimonials'
  | 'media'
  | 'pages'
  | 'navigation'
  | 'seo'
  | 'analytics'
  | 'users'
  | 'settings'
  | 'audit-logs';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateHome,
  children,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Badge counts
  const [leadCounts, setLeadCounts] = useState({ new: 0 });
  const [msgCounts, setMsgCounts] = useState({ unread: 0 });

  const fetchBadgeCounts = async () => {
    try {
      const [leadsRes, msgsRes, notifsRes] = await Promise.all([
        api.getLeads({ limit: 1 }),
        api.getMessages('ACTIVE'),
        api.getNotifications(),
      ]);

      if (leadsRes.counts) setLeadCounts({ new: leadsRes.counts.new || 0 });
      if (msgsRes.unreadCount !== undefined) setMsgCounts({ unread: msgsRes.unreadCount || 0 });
      if (notifsRes.notifications) {
        setNotifications(notifsRes.notifications);
        setUnreadNotifCount(notifsRes.unreadCount || 0);
      }
    } catch (e) {
      // quiet fail on badge refresh
    }
  };

  useEffect(() => {
    fetchBadgeCounts();
    const interval = setInterval(fetchBadgeCounts, 30000); // 30 sec polling
    return () => clearInterval(interval);
  }, []);

  // Handle global search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.searchGlobal(searchQuery);
        if (res.results) {
          setSearchResults(res.results);
        }
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'داشبورد اصلی', icon: LayoutDashboard },
    { id: 'leads' as AdminTab, label: 'سرنخ‌های مشاوره', icon: UsersRound, badge: leadCounts.new },
    { id: 'messages' as AdminTab, label: 'پیام‌های تماس', icon: MessageSquare, badge: msgCounts.unread },
    { id: 'portfolio' as AdminTab, label: 'نمونه‌کارها', icon: Briefcase },
    { id: 'services' as AdminTab, label: 'خدمات', icon: Layers },
    { id: 'blog' as AdminTab, label: 'وبلاگ', icon: BookOpen },
    { id: 'faqs' as AdminTab, label: 'سوالات متداول', icon: HelpCircle },
    { id: 'testimonials' as AdminTab, label: 'نظرات مشتریان', icon: Quote },
    { id: 'media' as AdminTab, label: 'کتابخانه چندرسانه‌ای', icon: ImageIcon },
    { id: 'pages' as AdminTab, label: 'صفحات و بخش‌ها', icon: FileText },
    { id: 'navigation' as AdminTab, label: 'منوی ناوبری', icon: Compass },
    { id: 'seo' as AdminTab, label: 'تنظیمات سئو', icon: Search },
    { id: 'analytics' as AdminTab, label: 'آمار و گزارشات', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'کاربران و دسترسی‌ها', icon: ShieldCheck, requiresSuperAdmin: true },
    { id: 'settings' as AdminTab, label: 'تنظیمات عمومی', icon: Settings },
    { id: 'audit-logs' as AdminTab, label: 'لاگ‌های سیستمی', icon: History },
  ];

  const handleSelectSearchResult = (result: any) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (result.type === 'lead') onTabChange('leads');
    else if (result.type === 'service') onTabChange('services');
    else if (result.type === 'portfolio') onTabChange('portfolio');
    else if (result.type === 'blog') onTabChange('blog');
    else if (result.type === 'message') onTabChange('messages');
    else if (result.type === 'media') onTabChange('media');
  };

  const markAllRead = async () => {
    await api.markAllNotificationsRead();
    setUnreadNotifCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 font-sans antialiased flex flex-row-reverse text-right selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* ============================================================== */}
      {/* 1. SIDEBAR (Fixed Right in RTL) */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-[#081528] border-l border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/files/logo.webp"
                onError={(e) => {
                  e.currentTarget.src = 'https://raw.githubusercontent.com/hamidbx1376-dot/webnick/main/files/logo.webp';
                }}
                alt="Webnick Admin"
                className="h-7 w-auto object-contain rounded-md"
              />
              <div>
                <span className="block text-xs font-black text-white">پنل مدیریت وبنیک</span>
                <span className="block text-[10px] text-blue-400 font-sans">CMS & Leads Engine</span>
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Scrollable) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar text-xs font-medium">
            {navItems.map((item) => {
              if (item.requiresSuperAdmin && user?.role !== 'SUPER_ADMIN') {
                return null;
              }

              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User profile & Logout at bottom */}
          <div className="p-3 border-t border-slate-800/80 bg-[#06101f]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="truncate text-right">
                  <span className="block text-xs font-bold text-white truncate">{user?.name}</span>
                  <span className="block text-[10px] text-blue-400 truncate">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="خروج از حساب"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64 min-h-screen">
        
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-16 px-4 sm:px-6 flex items-center justify-between">
          
          {/* Right side: Mobile menu toggle + Global search trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Button */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">جستجوی هوشمند در کل پنل...</span>
                <span className="inline sm:hidden">جستجو</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-400 border border-slate-200">
                  Ctrl+K
                </kbd>
              </button>

              {/* Search Dropdown Modal */}
              {searchOpen && (
                <div className="absolute top-10 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-right">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="عنوان سرنخ، خدمت، نمونه‌کار یا پیام..."
                      autoFocus
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-right"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1 text-xs">
                    {isSearching ? (
                      <p className="text-center py-4 text-slate-400">در حال جستجو...</p>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((r, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectSearchResult(r)}
                          className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-800">{r.title}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">
                              {r.typeLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{r.subtitle}</p>
                        </div>
                      ))
                    ) : searchQuery ? (
                      <p className="text-center py-4 text-slate-400">نتیجه‌ای یافت نشد</p>
                    ) : (
                      <p className="text-center py-4 text-slate-400 text-[11px]">عبارتی را برای جستجو تایپ کنید</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Left side: View Public Site, Notifications, User info */}
          <div className="flex items-center gap-3">
            
            {/* View public website */}
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>مشاهده سایت</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="اعلان‌ها"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute top-10 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-right">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">اعلان‌های جدید</span>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        خواندن همه
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1.5 text-xs">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            n.is_read ? 'bg-slate-50/60 border-slate-100' : 'bg-blue-50/60 border-blue-200'
                          }`}
                        >
                          <div className="font-bold text-slate-800 mb-0.5">{n.title}</div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-slate-400">اعلانی وجود ندارد</p>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};
