import bcrypt from 'bcryptjs';
import { DatabaseSchema } from './schema';

export function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  
  // Securely hash initial '1234' password for the first admin account
  const initialAdminPasswordHash = bcrypt.hashSync('1234', 10);

  return {
    users: [
      {
        id: 'usr_admin_01',
        username: 'admin',
        name: 'مدیر ارشد وبنیک',
        email: 'admin@webnick.ir',
        password_hash: initialAdminPasswordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        must_change_password: true, // Forces first-login password change
        last_login_at: null,
        created_at: now,
        updated_at: now,
      }
    ],

    roles: [
      {
        id: 'role_super_admin',
        name: 'SUPER_ADMIN',
        display_name: 'مدیر کل (Super Admin)',
        description: 'دسترسی کامل به تمامی بخش‌های سامانه، کاربران، تنظیمات و لاگ‌ها',
        is_system: true,
        created_at: now,
      },
      {
        id: 'role_admin',
        name: 'ADMIN',
        display_name: 'مدیر سیستم',
        description: 'دسترسی به مدیریت محتوا، سرنخ‌ها، خدمات، نمونه‌کارها و رسانه',
        is_system: true,
        created_at: now,
      },
      {
        id: 'role_editor',
        name: 'EDITOR',
        display_name: 'کارشناس محتوا',
        description: 'امکان ایجاد و ویرایش مقالات، خدمات و نمونه‌کارها',
        is_system: true,
        created_at: now,
      },
      {
        id: 'role_support',
        name: 'SUPPORT',
        display_name: 'پشتیبانی و فروش',
        description: 'مدیریت و پیگیری سرنخ‌های دریافتی و پیام‌های مشتریان',
        is_system: true,
        created_at: now,
      }
    ],

    permissions: [
      { id: 'p_site_read', code: 'site.read', category: 'Site', description: 'مشاهده اطلاعات کلی وب‌سایت' },
      { id: 'p_site_update', code: 'site.update', category: 'Site', description: 'به‌روزرسانی تنظیمات وب‌سایت' },
      { id: 'p_services_read', code: 'services.read', category: 'Services', description: 'مشاهده لیست خدمات' },
      { id: 'p_services_create', code: 'services.create', category: 'Services', description: 'افزودن خدمت جدید' },
      { id: 'p_services_update', code: 'services.update', category: 'Services', description: 'ویرایش خدمات' },
      { id: 'p_services_delete', code: 'services.delete', category: 'Services', description: 'حذف خدمات' },
      { id: 'p_portfolio_read', code: 'portfolio.read', category: 'Portfolio', description: 'مشاهده نمونه‌کارها' },
      { id: 'p_portfolio_create', code: 'portfolio.create', category: 'Portfolio', description: 'افزودن نمونه‌کار' },
      { id: 'p_portfolio_update', code: 'portfolio.update', category: 'Portfolio', description: 'ویرایش نمونه‌کار' },
      { id: 'p_portfolio_delete', code: 'portfolio.delete', category: 'Portfolio', description: 'حذف نمونه‌کار' },
      { id: 'p_blog_read', code: 'blog.read', category: 'Blog', description: 'مشاهده مقالات' },
      { id: 'p_blog_create', code: 'blog.create', category: 'Blog', description: 'نگارش مقاله جدید' },
      { id: 'p_blog_update', code: 'blog.update', category: 'Blog', description: 'ویرایش مقالات' },
      { id: 'p_blog_delete', code: 'blog.delete', category: 'Blog', description: 'حذف مقالات' },
      { id: 'p_leads_read', code: 'leads.read', category: 'Leads', description: 'مشاهده سرنخ‌های مشاوره' },
      { id: 'p_leads_update', code: 'leads.update', category: 'Leads', description: 'تغییر وضعیت و ثبت یادداشت سرنخ' },
      { id: 'p_leads_export', code: 'leads.export', category: 'Leads', description: 'خروجی اکسل سرنخ‌ها' },
      { id: 'p_media_upload', code: 'media.upload', category: 'Media', description: 'بارگذاری فایل و تصاویر' },
      { id: 'p_users_manage', code: 'users.manage', category: 'Users', description: 'مدیریت کاربران و دسترسی‌ها' },
      { id: 'p_audit_read', code: 'audit.read', category: 'Audit', description: 'مشاهده لاگ‌های امنیتی سیستم' },
    ],

    sessions: [],

    site_settings: {
      id: 'settings_main',
      site_name: 'Webnick - آژانس طراحی سایت و توسعه وب',
      site_slogan: 'Your Digital Growth Partner',
      site_description: 'وبنیک؛ آژانس تخصصی طراحی وب‌سایت‌های مدرن، پلتفرم‌های فروشگاهی و استراتژی‌های رشد دیجیتال.',
      logo_url: '/files/logo.webp',
      favicon_url: '/files/logo.webp',
      phone_number: '۰۲۱-۸۸۹۹۰۰۰۰',
      emergency_phone: '۰۹۱۲-۰۰۰-۰۰۰۰',
      email: 'info@webnick.ir',
      whatsapp: 'https://wa.me/989120000000',
      telegram: 'https://t.me/webnick_agency',
      instagram: 'https://instagram.com/webnick.agency',
      linkedin: 'https://linkedin.com/company/webnick',
      youtube: 'https://youtube.com/@webnick',
      address: 'تهران، سعادت‌آباد، بلوار فرهنگ، برج نوآوری وبنیک، طبقه ۶',
      business_hours: 'شنبه تا چهارشنبه ۹ الی ۱۸ | پنج‌شنبه‌ها ۹ الی ۱۴',
      timezone: 'Asia/Tehran',
      google_analytics_id: 'G-WEBNICK2026',
      search_console_token: 'google-site-verification=webnick-official-key',
      meta_pixel_id: '',
      updated_at: now,
    },

    navigation_items: [
      { id: 'nav_1', label: 'خانه', url: '#home', section_id: 'home', target_blank: false, display_order: 1, is_visible: true, created_at: now, updated_at: now },
      { id: 'nav_2', label: 'خدمات', url: '#services', section_id: 'services', target_blank: false, display_order: 2, is_visible: true, created_at: now, updated_at: now },
      { id: 'nav_3', label: 'نمونه‌کارها', url: '#portfolio', section_id: 'portfolio', target_blank: false, display_order: 3, is_visible: true, created_at: now, updated_at: now },
      { id: 'nav_4', label: 'درباره ما', url: '#about', section_id: 'about', target_blank: false, display_order: 4, is_visible: true, created_at: now, updated_at: now },
      { id: 'nav_5', label: 'وبلاگ', url: '/blog', section_id: 'blog', target_blank: false, display_order: 5, is_visible: true, created_at: now, updated_at: now },
      { id: 'nav_6', label: 'تماس با ما', url: '#contact', section_id: 'contact', target_blank: false, display_order: 6, is_visible: true, created_at: now, updated_at: now },
    ],

    page_sections: [
      {
        id: 'sec_hero',
        section_key: 'hero',
        title: 'وب‌سایتی برای رشد کسب‌وکار شما',
        subtitle: 'ما در وب‌نیک، فقط سایت نمی‌سازیم؛ به کسب‌وکارها کمک می‌کنیم تا در دنیای دیجیتال، دیده شوند، اعتماد بسازند و فروش خود را چند برابر کنند.',
        eyebrow: 'آژانس طراحی سایت و توسعه وب',
        content: {
          hero_image: '/files/hero.webp',
          primary_cta_text: 'مشاوره رایگان',
          primary_cta_url: '#contact',
          secondary_cta_text: 'مشاهده نمونه‌کارها',
          secondary_cta_url: '#portfolio',
          badges: [
            { label: 'پشتیبانی مداوم', icon: 'shield' },
            { label: '+۹۸٪ رضایت مشتریان', icon: 'star' },
            { label: '+۴۸۰ پروژه موفق', icon: 'award' }
          ]
        },
        is_active: true,
        updated_at: now,
      },
      {
        id: 'sec_final_cta',
        section_key: 'final_cta',
        title: 'برای مشاوره رایگان با ما در ارتباط باشید',
        subtitle: 'نیاز کسب‌وکارتان را با ما در میان بگذارید؛ کارشناسان وب‌نیک آماده‌اند تا بهترین مسیر را برای حضور آنلاین و رشد شما پیشنهاد دهند.',
        eyebrow: 'هنوز مطمئن نیستید؟',
        content: {
          image_url: '/files/footer.webp',
          primary_button_text: 'درخواست مشاوره رایگان',
          secondary_button_text: 'تماس با ما (۰۲۱-۸۸۹۹۰۰۰۰)',
          phone_number: '02188990000',
          perks: ['مشاوره کاملاً رایگان', 'پاسخگویی سریع', 'ارائه راهکار اختصاصی']
        },
        is_active: true,
        updated_at: now,
      },
      {
        id: 'sec_why_webnick',
        section_key: 'why_webnick',
        title: 'چرا وبنیک؟',
        subtitle: 'ما متفاوت فکر می‌کنیم و متفاوت عمل می‌کنیم.',
        eyebrow: 'مزیت‌های رقابتی وبنیک',
        content: {
          highlight_title: 'طراحی مدرن / تجربه کاربری عالی',
          highlight_subtitle: 'ترکیب زیبایی بصری با بالاترین استانداردهای سرعت و بازدهی فروش'
        },
        is_active: true,
        updated_at: now,
      }
    ],

    services: [
      {
        id: 'srv_1',
        title: 'بهینه‌سازی موتورهای جستجو',
        slug: 'seo-search-engine-optimization',
        short_desc: 'ساخت و رتبه‌سازی در گوگل و جذب ترافیک هدفمند',
        long_desc: 'تدوین استراتژی سئو تکنیکال، سئو داخلی و لینک‌سازی اصولی برای رساندن کلمات کلیدی درآمدزا به رتبه‌های برتر صفحه اول گوگل.',
        icon_type: 'seo',
        deliverables: ['تحقیق کلمات کلیدی پول‌ساز', 'اصلاح ساختار سئو تکنیکال', 'بهینه‌سازی Core Web Vitals', 'گزارش ماهانه رشد ترافیک'],
        duration: '۳ الی ۶ ماه',
        category: 'سئو و مارکتینگ',
        display_order: 1,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'خدمات سئو حرفه‌ای وبنیک | رتبه ۱ گوگل',
        seo_description: 'بهینه‌سازی و سئو سایت تخصصی برای رتبه‌گیری در صفحه اول گوگل و جذب مشتریان واقعی.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'srv_2',
        title: 'سئو و بهینه‌سازی',
        slug: 'ecommerce-optimization-sales',
        short_desc: 'راه‌اندازی فروشگاه‌های آنلاین با درگاه پرداخت برند شما',
        long_desc: 'ارتقای معماری صفحات محصول، اتصال به سیستم‌های حسابداری، راه‌اندازی سریع درگاه‌های پرداخت شاپرک و تجربه خرید فوق‌العاده برای خریداران.',
        icon_type: 'search',
        deliverables: ['طراحی سبد خرید مدرن و تک‌مرحله‌ای', 'اتصال مستقیم به درگاه‌های پرداخت', 'سیستم مدیریت انبار و فاکتور', 'امنیت بالا در برابر تراکنش‌های ناموفق'],
        duration: '۳ الی ۵ هفته',
        category: 'فروشگاه اینترنتی',
        display_order: 2,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'طراحی فروشگاه اینترنتی اختصاصی | وبنیک',
        seo_description: 'فروشگاه آنلاین با امکانات تسویه سریع و اتصال به درگاه پرداخت مستقیم بانکی.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'srv_3',
        title: 'طراحی سایت اختصاصی',
        slug: 'custom-web-development',
        short_desc: 'ساخت سایت‌های مدرن، سریع و کاملاً بهینه‌سازی شده',
        long_desc: 'طراحی UI/UX سفارشی بر اساس هویت برند شما و کدنویسی پیشرفته با استانداردهای جهانی وب، بدون استفاده از قالب‌های آماده و سنگین.',
        icon_type: 'code',
        deliverables: ['طراحی اختصاصی در فیگما', 'کدنویسی تمیز با React/Next.js', 'سرعت لود زیر ۱ ثانیه', 'پنل مدیریت اختصاصی و آسان'],
        duration: '۴ الی ۸ هفته',
        category: 'طراحی وب',
        display_order: 3,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'طراحی سایت اختصاصی شرکتی و سازمانی | وبنیک',
        seo_description: 'طراحی وب‌سایت کاملاً اختصاصی و کدنویسی شده بدون قالب آماده، سریع و امن.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'srv_4',
        title: 'دیجیتال مارکتینگ',
        slug: 'digital-marketing-campaigns',
        short_desc: 'تبلیغات هوشمند و استراتژی‌های افزایش رتبه در گوگل',
        long_desc: 'طراحی کمپین‌های تبلیغاتی اثربخش گوگل ادز، بازاریابی ایمیلی و لندینگ پیج‌های با نرخ تبدیل بالا برای بیشینه‌سازی فروش کسب‌وکار شما.',
        icon_type: 'marketing',
        deliverables: ['کمپین‌های هدفمند Google Ads', 'بهینه‌سازی نرخ تبدیل (CRO)', 'طراحی لندینگ‌پیج‌های پرفروش', 'اتصال آنالیتیکس ۴ و تگ منیجر'],
        duration: 'مستمر ماهانه',
        category: 'مارکتینگ',
        display_order: 4,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'دیجیتال مارکتینگ و تبلیغات گوگل | وبنیک',
        seo_description: 'کمپین‌های دیجیتال مارکتینگ پربازده برای جذب سریع مشتریان هدفمند.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'srv_5',
        title: 'خدمات هوش مصنوعی',
        slug: 'ai-solutions-automation',
        short_desc: 'ساخت و پیاده‌سازی ابزارهای AI و اتوماسیون فرایندها',
        long_desc: 'یکپارچه‌سازی دستیارهای هوشمند، چت‌بات‌های پاسخگویی ۲۴ ساعته بر پایه داده‌های شرکت و خودکارسازی روندهای اداری و پشتیبانی.',
        icon_type: 'ai',
        deliverables: ['چت‌بات هوشمند پشتیبانی سایت', 'تولید محتوای خودکار با هوش مصنوعی', 'اتوماسیون فرم‌های ورودی مشتریان', 'سیستم تحلیل رفتار کاربران'],
        duration: '۲ الی ۴ هفته',
        category: 'هوش مصنوعی',
        display_order: 5,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'خدمات هوش مصنوعی و اتوماسیون سازمانی | وبنیک',
        seo_description: 'یکپارچه‌سازی هوش مصنوعی و چت‌بات‌های پیشرفته در وب‌سایت‌ها و سامانه‌ها.',
        created_at: now,
        updated_at: now,
      }
    ],

    portfolio_projects: [
      {
        id: 'prj_1',
        title: 'کافه لته',
        slug: 'cafe-latte',
        client_name: 'مجموعه زنجیره‌ای کافه لته',
        category: 'کافه و رستوران',
        category_key: 'cafe',
        short_description: 'طراحی وب‌سایت تعاملی و منوی دیجیتال هوشمند',
        full_description: 'طراحی پلتفرم سفارش‌گیری آنلاین و رزرو میز برای شعب کافه لته به همراه اتصال به درگاه پرداخت و پنل حسابداری فروشگاهی.',
        cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
        gallery_images: [
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&auto=format&fit=crop&q=80'
        ],
        project_url: 'https://cafelatte.example',
        tech_stack: ['React', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
        results: ['+۲۴۰٪ افزایش سفارش‌های آنلاین', 'کاهش ۵۰٪ زمان انتظار مشتری در ثبت سفارش'],
        accent_color: '#8b5a2b',
        preview_type: 'cafe',
        year: '۱۴۰۴',
        display_order: 1,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'نمونه‌کار کافه لته | وبنیک',
        seo_description: 'پروژه طراحی سایت و منوی هوشمند کافه لته توسط آژانس وبنیک.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prj_2',
        title: 'شرکت ساختمانی آریان',
        slug: 'arian-construction',
        client_name: 'گروه سرمایه‌گذاری و ساختمانی آریان',
        category: 'سایت شرکتی',
        category_key: 'corporate',
        short_description: 'طراحی پرتال سازمانی و معرفی پروژه‌های لوکس عمرانی',
        full_description: 'طراحی هویت بصری دیجیتال و سایت سازمانی هلدینگ آریان با گالری ۳ بعدی پروژه‌ها، فرم‌های سرمایه‌گذاری و دانلود بروشورهای اختصاصی.',
        cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
        gallery_images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80'
        ],
        project_url: 'https://arian-holding.example',
        tech_stack: ['React', 'TypeScript', 'Tailwind', 'Three.js'],
        results: ['۳ برابر شدن درخواست‌های سرمایه‌گذاری', 'کسب رتبه ۱ گوگل در کلمات کلیدی ساختمانی'],
        accent_color: '#1e3a8a',
        preview_type: 'building',
        year: '۱۴۰۳',
        display_order: 2,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'نمونه‌کار شرکت ساختمانی آریان | وبنیک',
        seo_description: 'پرتال جامع ساختمانی و عمرانی هلدینگ آریان طراحی شده توسط وبنیک.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prj_3',
        title: 'فروشگاه ساعت',
        slug: 'luxury-watch-store',
        client_name: 'گالری ساعت‌های لوکس رولکس و امگا',
        category: 'فروشگاه آنلاین',
        category_key: 'ecommerce',
        short_description: 'طراحی فروشگاه تخصصی ساعت‌های لوکس با تسویه حساب سریع',
        full_description: 'طراحی و توسعه فروشگاه آنلاین لوکس با قابلیت مشاهده ۳۶۰ درجه محصولات، تضمین اصالت کالا و تسویه یک‌مرحله‌ای.',
        cover_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        gallery_images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80'
        ],
        project_url: 'https://watchstore.example',
        tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        results: ['رشد ۱۸۰ درصدی تراکنش‌های آنلاین ماهانه', 'نرخ پرش کمتر از ۱۸ درصد'],
        accent_color: '#d97706',
        preview_type: 'watch',
        year: '۱۴۰۴',
        display_order: 3,
        is_featured: true,
        status: 'PUBLISHED',
        seo_title: 'نمونه‌کار فروشگاه ساعت لوکس | وبنیک',
        seo_description: 'طراحی فروشگاه تخصصی کالاهای لوکس با بالاترین نرخ تبدیل.',
        created_at: now,
        updated_at: now,
      }
    ],

    blog_posts: [
      {
        id: 'post_1',
        slug: 'comprehensive-web-design-guide-2026',
        title: 'راهنمای جامع طراحی سایت در سال ۲۰۲۶: از اصول UI/UX تا استراتژی جذب مشتری',
        excerpt: 'چگونه یک وب‌سایت مدرن می‌تواند نرخ تبدیل کسب‌وکار شما را تا ۳ برابر افزایش دهد؟ بررسی استانداردهای روز سرعت، سئو و هوش مصنوعی در توسعه وب.',
        category: 'طراحی سایت',
        author_name: 'مهندس حامد رضایی',
        author_role: 'مدیر ارشد فنی و طراحی وبنیک',
        author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        published_at: '۱۲ بهمن ۱۴۰۴',
        read_time: '۶ دقیقه مطالعه',
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
        tags: ['طراحی وب', 'تجربه کاربری UI/UX', 'بهینه‌سازی نرخ تبدیل', 'ترندهای ۲۰۲۶'],
        status: 'PUBLISHED',
        seo_title: 'راهنمای جامع طراحی سایت ۲۰۲۶ | آژانس وبنیک',
        seo_description: 'اصول مدرن طراحی وب، تجربه کاربری و بهینه‌سازی فروش برای وب‌سایت‌های تجاری در سال ۲۰۲۶.',
        canonical_url: 'https://webnick.ir/blog/comprehensive-web-design-guide-2026',
        og_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
        content: {
          intro: 'در سال ۲۰۲۶، داشتن یک وب‌سایت صرفاً به معنای حضور در اینترنت نیست؛ بلکه وب‌سایت شما دفتر مرکزی دیجیتال، نماینده فروش ۲۴ ساعته و قلب تپنده هویت برند شماست.',
          sections: [
            {
              heading: '۱. اصل اول: سرعت بارگذاری زیر ۱.۵ ثانیه (Speed is King)',
              body: [
                'تحقیقات نشان می‌دهد بیش از ۵۳ درصد از کاربران تلفن همراه، وب‌سایتی را که بارگذاری آن بیش از ۲ ثانیه طول بکشد، ترک می‌کنند.',
                'در وبنیک، با حذف کدهای غیرضروری و بهره‌گیری از زیرساخت‌های ابری پرسرعت، لود سایت‌ها در کمترین زمان ممکن تضمین می‌شود.'
              ],
              tipBox: 'نکته کلیدی: هر ۱۰۰ میلی‌ثانیه بهبود در سرعت لود سایت، نرخ تبدیل و فروش آنلاین را تا ۷ درصد افزایش می‌دهد.'
            },
            {
              heading: '۲. طراحی ریسپانسیو و تفکر «موبایل در اولویت» (Mobile-First)',
              body: [
                'بیش از ۷۸ درصد از ترافیک وب در ایران از طریق گوشی‌های هوشمند انجام می‌شود. یک طراحی موفق باید تجربه کاربری بی‌نقصی در ابعاد مختلف صفحه نمایش خلق کند.'
              ]
            }
          ],
          conclusion: 'طراحی وب‌سایت یک سرمایه‌گذاری استراتژیک برای آینده کسب‌وکار شماست. اگر آماده‌اید حضور آنلاین برند خود را متحول کنید، تیم وبنیک همراه شماست.'
        },
        created_at: now,
        updated_at: now,
      }
    ],

    faqs: [
      {
        id: 'faq_1',
        question: 'هزینه و زمان تحویل طراحی یک وب‌سایت اختصاصی چقدر است؟',
        answer: 'هزینه و مدت زمان طراحی به ابعاد پروژه و امکانات مورد نیاز بستگی دارد. به طور معمول پروژه‌های شرکتی بین ۳ الی ۵ هفته و فروشگاه‌های پیشرفته بین ۵ الی ۸ هفته کاری زمان می‌برند. در جلسه مشاوره اولیه، پیش‌فاکتور دقیق و شفاف همراه با زمان‌بندی مرحله‌به‌مرحله تقدیم شما می‌گردد.',
        category: 'عمومی',
        display_order: 1,
        status: 'PUBLISHED',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'faq_2',
        question: 'آیا وب‌سایت‌های طراحی شده توسط وبنیک روی گوشی‌های موبایل به خوبی کار می‌کنند؟',
        answer: 'بله، ۱۰۰٪ طراحی‌های ما بر پایه استراتژی Mobile-First انجام می‌شوند. سایت شما در تمامی دستگاه‌ها از جمله موبایل، تبلت و مانیتورهای بزرگ دسکتاپ با بالاترین سرعت و زیباترین چیدمان اجرا می‌شود.',
        category: 'فنی',
        display_order: 2,
        status: 'PUBLISHED',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'faq_3',
        question: 'آیا پس از تحویل سایت، پشتیبانی فنی و آموزشی ارائه می‌شود؟',
        answer: 'قطعاً. تمامی پروژه‌های وبنیک همراه با ۱ سال گارانتی و پشتیبانی فنی رایگان ارائه می‌شوند. همچنین ویدیوی آموزشی کار با پنل مدیریت ضبط شده و در اختیار تیم شما قرار می‌گیرد.',
        category: 'پشتیبانی',
        display_order: 3,
        status: 'PUBLISHED',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'faq_4',
        question: 'آیا سایت‌های وبنیک برای سئو و رتبه در صفحه اول گوگل بهینه‌سازی شده‌اند؟',
        answer: 'بله، تمامی اصول سئو تکنیکال از ساختار کدهای استاندارد، سرعت لود زیر ۲ ثانیه، متاتگ‌های اسکیما (Schema) و نقشه سایت از همان روز اول در طراحی لحاظ می‌شوند تا سریع‌ترین رتبه‌گیری در گوگل حاصل شود.',
        category: 'سئو',
        display_order: 4,
        status: 'PUBLISHED',
        created_at: now,
        updated_at: now,
      }
    ],

    testimonials: [
      {
        id: 'tst_1',
        name: 'علی رضایی',
        role: 'مدیرعامل فروشگاه زنجیره‌ای کافه لته',
        company: 'کافه لته',
        quote: 'همکاری با وبنیک نقطه عطف بیزینس ما بود. وب‌سایت منوی آنلاین دقیقاً چیزی شد که می‌خواستیم؛ فوق‌العاده سریع، کاربرپسند و با بازدهی فروش باورنکردنی.',
        rating: 5,
        avatar_color: '#3b82f6',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        display_order: 1,
        is_featured: true,
        status: 'PUBLISHED',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'tst_2',
        name: 'سارا تهرانی',
        role: 'مدیر مارکتینگ هلدینگ آریان',
        company: 'گروه ساختمانی آریان',
        quote: 'تیم وبنیک متعهدترین آژانسی است که تا به حال با آنها کار کرده‌ایم. تحویل به موقع، کدنویسی تمیز و پشتیبانی بسیار قوی از ویژگی‌های بارز این تیم است.',
        rating: 5,
        avatar_color: '#10b981',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        display_order: 2,
        is_featured: true,
        status: 'PUBLISHED',
        created_at: now,
        updated_at: now,
      }
    ],

    leads: [
      {
        id: 'lead_101',
        full_name: 'امیرحسین مرادی',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        email: 'moradi@example.com',
        business_name: 'آتلیه معماری آرکا',
        business_type: 'مهندسی و معماری',
        requested_service: 'طراحی سایت اختصاصی',
        budget: '۵۰ الی ۸۰ میلیون تومان',
        message: 'سلام، نیاز به یک وب‌سایت پورتفولیو بسیار شیک و مدرن برای معرفی پروژه‌های ویلایی داریم.',
        source: 'hero_cta',
        status: 'NEW',
        priority: 'HIGH',
        assigned_to: 'admin',
        follow_up_date: new Date(Date.now() + 86400000).toISOString(),
        notes_count: 1,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        updated_at: now,
      },
      {
        id: 'lead_102',
        full_name: 'مریم کمالی',
        phone: '۰۹۱۹۸۷۶۵۴۳۲',
        email: 'kamali@store.ir',
        business_name: 'بوتیک مانتو زیما',
        business_type: 'پوشاک و مد',
        requested_service: 'سئو و بهینه‌سازی',
        budget: '۳۰ الی ۵۰ میلیون تومان',
        message: 'می‌خواهیم فروشگاه اینترنتی پوشاک راه‌اندازی کنیم و به درگاه بانک و نرم‌افزار سپیدار متصل شود.',
        source: 'final_cta',
        status: 'CONTACTED',
        priority: 'MEDIUM',
        assigned_to: 'admin',
        follow_up_date: null,
        notes_count: 1,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: now,
      }
    ],

    lead_notes: [
      {
        id: 'note_1',
        lead_id: 'lead_101',
        user_id: 'usr_admin_01',
        user_name: 'مدیر ارشد وبنیک',
        content: 'تماس اولیه گرفته شد؛ مشتاق دریافت نمونه‌پروژه‌های معماری مشابه هستند. جلسه آنلاین برای فردا ساعت ۱۱ هماهنگ شد.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ],

    lead_activities: [
      {
        id: 'act_1',
        lead_id: 'lead_101',
        user_id: 'usr_admin_01',
        user_name: 'سیستم',
        action_type: 'CREATED',
        description: 'سرنخ از طریق فرم مشاوره هیرو ثبت شد.',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ],

    contact_messages: [
      {
        id: 'msg_1',
        full_name: 'بهنام صالحی',
        email: 'salehi@techcorp.ir',
        phone: '۰۹۳۵۰۰۰۱۱۲۲',
        subject: 'درخواست همکاری B2B',
        message: 'با سلام، شرکت ما در حوزه تأمین قطعات الکترونیک فعال است و مایل به بررسی همکاری با وبنیک برای نوسازی وب‌سایت سازمانی هستیم.',
        ip_address: '5.200.12.44',
        is_read: false,
        is_replied: false,
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: now,
      }
    ],

    media: [
      {
        id: 'med_1',
        filename: 'logo1.jpg',
        original_name: 'logo1.jpg',
        url: '/files/logo1.jpg',
        mime_type: 'image/jpeg',
        file_size: 45000,
        folder_id: null,
        alt_text: 'Webnick Logo Header',
        title: 'لوگوی رسمی وبنیک',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'med_2',
        filename: 'hero.webp',
        original_name: 'hero.webp',
        url: '/files/hero.webp',
        mime_type: 'image/webp',
        file_size: 185000,
        folder_id: null,
        alt_text: 'Webnick Hero Laptop Presentation',
        title: 'تصویر اصلی بخش هیرو',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'med_3',
        filename: 'footer.webp',
        original_name: 'footer.webp',
        url: '/files/footer.webp',
        mime_type: 'image/webp',
        file_size: 140000,
        folder_id: null,
        alt_text: 'Webnick Final Consultation CTA',
        title: 'تصویر کادر مشاوره پایانی',
        created_at: now,
        updated_at: now,
      }
    ],

    media_folders: [
      { id: 'fld_branding', name: 'هویت بصری و برند', parent_id: null, created_at: now },
      { id: 'fld_projects', name: 'تصاویر پروژه‌ها', parent_id: null, created_at: now },
      { id: 'fld_blog', name: 'عکس‌های مقالات', parent_id: null, created_at: now }
    ],

    seo_settings: {
      id: 'seo_global',
      default_title: 'Webnick - آژانس طراحی سایت و توسعه وب',
      title_template: '%s | آژانس طراحی وبنیک',
      default_description: 'وبنیک؛ آژانس تخصصی طراحی وب‌سایت‌های مدرن، سئو، فروشگاه آنلاین و رشد کسب‌وکار در دنیای دیجیتال.',
      default_og_image: '/files/hero.webp',
      canonical_base_url: 'https://webnick.ir',
      robots_content: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://webnick.ir/sitemap.xml',
      enable_sitemap: true,
      enable_indexing: true,
      updated_at: now,
    },

    notifications: [
      {
        id: 'notif_1',
        title: 'سرنخ جدید ثبت شد',
        message: 'امیرحسین مرادی درخواست مشاوره «طراحی سایت اختصاصی» ثبت کرد.',
        type: 'LEAD',
        entity_type: 'leads',
        entity_id: 'lead_101',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'notif_2',
        title: 'پیام تماس جدید',
        message: 'بهنام صالحی یک پیام با موضوع «درخواست همکاری B2B» ارسال کرد.',
        type: 'MESSAGE',
        entity_type: 'messages',
        entity_id: 'msg_1',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      }
    ],

    analytics_events: [
      {
        id: 'evt_1',
        event_type: 'PAGE_VIEW',
        event_label: 'صفحه اصلی',
        page_url: '/',
        created_at: now,
      }
    ],

    audit_logs: [
      {
        id: 'log_init',
        user_id: 'usr_admin_01',
        username: 'admin',
        action: 'SYSTEM_INITIALIZATION',
        entity_type: 'system',
        entity_id: 'sys',
        ip_address: '127.0.0.1',
        details: 'راه‌اندازی اولیه پایگاه داده و پیکربندی اولیه وبنیک',
        created_at: now,
      }
    ]
  };
}
