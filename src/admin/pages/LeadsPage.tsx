import React, { useState, useEffect } from 'react';
import {
  UsersRound,
  Search,
  Filter,
  Download,
  Trash2,
  X,
  Phone,
  Mail,
  Building,
  Calendar,
  MessageSquare,
  Clock,
  Send,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadDetails, setLeadDetails] = useState<{ lead: any; notes: any[]; activities: any[] } | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({
        search,
        status: statusFilter,
        priority: priorityFilter,
      });
      setLeads(res.leads || []);
    } catch (e) {
      console.error('Error fetching leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const openLeadDetail = async (lead: any) => {
    setSelectedLead(lead);
    try {
      const res = await api.getLeadDetail(lead.id);
      setLeadDetails(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await api.updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
          const detailRes = await api.getLeadDetail(leadId);
          setLeadDetails(detailRes);
        }
      }
    } catch (e) {
      alert('خطا در به‌روزرسانی وضعیت');
    }
  };

  const handlePriorityChange = async (leadId: string, newPriority: string) => {
    try {
      const res = await api.updateLeadPriority(leadId, newPriority);
      if (res.success) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, priority: newPriority } : l)));
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev: any) => ({ ...prev, priority: newPriority }));
        }
      }
    } catch (e) {
      alert('خطا در به‌روزرسانی اولویت');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;

    setIsSubmittingNote(true);
    try {
      const res = await api.addLeadNote(selectedLead.id, newNote);
      if (res.success) {
        setNewNote('');
        const detailRes = await api.getLeadDetail(selectedLead.id);
        setLeadDetails(detailRes);
      }
    } catch (e) {
      alert('خطا در ثبت یادداشت');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('آیا از حذف این سرنخ اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) return;

    try {
      const res = await api.deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
          setLeadDetails(null);
        }
      }
    } catch (e) {
      alert('خطا در حذف سرنخ');
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `webnick_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; class: string }> = {
      NEW: { label: 'جدید', class: 'bg-amber-100 text-amber-800 border-amber-200' },
      CONTACTED: { label: 'تماس گرفته شد', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      QUALIFIED: { label: 'تأیید صلاحیت', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      PROPOSAL: { label: 'ارسال پروپوزال', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      WON: { label: 'موفق (قرارداد)', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      LOST: { label: 'از دست رفته', class: 'bg-rose-100 text-rose-800 border-rose-200' },
      ARCHIVED: { label: 'بایگانی', class: 'bg-slate-100 text-slate-800 border-slate-200' },
    };
    const s = map[status] || { label: status, class: 'bg-slate-100 text-slate-800' };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.class}`}>{s.label}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { label: string; color: string }> = {
      URGENT: { label: 'فوری', color: 'text-rose-600 bg-rose-50' },
      HIGH: { label: 'بالا', color: 'text-amber-600 bg-amber-50' },
      MEDIUM: { label: 'متوسط', color: 'text-blue-600 bg-blue-50' },
      LOW: { label: 'پایین', color: 'text-slate-600 bg-slate-50' },
    };
    const p = map[priority] || { label: priority, color: 'text-slate-600 bg-slate-50' };
    return <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${p.color}`}>{p.label}</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UsersRound className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت سرنخ‌های مشاوره و فروش</h1>
          </div>
          <p className="text-xs text-slate-500">
            تمامی فرم‌های مشاوره ثبت شده توسط بازدیدکنندگان سایت در این بخش قابل بررسی و پیگیری است.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>خروجی داده‌ها (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام، تلفن یا شرکت..."
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-right"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">وضعیت:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="NEW">جدید</option>
              <option value="CONTACTED">تماس گرفته شد</option>
              <option value="QUALIFIED">تأیید صلاحیت</option>
              <option value="PROPOSAL">ارسال پروپوزال</option>
              <option value="WON">موفق (قرارداد)</option>
              <option value="LOST">از دست رفته</option>
              <option value="ARCHIVED">بایگانی</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">اولویت:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">همه اولویت‌ها</option>
              <option value="URGENT">فوری</option>
              <option value="HIGH">بالا</option>
              <option value="MEDIUM">متوسط</option>
              <option value="LOW">پایین</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="py-3.5 px-4">مشتری / کسب‌وکار</th>
                <th className="py-3.5 px-4">اطلاعات تماس</th>
                <th className="py-3.5 px-4">خدمت درخواستی</th>
                <th className="py-3.5 px-4">وضعیت پیگیری</th>
                <th className="py-3.5 px-4">اولویت</th>
                <th className="py-3.5 px-4">تاریخ ثبت</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    در حال دریافت سرنخ‌ها...
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lead.full_name}</div>
                      <div className="text-[11px] text-slate-400">{lead.business_name || 'شخصی'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800 text-xs" dir="ltr">{lead.phone}</div>
                      {lead.email && <div className="text-[11px] text-slate-400" dir="ltr">{lead.email}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{lead.requested_service}</span>
                      <div className="text-[10px] text-slate-400">{lead.budget}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPriorityBadge(lead.priority)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openLeadDetail(lead)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          بررسی جزئیات
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    هیچ سرنخی مطابق با فیلترها یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto text-right">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  {selectedLead.full_name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedLead.full_name}</h3>
                  <span className="text-xs text-slate-400">{selectedLead.business_name || 'کسب‌وکار شخصی'}</span>
                </div>
              </div>

              <button
                onClick={() => { setSelectedLead(null); setLeadDetails(null); }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status and Priority controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">وضعیت سرنخ:</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="NEW">جدید</option>
                  <option value="CONTACTED">تماس گرفته شد</option>
                  <option value="QUALIFIED">تأیید صلاحیت</option>
                  <option value="PROPOSAL">ارسال پروپوزال</option>
                  <option value="WON">موفق (عقد قرارداد)</option>
                  <option value="LOST">از دست رفته</option>
                  <option value="ARCHIVED">بایگانی</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">اولویت:</label>
                <select
                  value={selectedLead.priority}
                  onChange={(e) => handlePriorityChange(selectedLead.id, e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="URGENT">فوری</option>
                  <option value="HIGH">بالا</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="LOW">پایین</option>
                </select>
              </div>
            </div>

            {/* Lead Information Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">شماره تماس</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-slate-800 hover:text-blue-600" dir="ltr">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">ایمیل</span>
                  <span className="font-medium text-slate-800" dir="ltr">{selectedLead.email || 'ثبت نشده'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">حوزه فعالیت</span>
                  <span className="font-medium text-slate-800">{selectedLead.business_type || 'نامشخص'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">بودجه مد نظر</span>
                  <span className="font-medium text-slate-800">{selectedLead.budget}</span>
                </div>
              </div>
            </div>

            {/* User Message */}
            {selectedLead.message && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block mb-1">پیام و توضیحات مشتری:</span>
                <p className="text-slate-600 leading-relaxed">{selectedLead.message}</p>
              </div>
            )}

            {/* Notes Section */}
            <div className="mb-6 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>یادداشت‌های داخلی کارشناسان</span>
              </h4>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="ثبت یادداشت جدید در خصوص این سرنخ..."
                  className="grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNote.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                >
                  ثبت
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2">
                {leadDetails?.notes && leadDetails.notes.length > 0 ? (
                  leadDetails.notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-700">{note.user_name}</span>
                        <span>{new Date(note.created_at).toLocaleString('fa-IR')}</span>
                      </div>
                      <p className="text-slate-700">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs text-center py-2">هنوز یادداشتی ثبت نشده است.</p>
                )}
              </div>
            </div>

            {/* Activity History */}
            {leadDetails?.activities && leadDetails.activities.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>تاریخچه رویدادها</span>
                </h4>
                <div className="space-y-2 text-[11px]">
                  {leadDetails.activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between text-slate-500 py-1 border-b border-slate-50">
                      <span>{act.description}</span>
                      <span className="text-[10px] text-slate-400">{new Date(act.created_at).toLocaleTimeString('fa-IR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
