import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Clock, Check, Trash2, X, Send } from 'lucide-react';
import { api } from '../../services/api';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.getMessages('ALL');
      setMessages(res.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (msg: any) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await api.markMessageRead(msg.id);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
    }
  };

  const handleMarkReplied = async (id: string) => {
    await api.markMessageReplied(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_replied: true, is_read: true } : m)));
    if (selectedMsg?.id === id) {
      setSelectedMsg((prev: any) => ({ ...prev, is_replied: true, is_read: true }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    await api.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMsg?.id === id) setSelectedMsg(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <h1 className="text-lg font-black text-slate-900">پیام‌های فرم تماس با ما</h1>
        </div>
        <p className="text-xs text-slate-500">
          پیام‌های ارسالی از طریق بخش تماس سایت
        </p>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">در حال دریافت پیام‌ها...</div>
        ) : messages.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleMarkRead(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                  !msg.is_read ? 'bg-blue-50/40 hover:bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">{msg.full_name}</span>
                    {!msg.is_read && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        جدید
                      </span>
                    )}
                    {msg.is_replied && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        پاسخ داده شد
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-slate-800 text-xs">{msg.subject}</h4>
                  <p className="text-slate-500 text-xs line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-slate-400 text-xs">
                  <span>{new Date(msg.created_at).toLocaleDateString('fa-IR')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-slate-400">هیچ پیامی ثبت نشده است.</div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">{selectedMsg.subject}</h3>
              <button
                onClick={() => setSelectedMsg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="block text-[10px] text-slate-400">فرستنده:</span>
                  <span className="font-bold text-slate-800">{selectedMsg.full_name}</span>
                </div>
                <div className="text-left" dir="ltr">
                  <span className="block text-[10px] text-slate-400">تماس:</span>
                  <span className="font-mono text-slate-700">{selectedMsg.phone || selectedMsg.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-800 leading-relaxed">
                {selectedMsg.message}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {!selectedMsg.is_replied ? (
                <button
                  onClick={() => handleMarkReplied(selectedMsg.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ثبت به عنوان پاسخ‌داده‌شده</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-600 font-bold">پاسخ به این پیام ثبت شده است.</span>
              )}

              <button
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
