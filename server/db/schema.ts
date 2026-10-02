// Webnick Database Schema and Type Definitions

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SEO_MANAGER' | 'MARKETING_MANAGER' | 'SUPPORT';
  status: 'ACTIVE' | 'INACTIVE';
  must_change_password: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  is_system: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  code: string; // e.g., 'services.create'
  category: string;
  description: string;
}

export interface Session {
  id: string;
  token: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_slogan: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  phone_number: string;
  emergency_phone: string;
  email: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  address: string;
  business_hours: string;
  timezone: string;
  google_analytics_id: string;
  search_console_token: string;
  meta_pixel_id: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string; // e.g., '#services' or '/blog'
  section_id: string;
  target_blank: boolean;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  section_key: 'hero' | 'services' | 'portfolio' | 'why_webnick' | 'process' | 'testimonials' | 'faq' | 'final_cta' | 'footer';
  title: string;
  subtitle: string;
  eyebrow: string;
  content: Record<string, any>;
  is_active: boolean;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon_type: 'seo' | 'search' | 'code' | 'marketing' | 'ai';
  deliverables: string[];
  duration: string;
  category: string;
  display_order: number;
  is_featured: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  category: string;
  category_key: 'ecommerce' | 'corporate' | 'cafe' | 'all';
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery_images: string[];
  project_url: string;
  tech_stack: string[];
  results: string[];
  accent_color: string;
  preview_type: 'watch' | 'building' | 'cafe';
  year: string;
  display_order: number;
  is_featured: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      tipBox?: string;
    }[];
    conclusion: string;
  };
  cover_image: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  category: string;
  tags: string[];
  read_time: string;
  published_at: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_image: string;
  created_at: string;
  updated_at: string;
}

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  status: 'PUBLISHED' | 'DRAFT';
  created_at: string;
  updated_at: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar_color: string;
  avatar_url?: string;
  display_order: number;
  is_featured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  business_name: string;
  business_type: string;
  requested_service: string;
  budget: string;
  message: string;
  source: string; // 'hero_cta', 'final_cta', 'floating_cta', 'contact_modal', etc.
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigned_to: string | null;
  follow_up_date: string | null;
  notes_count: number;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  user_name: string;
  action_type: 'STATUS_CHANGE' | 'PRIORITY_CHANGE' | 'NOTE_ADDED' | 'ASSIGNED' | 'CREATED';
  description: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  ip_address: string;
  is_read: boolean;
  is_replied: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  file_size: number;
  folder_id: string | null;
  alt_text: string;
  title: string;
  width?: number;
  height?: number;
  created_at: string;
  updated_at: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface SEOSettings {
  id: string;
  default_title: string;
  title_template: string;
  default_description: string;
  default_og_image: string;
  canonical_base_url: string;
  robots_content: string;
  enable_sitemap: boolean;
  enable_indexing: boolean;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'LEAD' | 'MESSAGE' | 'SYSTEM' | 'USER';
  entity_type: string;
  entity_id: string;
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'PAGE_VIEW' | 'CTA_CLICK' | 'CONSULTATION_START' | 'CONSULTATION_SUBMIT' | 'CONTACT_SUBMIT' | 'PORTFOLIO_CLICK' | 'PHONE_CLICK' | 'SOCIAL_CLICK';
  event_label: string;
  event_data?: Record<string, any>;
  page_url: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  username: string;
  action: string; // e.g., 'AUTH_LOGIN', 'SERVICE_CREATE', 'LEAD_STATUS_UPDATE'
  entity_type: string; // 'users', 'services', 'leads', 'settings', etc.
  entity_id: string;
  ip_address: string;
  details: string;
  created_at: string;
}

// Complete Database Schema representation
export interface DatabaseSchema {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  sessions: Session[];
  site_settings: SiteSettings;
  navigation_items: NavigationItem[];
  page_sections: PageSection[];
  services: ServiceItem[];
  portfolio_projects: PortfolioProject[];
  blog_posts: BlogPostItem[];
  faqs: FAQEntry[];
  testimonials: TestimonialItem[];
  leads: Lead[];
  lead_notes: LeadNote[];
  lead_activities: LeadActivity[];
  contact_messages: ContactMessage[];
  media: MediaFile[];
  media_folders: MediaFolder[];
  seo_settings: SEOSettings;
  notifications: NotificationItem[];
  analytics_events: AnalyticsEvent[];
  audit_logs: AuditLog[];
}
