import React, { useState, useEffect } from 'react';
import {
  UsersRound,
  MessageSquare,
  Briefcase,
  Layers,
  BookOpen,
  ArrowUpRight,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminTab } from '../AdminLayout';

interface DashboardOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalProjects: 0,
    totalServices: 0,
    totalBlogPosts: 0,
    totalTestimonials: 0,
  });

  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentAudit, setRecentAudit] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [leadsRes, msgsRes, prjRes, srvRes, blogRes, tstRes, auditRes] = await Promise.all([
          api.getLeads({ limit: 5 }),
          api.getMessages(),
          api.getPortfolio('', true),
          api.getServices(true),
          api.getBlogPosts('', '', true),
          api.getTestimonials(true),
          api.getAuditLogs({ limit: 5 }),
        ]);

        setStats({
          totalLeads: leadsRes.total || 0,
          newLeads: leadsRes.counts?.new || 0,
          totalMessages: msgsRes.total || 0,
          unreadMessages: msgsRes.unreadCount || 0,
          totalProjects: prjRes.projects?.length || 0,
          totalServices: srvRes.services?.length || 0,
          totalBlogPosts: blogRes.posts?.length || 0,
          totalTestimonials: tstRes.testimonials?.length || 0,
        });

        setRecentLeads(leadsRes.leads || []);
        setRecentMessages((msgsRes.messages || []).slice(0, 5));
        setRecentAudit(auditRes.logs || []);
      } catch (err) {
        console.error('Failed to load dashboard overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">در حال بارگذاری اطلاعات پایگاه داده...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'سرنخ‌های مشاوره',
      value: stats.totalLeads,
      subValue: `${stats.newLeads} مورد جدید نیازمند تماس`,
      icon: UsersRound,
      color: 'bg-blue-600 text-white',
      badgeColor: 'text-blue-600 bg-blue-50',
      tab: 'leads' as AdminTab,
    },
    {
      title: 'پیام‌های دریافتی',
      value: stats.totalMessages,
      subValue: `${stats.unreadMessages} پیام خوانده نشده`,
      icon: MessageSquare,
      color: 'bg-emerald-600 text-white',
      badgeColor: 'text-emerald-600 bg-emerald-50',
      tab: 'messages' as AdminTab,
    },
    {
      title: 'پروژه‌های نمونه‌کار',
      value: stats.totalProjects,
      subValue: 'پروژه‌های فعال در ویترین سایت',
      icon: Briefcase,
      color: 'bg-amber-600 text-white',
      badgeColor: 'text-amber-600 bg-amber-50',
      tab: 'portfolio' as AdminTab,
    },
    {
      title: 'خدمات تخصصی',
      value: stats.totalServices,
      subValue: 'بسته‌های خدماتی منتشر شده',
      icon: Layers,
      color: 'bg-indigo-600 text-white',
      badgeColor: 'text-indigo-600 bg-indigo-50',
      tab: 'services' as AdminTab,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b1c36] via-[#0f284e] to-[#0b1c36] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-blue-900/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>پایگاه داده زنده و متصل</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mb-2">
              خوش آمدید به پنل مدیریت وبنیک
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              تمامی محتوا، نمونه‌کارها، مقالات، خدمات و سرنخ‌های ورودی سایت به صورت مستقیم و بدون نیاز به کدنویسی از این بخش مدیریت می‌شوند.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('leads')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              مشاهده سرنخ‌ها ({stats.newLeads} جدید)
            </button>
            <button
              onClick={() => onNavigateTab('services')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              مدیریت خدمات
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-500 mb-1">{card.title}</span>
                <span className="block text-2xl font-black text-slate-900 mb-2 tabular-nums">
                  {card.value}
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  {card.subValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Recent Leads (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">آخرین سرنخ‌های مشاوره دریافتی</h2>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              مشاهده همه ←
            </button>
          </div>

          <div className="space-y-3">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onNavigateTab('leads')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-800 truncate">{lead.full_name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        lead.status === 'NEW' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.status === 'NEW' ? 'جدید' : lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {lead.business_name ? `${lead.business_name} • ` : ''}{lead.requested_service}
                    </p>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="block text-xs font-bold text-slate-700 font-mono" dir="ltr">{lead.phone}</span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(lead.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-400">هنوز سرنخی ثبت نشده است.</p>
            )}
          </div>
        </div>

        {/* Recent Messages & System Logs (Col 5) */}
        <div className="lg:col-span-5 space-y-7">
          
          {/* Recent Messages */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">پیام‌های تماس اخیر</h3>
              </div>
              <button
                onClick={() => onNavigateTab('messages')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>

            <div className="space-y-3">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => onNavigateTab('messages')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800">{msg.full_name}</span>
                      <span className="text-[10px] text-slate-400">{msg.phone || msg.email}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{msg.subject}: {msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400">پیامی وجود ندارد.</p>
              )}
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-800">فعالیت‌های سیستمی اخیر</h3>
              </div>
              <button
                onClick={() => onNavigateTab('audit-logs')}
                className="text-[11px] text-blue-600 hover:underline cursor-pointer"
              >
                لاگ‌ها
              </button>
            </div>

            <div className="space-y-2.5">
              {recentAudit.map((log) => (
                <div key={log.id} className="text-[11px] flex items-center justify-between text-slate-600">
                  <span className="truncate max-w-[200px]">{log.details}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
