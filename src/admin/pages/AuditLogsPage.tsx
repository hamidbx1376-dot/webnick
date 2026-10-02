import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Shield } from 'lucide-react';
import { api } from '../../services/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs({
        search,
        action: actionFilter,
      });
      setLogs(res.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <History className="w-5 h-5 text-slate-700" />
          <h1 className="text-lg font-black text-slate-900">لاگ‌های امنیتی و رویدادهای سیستم (Audit Logs)</h1>
        </div>
        <p className="text-xs text-slate-500">ثبت دقیق تمامی عملیات‌های انجام شده توسط مدیران جهت شفافیت و امنیت سامانه</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در لاگ‌ها..."
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">فیلتر عملیات:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none"
          >
            <option value="ALL">همه عملیات‌ها</option>
            <option value="AUTH_LOGIN_SUCCESS">ورود به سیستم</option>
            <option value="SERVICE_UPDATED">ویرایش خدمت</option>
            <option value="PORTFOLIO_CREATED">افزودن نمونه‌کار</option>
            <option value="SETTINGS_UPDATED">تغییر تنظیمات</option>
            <option value="LEAD_STATUS_UPDATE">تغییر وضعیت سرنخ</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="py-3 px-4">کاربر</th>
                <th className="py-3 px-4">نوع عملیات (Action)</th>
                <th className="py-3 px-4">موجودیت (Entity)</th>
                <th className="py-3 px-4">شرح کامل تغییرات</th>
                <th className="py-3 px-4">آدرس IP</th>
                <th className="py-3 px-4">زمان ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">در حال دریافت لاگ‌ها...</td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{log.username}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.entity_type}</td>
                  <td className="py-3 px-4 text-slate-700 max-w-sm truncate">{log.details}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]" dir="ltr">{log.ip_address}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(log.created_at).toLocaleString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
