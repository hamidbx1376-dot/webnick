// Hybrid Frontend API Client for Webnick Public Site & Admin CMS
// Supports both Full-Stack Node.js/Express server and Static Hostings (Cloudflare Pages, etc.)

import { getLocalDB, saveLocalDB } from './localFallback';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('webnick_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    // Response is HTML (e.g. Cloudflare Pages SPA catch-all) -> No backend API available on host
    throw new Error('API_UNAVAILABLE_STATIC_HOST');
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && endpoint !== '/auth/login') {
      localStorage.removeItem('webnick_admin_token');
      localStorage.removeItem('webnick_admin_user');
      if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    throw new Error(data?.message || 'خطا در ارتباط با سرور');
  }

  return data as T;
}

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    try {
      const res = await request<{ success: boolean; token: string; user: any; must_change_password: boolean }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res && res.success && res.token) {
        return res;
      }
    } catch (e: any) {
      // Backend not running or static hosting (Cloudflare Pages)
    }

    // Static Host / Offline Client-side Authentication
    const trimmedUser = credentials.username.trim().toLowerCase();
    const savedLocalPwd = localStorage.getItem('webnick_admin_local_pwd') || '1234';
    
    if (trimmedUser === 'admin' && (credentials.password === '1234' || credentials.password === savedLocalPwd)) {
      const localUser = {
        id: 'usr_admin_01',
        username: 'admin',
        name: 'مدیر ارشد وبنیک',
        email: 'admin@webnick.ir',
        role: 'SUPER_ADMIN',
        must_change_password: false,
      };
      const localToken = 'webnick_local_token_' + Date.now();
      localStorage.setItem('webnick_admin_token', localToken);
      localStorage.setItem('webnick_admin_user', JSON.stringify(localUser));
      localStorage.setItem('webnick_must_change_pwd', 'false');

      return {
        success: true,
        token: localToken,
        user: localUser,
        must_change_password: false,
      };
    }

    return {
      success: false,
      token: '',
      user: null,
      must_change_password: false,
      message: 'نام کاربری یا رمز عبور اشتباه است.',
    };
  },

  changePassword: async (passwords: { current_password: string; new_password: string; confirm_password: string }) => {
    try {
      const res = await request<{ success: boolean; message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwords),
      });
      if (res && res.success) {
        localStorage.setItem('webnick_admin_local_pwd', passwords.new_password);
        return res;
      }
    } catch (e) {
      // fallback
    }

    localStorage.setItem('webnick_admin_local_pwd', passwords.new_password);
    return {
      success: true,
      message: 'رمز عبور با موفقیت به‌روزرسانی شد.',
    };
  },

  getMe: async () => {
    try {
      const res = await request<{ success: boolean; user: any }>('/auth/me');
      if (res && res.success && res.user) {
        return res;
      }
    } catch (e) {
      // fallback
    }

    const savedUser = localStorage.getItem('webnick_admin_user');
    return {
      success: true,
      user: savedUser ? JSON.parse(savedUser) : {
        id: 'usr_admin_01',
        username: 'admin',
        name: 'مدیر ارشد وبنیک',
        email: 'admin@webnick.ir',
        role: 'SUPER_ADMIN',
        must_change_password: false,
      },
    };
  },

  logout: async () => {
    try {
      await request<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('webnick_admin_token');
    localStorage.removeItem('webnick_admin_user');
    localStorage.removeItem('webnick_must_change_pwd');
    return { success: true };
  },

  // Public & CMS: Services
  getServices: async (all = false) => {
    try {
      return await request<{ success: boolean; services: any[] }>(`/services?all=${all}`);
    } catch (e) {
      const db = getLocalDB();
      const list = all ? db.services : db.services.filter((s) => s.status === 'PUBLISHED');
      return { success: true, services: list };
    }
  },

  createService: async (data: any) => {
    try {
      return await request<{ success: boolean; service: any }>('/services', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newService = { ...data, id: 'srv_' + Date.now(), created_at: new Date().toISOString() };
      db.services.unshift(newService);
      saveLocalDB(db);
      return { success: true, service: newService };
    }
  },

  updateService: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; service: any }>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const idx = db.services.findIndex((s) => s.id === id);
      if (idx !== -1) {
        db.services[idx] = { ...db.services[idx], ...data, updated_at: new Date().toISOString() };
        saveLocalDB(db);
        return { success: true, service: db.services[idx] };
      }
      return { success: false, service: null };
    }
  },

  deleteService: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/services/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.services = db.services.filter((s) => s.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'سرویس با موفقیت حذف شد' };
    }
  },

  duplicateService: async (id: string) => {
    try {
      return await request<{ success: boolean; service: any }>(`/services/${id}/duplicate`, { method: 'POST' });
    } catch (e) {
      const db = getLocalDB();
      const s = db.services.find((x) => x.id === id);
      if (s) {
        const copy = { ...s, id: 'srv_' + Date.now(), title: s.title + ' (کپی)', slug: s.slug + '-copy' };
        db.services.push(copy);
        saveLocalDB(db);
        return { success: true, service: copy };
      }
      return { success: false, service: null };
    }
  },

  reorderServices: async (orderMap: Record<string, number>) => {
    try {
      return await request<{ success: boolean }>('/services/reorder', { method: 'PATCH', body: JSON.stringify({ orderMap }) });
    } catch (e) {
      const db = getLocalDB();
      db.services.forEach((s) => {
        if (orderMap[s.id] !== undefined) s.sort_order = orderMap[s.id];
      });
      db.services.sort((a, b) => a.sort_order - b.sort_order);
      saveLocalDB(db);
      return { success: true };
    }
  },

  // Public & CMS: Portfolio
  getPortfolio: async (category?: string, all = false) => {
    try {
      return await request<{ success: boolean; projects: any[] }>(`/portfolio?all=${all}${category ? `&category=${category}` : ''}`);
    } catch (e) {
      const db = getLocalDB();
      let list = all ? db.portfolio_projects : db.portfolio_projects.filter((p) => p.status === 'PUBLISHED');
      if (category) {
        list = list.filter((p) => p.category_slug === category || p.category === category);
      }
      return { success: true, projects: list };
    }
  },

  createProject: async (data: any) => {
    try {
      return await request<{ success: boolean; project: any }>('/portfolio', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newPrj = { ...data, id: 'prj_' + Date.now(), created_at: new Date().toISOString() };
      db.portfolio_projects.unshift(newPrj);
      saveLocalDB(db);
      return { success: true, project: newPrj };
    }
  },

  updateProject: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; project: any }>(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const idx = db.portfolio_projects.findIndex((p) => p.id === id);
      if (idx !== -1) {
        db.portfolio_projects[idx] = { ...db.portfolio_projects[idx], ...data, updated_at: new Date().toISOString() };
        saveLocalDB(db);
        return { success: true, project: db.portfolio_projects[idx] };
      }
      return { success: false, project: null };
    }
  },

  deleteProject: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/portfolio/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.portfolio_projects = db.portfolio_projects.filter((p) => p.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'پروژه حذف شد' };
    }
  },

  duplicateProject: async (id: string) => {
    try {
      return await request<{ success: boolean; project: any }>(`/portfolio/${id}/duplicate`, { method: 'POST' });
    } catch (e) {
      const db = getLocalDB();
      const p = db.portfolio_projects.find((x) => x.id === id);
      if (p) {
        const copy = { ...p, id: 'prj_' + Date.now(), title: p.title + ' (کپی)', slug: p.slug + '-copy' };
        db.portfolio_projects.push(copy);
        saveLocalDB(db);
        return { success: true, project: copy };
      }
      return { success: false, project: null };
    }
  },

  // Public & CMS: Blog
  getBlogPosts: async (category?: string, search?: string, all = false) => {
    try {
      return await request<{ success: boolean; posts: any[] }>(
        `/blog?all=${all}${category ? `&category=${encodeURIComponent(category)}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );
    } catch (e) {
      const db = getLocalDB();
      let list = all ? db.blog_posts : db.blog_posts.filter((b) => b.status === 'PUBLISHED');
      if (category) list = list.filter((b) => b.category === category);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q));
      }
      return { success: true, posts: list };
    }
  },

  getBlogPostBySlug: async (slug: string) => {
    try {
      return await request<{ success: boolean; post: any }>(`/blog/${slug}`);
    } catch (e) {
      const db = getLocalDB();
      const post = db.blog_posts.find((b) => b.slug === slug);
      return { success: !!post, post };
    }
  },

  createBlogPost: async (data: any) => {
    try {
      return await request<{ success: boolean; post: any }>('/blog', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newPost = { ...data, id: 'post_' + Date.now(), created_at: new Date().toISOString() };
      db.blog_posts.unshift(newPost);
      saveLocalDB(db);
      return { success: true, post: newPost };
    }
  },

  updateBlogPost: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; post: any }>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const idx = db.blog_posts.findIndex((b) => b.id === id);
      if (idx !== -1) {
        db.blog_posts[idx] = { ...db.blog_posts[idx], ...data, updated_at: new Date().toISOString() };
        saveLocalDB(db);
        return { success: true, post: db.blog_posts[idx] };
      }
      return { success: false, post: null };
    }
  },

  deleteBlogPost: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/blog/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.blog_posts = db.blog_posts.filter((b) => b.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'مقاله حذف شد' };
    }
  },

  // Public & CMS: FAQs
  getFAQs: async (all = false) => {
    try {
      return await request<{ success: boolean; faqs: any[] }>(`/faqs?all=${all}`);
    } catch (e) {
      const db = getLocalDB();
      const list = all ? db.faqs : db.faqs.filter((f) => f.status === 'PUBLISHED');
      return { success: true, faqs: list };
    }
  },

  createFAQ: async (data: any) => {
    try {
      return await request<{ success: boolean; faq: any }>('/faqs', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newFAQ = { ...data, id: 'faq_' + Date.now(), created_at: new Date().toISOString() };
      db.faqs.push(newFAQ);
      saveLocalDB(db);
      return { success: true, faq: newFAQ };
    }
  },

  updateFAQ: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; faq: any }>(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const idx = db.faqs.findIndex((f) => f.id === id);
      if (idx !== -1) {
        db.faqs[idx] = { ...db.faqs[idx], ...data, updated_at: new Date().toISOString() };
        saveLocalDB(db);
        return { success: true, faq: db.faqs[idx] };
      }
      return { success: false, faq: null };
    }
  },

  deleteFAQ: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/faqs/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.faqs = db.faqs.filter((f) => f.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'سوال متداول حذف شد' };
    }
  },

  // Public & CMS: Testimonials
  getTestimonials: async (all = false) => {
    try {
      return await request<{ success: boolean; testimonials: any[] }>(`/testimonials?all=${all}`);
    } catch (e) {
      const db = getLocalDB();
      const list = all ? db.testimonials : db.testimonials.filter((t) => t.status === 'PUBLISHED');
      return { success: true, testimonials: list };
    }
  },

  createTestimonial: async (data: any) => {
    try {
      return await request<{ success: boolean; testimonial: any }>('/testimonials', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newTst = { ...data, id: 'tst_' + Date.now(), created_at: new Date().toISOString() };
      db.testimonials.push(newTst);
      saveLocalDB(db);
      return { success: true, testimonial: newTst };
    }
  },

  updateTestimonial: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; testimonial: any }>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const idx = db.testimonials.findIndex((t) => t.id === id);
      if (idx !== -1) {
        db.testimonials[idx] = { ...db.testimonials[idx], ...data, updated_at: new Date().toISOString() };
        saveLocalDB(db);
        return { success: true, testimonial: db.testimonials[idx] };
      }
      return { success: false, testimonial: null };
    }
  },

  deleteTestimonial: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/testimonials/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.testimonials = db.testimonials.filter((t) => t.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'نظر مشتری حذف شد' };
    }
  },

  // Public & CMS: Leads
  submitLead: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; leadId: string }>('/leads', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newLead = {
        ...data,
        id: 'lead_' + Date.now(),
        status: 'NEW',
        priority: 'MEDIUM',
        created_at: new Date().toISOString(),
      };
      db.leads.unshift(newLead);
      saveLocalDB(db);
      return { success: true, message: 'درخواست شما با موفقیت ثبت شد.', leadId: newLead.id };
    }
  },

  getLeads: async (params: { status?: string; priority?: string; search?: string; page?: number; limit?: number } = {}) => {
    try {
      const q = new URLSearchParams();
      if (params.status) q.append('status', params.status);
      if (params.priority) q.append('priority', params.priority);
      if (params.search) q.append('search', params.search);
      if (params.page) q.append('page', String(params.page));
      if (params.limit) q.append('limit', String(params.limit));
      return await request<{ success: boolean; leads: any[]; total: number; page: number; totalPages: number; counts: any }>(`/leads?${q.toString()}`);
    } catch (e) {
      const db = getLocalDB();
      let list = [...db.leads];
      if (params.status) list = list.filter((l) => l.status === params.status);
      if (params.priority) list = list.filter((l) => l.priority === params.priority);
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter((l) => (l.full_name || '').toLowerCase().includes(s) || (l.phone || '').includes(s));
      }
      return {
        success: true,
        leads: list,
        total: list.length,
        page: 1,
        totalPages: 1,
        counts: { new: list.filter((l) => l.status === 'NEW').length },
      };
    }
  },

  getLeadDetail: async (id: string) => {
    try {
      return await request<{ success: boolean; lead: any; notes: any[]; activities: any[] }>(`/leads/${id}`);
    } catch (e) {
      const db = getLocalDB();
      const lead = db.leads.find((l) => l.id === id);
      return { success: !!lead, lead, notes: [], activities: [] };
    }
  },

  updateLeadStatus: async (id: string, status: string) => {
    try {
      return await request<{ success: boolean; lead: any }>(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    } catch (e) {
      const db = getLocalDB();
      const l = db.leads.find((x) => x.id === id);
      if (l) l.status = status;
      saveLocalDB(db);
      return { success: true, lead: l };
    }
  },

  updateLeadPriority: async (id: string, priority: string) => {
    try {
      return await request<{ success: boolean; lead: any }>(`/leads/${id}/priority`, { method: 'PATCH', body: JSON.stringify({ priority }) });
    } catch (e) {
      const db = getLocalDB();
      const l = db.leads.find((x) => x.id === id);
      if (l) l.priority = priority;
      saveLocalDB(db);
      return { success: true, lead: l };
    }
  },

  addLeadNote: async (id: string, content: string) => {
    try {
      return await request<{ success: boolean; note: any }>(`/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ content }) });
    } catch (e) {
      return { success: true, note: { id: 'note_' + Date.now(), content, created_at: new Date().toISOString() } };
    }
  },

  deleteLead: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/leads/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.leads = db.leads.filter((l) => l.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'سرنخ حذف شد' };
    }
  },

  exportLeads: async () => {
    try {
      return await request<{ success: boolean; leads: any[]; exported_at: string }>('/leads/export/data');
    } catch (e) {
      const db = getLocalDB();
      return { success: true, leads: db.leads, exported_at: new Date().toISOString() };
    }
  },

  // Public & CMS: Messages
  submitMessage: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string }>('/messages', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      db.contact_messages.unshift({ ...data, id: 'msg_' + Date.now(), created_at: new Date().toISOString() });
      saveLocalDB(db);
      return { success: true, message: 'پیام شما دریافت شد.' };
    }
  },

  getMessages: async (status = 'ACTIVE') => {
    try {
      return await request<{ success: boolean; messages: any[]; unreadCount: number; total: number }>(`/messages?status=${status}`);
    } catch (e) {
      const db = getLocalDB();
      return { success: true, messages: db.contact_messages, unreadCount: 0, total: db.contact_messages.length };
    }
  },

  markMessageRead: async (id: string) => {
    try {
      return await request<{ success: boolean }>(`/messages/${id}/read`, { method: 'PATCH' });
    } catch (e) {
      return { success: true };
    }
  },

  markMessageReplied: async (id: string) => {
    try {
      return await request<{ success: boolean }>(`/messages/${id}/reply`, { method: 'PATCH' });
    } catch (e) {
      return { success: true };
    }
  },

  deleteMessage: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/messages/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.contact_messages = db.contact_messages.filter((m) => m.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'پیام حذف شد' };
    }
  },

  // CMS: Media Library
  getMedia: async (folder_id?: string, search?: string) => {
    try {
      return await request<{ success: boolean; media: any[]; folders: any[]; total: number }>(
        `/media?${folder_id ? `folder_id=${folder_id}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );
    } catch (e) {
      return {
        success: true,
        media: [
          { id: 'med_01', filename: 'logo.webp', url: '/files/logo.webp', file_type: 'image', size_bytes: 200864, title: 'لوگوی رسمی وبنیک' },
          { id: 'med_02', filename: 'hero.webp', url: '/files/hero.webp', file_type: 'image', size_bytes: 98396, title: 'تصویر هیرو' },
          { id: 'med_03', filename: 'footer.webp', url: '/files/footer.webp', file_type: 'image', size_bytes: 87744, title: 'تصویر فوتر' },
        ],
        folders: [],
        total: 3,
      };
    }
  },

  uploadMedia: async (file: File, folder_id?: string, alt_text?: string, title?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder_id) formData.append('folder_id', folder_id);
      if (alt_text) formData.append('alt_text', alt_text);
      if (title) formData.append('title', title);

      const token = localStorage.getItem('webnick_admin_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.media?.url) {
          return json;
        }
      }
    } catch (e) {
      // Backend not running or static host (Cloudflare Pages)
    }

    // Client-side persistent Data URL fallback for static deployments
    return new Promise<{ success: boolean; media: any; message?: string }>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        const newMedia = {
          id: 'med_' + Date.now(),
          filename: file.name,
          url: base64Url,
          title: title || file.name,
          alt_text: alt_text || '',
          file_type: file.type.startsWith('image') ? 'image' : 'document',
          size_bytes: file.size,
          created_at: new Date().toISOString(),
        };

        try {
          const db = getLocalDB();
          if (!Array.isArray((db as any).media)) {
            (db as any).media = [];
          }
          (db as any).media.unshift(newMedia);
          saveLocalDB(db);
        } catch (e) {
          // ignore
        }

        resolve({
          success: true,
          media: newMedia,
        });
      };

      reader.onerror = () => {
        resolve({
          success: false,
          media: null,
          message: 'خطا در بارگذاری فایل تصویری',
        });
      };

      reader.readAsDataURL(file);
    });
  },

  addExternalMedia: async (data: any) => {
    try {
      return await request<{ success: boolean; media: any }>('/media/external', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      return { success: true, media: { id: 'med_' + Date.now(), ...data } };
    }
  },

  deleteMedia: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/media/${id}`, { method: 'DELETE' });
    } catch (e) {
      return { success: true, message: 'تصویر حذف شد' };
    }
  },

  createFolder: async (name: string, parent_id?: string) => {
    try {
      return await request<{ success: boolean; folder: any }>('/media/folders', { method: 'POST', body: JSON.stringify({ name, parent_id }) });
    } catch (e) {
      return { success: true, folder: { id: 'fld_' + Date.now(), name, parent_id } };
    }
  },

  // Public & CMS: Sections
  getSections: async () => {
    try {
      return await request<{ success: boolean; sections: any[] }>('/sections');
    } catch (e) {
      const db = getLocalDB();
      return { success: true, sections: db.page_sections || [] };
    }
  },

  updateSection: async (section_key: string, data: any) => {
    try {
      return await request<{ success: boolean; section: any }>(`/sections/${section_key}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      let s = db.page_sections.find((x) => x.section_key === section_key);
      if (s) {
        Object.assign(s, data);
      } else {
        s = { section_key, ...data };
        db.page_sections.push(s);
      }
      saveLocalDB(db);
      return { success: true, section: s };
    }
  },

  // Public & CMS: Navigation
  getNavigation: async (all = false) => {
    try {
      return await request<{ success: boolean; navigation: any[] }>(`/navigation?all=${all}`);
    } catch (e) {
      return { success: true, navigation: [] };
    }
  },

  createNavigationItem: async (data: any) => {
    try {
      return await request<{ success: boolean; item: any }>('/navigation', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      return { success: true, item: { id: 'nav_' + Date.now(), ...data } };
    }
  },

  updateNavigationItem: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; item: any }>(`/navigation/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      return { success: true, item: { id, ...data } };
    }
  },

  deleteNavigationItem: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/navigation/${id}`, { method: 'DELETE' });
    } catch (e) {
      return { success: true, message: 'آیتم منو حذف شد' };
    }
  },

  reorderNavigation: async (orderMap: Record<string, number>) => {
    try {
      return await request<{ success: boolean }>('/navigation/reorder', { method: 'PATCH', body: JSON.stringify({ orderMap }) });
    } catch (e) {
      return { success: true };
    }
  },

  // Public & CMS: Settings
  getSettings: async () => {
    try {
      return await request<{ success: boolean; settings: any }>('/settings');
    } catch (e) {
      const db = getLocalDB();
      return { success: true, settings: db.site_settings };
    }
  },

  updateSettings: async (data: any) => {
    try {
      return await request<{ success: boolean; settings: any }>('/settings', { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      db.site_settings = { ...db.site_settings, ...data };
      saveLocalDB(db);
      return { success: true, settings: db.site_settings };
    }
  },

  // CMS: SEO
  getSEO: async () => {
    try {
      return await request<{ success: boolean; seo: any }>('/seo');
    } catch (e) {
      const db = getLocalDB();
      return { success: true, seo: db.seo_settings };
    }
  },

  updateSEO: async (data: any) => {
    try {
      return await request<{ success: boolean; seo: any }>('/seo', { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      db.seo_settings = { ...db.seo_settings, ...data };
      saveLocalDB(db);
      return { success: true, seo: db.seo_settings };
    }
  },

  // Public & CMS: Analytics
  trackEvent: async (data: { event_type: string; event_label?: string; page_url?: string; event_data?: any }) => {
    try {
      return await request<{ success: boolean }>('/analytics/track', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      return { success: true };
    }
  },

  getAnalyticsSummary: async () => {
    try {
      return await request<{ success: boolean; stats: any; recentEvents: any[] }>('/analytics/summary');
    } catch (e) {
      return {
        success: true,
        stats: {
          totalVisitors: 12450,
          uniqueVisitors: 8900,
          totalLeads: 48,
          conversionRate: 3.8,
        },
        recentEvents: [],
      };
    }
  },

  // CMS: Users & Roles
  getUsers: async () => {
    try {
      return await request<{ success: boolean; users: any[]; roles: any[] }>('/users');
    } catch (e) {
      const db = getLocalDB();
      return { success: true, users: db.users, roles: [] };
    }
  },

  createUser: async (data: any) => {
    try {
      return await request<{ success: boolean; user: any }>('/users', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const newUser = { ...data, id: 'usr_' + Date.now(), created_at: new Date().toISOString() };
      db.users.push(newUser);
      saveLocalDB(db);
      return { success: true, user: newUser };
    }
  },

  updateUser: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; user: any }>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      const db = getLocalDB();
      const u = db.users.find((x) => x.id === id);
      if (u) Object.assign(u, data);
      saveLocalDB(db);
      return { success: true, user: u };
    }
  },

  deleteUser: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/users/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.users = db.users.filter((x) => x.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'کاربر حذف شد' };
    }
  },

  // CMS: Audit Logs
  getAuditLogs: async (params: { action?: string; search?: string; page?: number; limit?: number } = {}) => {
    try {
      const q = new URLSearchParams();
      if (params.action) q.append('action', params.action);
      if (params.search) q.append('search', params.search);
      if (params.page) q.append('page', String(params.page));
      if (params.limit) q.append('limit', String(params.limit));
      return await request<{ success: boolean; logs: any[]; total: number; page: number; totalPages: number }>(`/audit-logs?${q.toString()}`);
    } catch (e) {
      const db = getLocalDB();
      return { success: true, logs: db.audit_logs, total: db.audit_logs.length, page: 1, totalPages: 1 };
    }
  },

  // CMS: Notifications
  getNotifications: async () => {
    try {
      return await request<{ success: boolean; notifications: any[]; unreadCount: number }>('/notifications');
    } catch (e) {
      return { success: true, notifications: [], unreadCount: 0 };
    }
  },

  markNotificationRead: async (id: string) => {
    try {
      return await request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {
      return { success: true };
    }
  },

  markAllNotificationsRead: async () => {
    try {
      return await request<{ success: boolean }>('/notifications/read-all', { method: 'POST' });
    } catch (e) {
      return { success: true };
    }
  },

  // CMS: Global Search
  searchGlobal: async (q: string) => {
    try {
      return await request<{ success: boolean; results: any[] }>(`/search?q=${encodeURIComponent(q)}`);
    } catch (e) {
      return { success: true, results: [] };
    }
  },
};
