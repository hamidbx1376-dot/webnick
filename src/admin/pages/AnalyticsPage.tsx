import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MousePointerClick, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalyticsSummary();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-xs text-slate-400">در حال دریافت داده‌های آماری...</div>;
  }

  const stats = data?.stats || {};
  const recentEvents = data?.recentEvents || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black text-slate-900">آمار و عملکرد وب‌سایت (Analytics)</h1>
        </div>
        <p className="text-xs text-slate-500">تحلیل رویدادها، نرخ تبدیل فرم‌های مشاوره و ترافیک ارگانیک سایت</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">بازدید از صفحه اصلی</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 block tabular-nums">{stats.totalPageViews}</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+۱۴٪ رشد نسبت به هفته قبل</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">کلیک روی دکمه‌های CTA</span>
            <MousePointerClick className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 block tabular-nums">{stats.totalCtaClicks}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">مشاوره رایگان هیرو و فوتر</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">سرنخ‌های ثبت شده</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 block tabular-nums">{stats.totalLeads}</span>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">لیدهای باکیفیت B2B</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">نرخ تبدیل نهایی (CR)</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 block tabular-nums">{stats.conversionRate}</span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">بالاتر از میانگین صنعت وب</span>
        </div>
      </div>

      {/* Events log */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
          رویدادهای لحظه‌ای ثبت شده (Live Event Stream)
        </h3>

        <div className="space-y-2 text-xs">
          {recentEvents.length > 0 ? (
            recentEvents.map((e: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800">{e.event_type}</span>
                  <span className="text-slate-500 text-[11px]">{e.event_label}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(e.created_at).toLocaleTimeString('fa-IR')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-slate-400">رویدادی ثبت نشده است.</p>
          )}
        </div>
      </div>
    </div>
  );
};
