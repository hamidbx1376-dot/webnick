import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit2, X, User } from 'lucide-react';
import { api } from '../../services/api';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [status, setStatus] = useState('ACTIVE');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.users || []);
      setRoles(res.roles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setUsername('');
    setName('');
    setEmail('');
    setPassword('');
    setRole('ADMIN');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const openEdit = (u: any) => {
    setEditingUser(u);
    setUsername(u.username);
    setName(u.name);
    setEmail(u.email || '');
    setPassword('');
    setRole(u.role);
    setStatus(u.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!editingUser && (!username || !password))) {
      return alert('تکمیل فیلدهای نام، نام کاربری و رمز عبور الزامی است.');
    }

    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, {
          name,
          email,
          role,
          status,
          new_password: password || undefined,
        });
      } else {
        await api.createUser({
          username,
          name,
          email,
          password,
          role,
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (e: any) {
      alert(e.message || 'خطا در ذخیره اطلاعات کاربر');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (e: any) {
      alert(e.message || 'خطا در حذف کاربر');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-black text-slate-900">مدیریت کاربران و سطوح دسترسی (RBAC)</h1>
          </div>
          <p className="text-xs text-slate-500">کنترل دسترسی مدیران، کارشناسان محتوا و پشتیبانی</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن کاربر جدید</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="py-3 px-4">نام و نام کاربری</th>
                <th className="py-3 px-4">ایمیل</th>
                <th className="py-3 px-4">نقش دسترسی</th>
                <th className="py-3 px-4">وضعیت حساب</th>
                <th className="py-3 px-4">آخرین ورود</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">در حال دریافت کاربران...</td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono" dir="ltr">{u.username}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600" dir="ltr">{u.email || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString('fa-IR') : 'هنوز وارد نشده'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-right">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingUser ? 'ویرایش کاربر' : 'ایجاد کاربر مدیر جدید'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">نام کامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="مثال: مهندس حسینی"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نام کاربری (لاتین)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!!editingUser}
                  required
                  placeholder="admin_support"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono disabled:opacity-50"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ایمیل</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {editingUser ? 'تغییر کلمه عبور (اختیاری)' : 'کلمه عبور'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingUser ? 'فقط در صورت نیاز به تغییر وارد کنید' : 'حداقل ۶ کاراکتر'}
                  required={!editingUser}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نقش دسترسی</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="SUPER_ADMIN">مدیر کل (Super Admin)</option>
                    <option value="ADMIN">مدیر سیستم (Admin)</option>
                    <option value="EDITOR">کارشناس محتوا (Editor)</option>
                    <option value="SUPPORT">پشتیبانی و فروش (Support)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">وضعیت حساب</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="ACTIVE">فعال</option>
                    <option value="INACTIVE">غیرفعال</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  انصراف
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
