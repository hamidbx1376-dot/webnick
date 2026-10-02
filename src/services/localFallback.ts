// Client-side Local Storage Database Fallback for Static Deployments (Cloudflare Pages, etc.)

export interface LocalDatabase {
  services: any[];
  portfolio_projects: any[];
  blog_posts: any[];
  faqs: any[];
  testimonials: any[];
  page_sections: any[];
  site_settings: any;
  seo_settings: any;
  leads: any[];
  contact_messages: any[];
  users: any[];
  audit_logs: any[];
  analytics_events: any[];
}

const LOCAL_DB_KEY = 'webnick_local_cms_data_v1';

const INITIAL_FALLBACK_DATA: LocalDatabase = {
  services: [
    {
      id: 'srv_01',
      title: 'طراحی سایت اختصاصی',
      slug: 'custom-web-design',
      subtitle: 'طراحی کاملاً سفارشی، بدون قالب آماده و منطبق بر هویت بصری برند شما',
      icon_name: 'Code2',
      badge_text: 'پرطرفدار',
      is_popular: true,
      price_range: 'از ۲۵ میلیون تومان',
      estimated_delivery_days: 20,
      description: 'طراحی و توسعه وب‌سایت‌های اختصاصی با معماری ماژولار، کدنویسی تمیز بر پایه React و TypeScript، با بالاترین سرعت لود و استانداردهای سئو تکنیکال.',
      deliverables: ['طراحی اختصاصی UI/UX در فیگما', 'کدنویسی فرانت‌اند مدرن با React و Tailwind', 'پنل مدیریت اختصاصی', 'بهینه‌سازی کامل سئو داخلی', '۱ سال پشتیبانی فنی رایگان'],
      process_steps: ['جلسه شناخت و نیازسنجی', 'طراحی وایرفریم و پروتوتایپ', 'کدنویسی اختصاصی', 'تست‌های امنیت و ریسپانسیو', 'تحویل و آموزش'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      sort_order: 1,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'srv_02',
      title: 'طراحی فروشگاه اینترنتی',
      slug: 'ecommerce-web-design',
      subtitle: 'سامانه فروش آنلاین هوشمند با اتصال به تمام درگاه‌های پرداخت و انبارداری',
      icon_name: 'ShoppingBag',
      badge_text: 'ویژه فروش',
      is_popular: false,
      price_range: 'از ۳۵ میلیون تومان',
      estimated_delivery_days: 30,
      description: 'فروشگاه‌های آنلاین اختصاصی با تجربه خرید فوق‌العاده سریع، سیستم تخفیف‌های پیشرفته، فیلترینگ چندوجهی کالا و اتصال به درگاه‌ها و شرکت‌های حمل و نقل.',
      deliverables: ['فرایند خرید تک‌مرحله‌ای (One-step checkout)', 'اتصال به درگاه‌های پرداخت بانکی', 'پنل انبارداری و حسابداری آنلاین', 'ماژول پیامکی وضعیت سفارش', 'نسخه وب‌اپلیکیشن (PWA)'],
      process_steps: ['تحلیل جریان مشتریان', 'طراحی تجربه کاربری خرید', 'پیاده‌سازی ماژول‌های فروشگاهی', 'اتصال سامانه‌های مالی', 'راه‌اندازی آزمایشی و رونمایی'],
      technologies: ['React', 'Next.js', 'Express', 'Redis', 'ZarinPal'],
      sort_order: 2,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'srv_03',
      title: 'سئو و بهینه‌سازی موتورهای جستجو',
      slug: 'seo-optimization',
      subtitle: 'حضور در صفحه اول گوگل و جذب مداوم مشتریان ارگانیک و هدفمند',
      icon_name: 'TrendingUp',
      badge_text: 'رشد مداوم',
      is_popular: false,
      price_range: 'ماهانه از ۱۰ میلیون تومان',
      estimated_delivery_days: 90,
      description: 'استراتژی جامع سئو شامل تحقیق کلمات کلیدی، رفع خطاهای تکنیکال سرچ کنسول، تولید محتوای ارزشمند و سئو محلی برای سلطه بر نتایج جستجوی حوزه کاری شما.',
      deliverables: ['تحلیل و ممیزی جامع سایت (Audit)', 'تحقیق کلمات کلیدی پول‌ساز', 'تولید تقویم محتوایی اختصاصی', 'بهبود امتیاز Core Web Vitals', 'گزارش‌های هفتگی و ماهانه رنکینگ'],
      process_steps: ['ممیزی تکنیکال', 'تحلیل رقبا', 'بهینه‌سازی On-Page', 'استراتژی Off-Page و رپورتاژ', 'پایش و رشد رتبه'],
      technologies: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'Schema.org'],
      sort_order: 3,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'srv_04',
      title: 'طراحی رابط و تجربه کاربری (UI/UX)',
      slug: 'ui-ux-design',
      subtitle: 'طراحی بصری چشم‌نواز و پروتوتایپ‌های مدرن مطابق استانداردهای روز دنیا',
      icon_name: 'Palette',
      badge_text: '',
      is_popular: false,
      price_range: 'از ۱۸ میلیون تومان',
      estimated_delivery_days: 15,
      description: 'طراحی حرفه‌ای دیزاین سیستم، رابط‌های کاربری چشم‌نواز و جریان‌های کاربری روان در فیگما قبل از ورود به فاز پیاده‌سازی و کدنویسی.',
      deliverables: ['دیزاین سیستم اختصاصی (Design System)', 'وایرفریم‌های Low & High Fidelity', 'پروتوتایپ تعاملی و قابل تست', 'انیمیشن‌ها و میکرو اینتراکشن‌ها', 'فایل فیگما کامپوننت‌بندی شده'],
      process_steps: ['تحقیقات کاربری و پرسونا', 'وایرفریمینگ ساختار', 'طراحی بصری در فیگما', 'تست با کاربران واقعی', 'تحویل به تیم فنی'],
      technologies: ['Figma', 'FigJam', 'Design Tokens', 'Prototyping'],
      sort_order: 4,
      status: 'PUBLISHED',
      is_featured: false,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'srv_05',
      title: 'پشتیبانی و نگهداری تخصصی',
      slug: 'website-maintenance-support',
      subtitle: 'تامین امنیت، سرعت بالا و آپ‌تایم ۱۰۰٪ با مانیتورینگ دائمی سایت',
      icon_name: 'ShieldCheck',
      badge_text: '',
      is_popular: false,
      price_range: 'ماهانه از ۵ میلیون تومان',
      estimated_delivery_days: 30,
      description: 'پشتیبانی فنی مداوم، بکاپ‌گیری روزانه در فضای ابری امن، رفع فوری باگ‌های احتمالی، به‌روزرسانی مداوم بسته‌ها و مانیتورینگ ۲۴ ساعته آپ‌تایم.',
      deliverables: ['مانیتورینگ ۲۴ ساعته آپ‌تایم سرور', 'بکاپ‌گیری منظم و ابری', 'بررسی دوره‌ای خطاهای امنیتی', 'رفع اشکالات در کمتر از ۲ ساعت', 'به‌روزرسانی کتابخانه‌ها و پلاگین‌ها'],
      process_steps: ['بررسی وضعیت اولیه سایت', 'نصب سیستم‌های مانیتورینگ', 'پیکربندی بکاپ خودکار', 'پشتیبانی اختصاصی در تیکت/تلفن'],
      technologies: ['Uptime Kuma', 'Cloudflare', 'Sentry', 'Automated Backups'],
      sort_order: 5,
      status: 'PUBLISHED',
      is_featured: false,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  portfolio_projects: [
    {
      id: 'prj_01',
      title: 'ساعت لاکچری نویان',
      slug: 'noyan-watch',
      category: 'طراحی سایت فروشگاهی',
      category_slug: 'ecommerce',
      thumbnail_url: '/files/hero.webp',
      featured_image_url: '/files/hero.webp',
      gallery_urls: ['/files/hero.webp', '/files/footer.webp'],
      client_name: 'گالری ساعت نویان',
      year: '۱۴۰۴',
      delivery_days: 28,
      results: ['افزایش ۲۴۰٪ فروش اینترنتی در ماه اول', 'کاهش نرخ پرش (Bounce Rate) به ۲۸٪', 'کسب رتبه ۱ کلمات کلیدی تخصصی ساعت'],
      tech_stack: ['React', 'TypeScript', 'Tailwind', 'Express', 'Redis'],
      preview_type: 'watch',
      accent_color: '#081528',
      summary: 'فروشگاه اینترنتی لوکس ساعت با طراحی دارک‌مود اختصاصی، سیستم سفارش‌سازی بند و صفحه ساعت و نمایش سه‌بعدی محصولات.',
      challenge: 'نیاز به ایجاد یک حس اصالت و لوکس بودن برای مخاطبان خاص با سرعت بارگذاری فوق‌العاده بالا روی موبایل.',
      solution: 'طراحی مینیمال و تیره، استفاده از انیمیشن‌های روان فریمورک موشن، بهینه‌سازی تصاویر به فرمت WebP مدرن و ساده‌سازی فرایند پرداخت به ۲ مرحله.',
      live_url: 'https://webnick.ir',
      sort_order: 1,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'prj_02',
      title: 'هلدینگ ساختمانی آریان',
      slug: 'aryan-construction',
      category: 'طراحی سایت شرکتی و ساختمانی',
      category_slug: 'corporate',
      thumbnail_url: '/files/hero.webp',
      featured_image_url: '/files/hero.webp',
      gallery_urls: ['/files/hero.webp'],
      client_name: 'هلدینگ ساختمانی آریان سازه',
      year: '۱۴۰۳',
      delivery_days: 35,
      results: ['رتبه ۱ گوگل در ۳ کلمه کلیدی اصلی', 'رشد ۳۲۰٪ درخواست‌های همکاری سازمانی', 'بازدید ماهانه بیش از ۶۰ هزار نفر'],
      tech_stack: ['TypeScript', 'Tailwind', 'PostgreSQL', 'Three.js 3D Viewer'],
      preview_type: 'building',
      accent_color: '#0f172a',
      summary: 'طراحی پورتال معماری و ساختمانی برای معرفی پروژه‌های کلان، کاتالوگ تعاملی واحدها و فرم‌های استعلام قیمت آنلاین.',
      challenge: 'پرزنت پروژه‌های عظیم با نقشه‌های فنی و کاتالوگ‌های سنگین بدون افت سرعت لود صفحات.',
      solution: 'طراحی سیستم نمایشگر سبک با امکان مشاهده جزئیات معماری هر واحد و معماری هوشمند رندر سمت کاربر.',
      live_url: 'https://webnick.ir',
      sort_order: 2,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'prj_03',
      title: 'کافه لته',
      slug: 'latte-cafe',
      category: 'طراحی سایت کافه و رستوران',
      category_slug: 'cafe',
      thumbnail_url: '/files/hero.webp',
      featured_image_url: '/files/hero.webp',
      gallery_urls: ['/files/hero.webp'],
      client_name: 'مجموعه کافه‌های تخصصی لته',
      year: '۱۴۰۴',
      delivery_days: 18,
      results: ['بیش از ۱۰ هزار سفارش آنلاین در ماه اول', 'کاهش ۴۰٪ زمان ثبت سفارش حضوری', 'افزایش وفاداری مشتریان'],
      tech_stack: ['React Native PWA', 'Vite', 'Node.js', 'QR Order Engine'],
      preview_type: 'cafe',
      accent_color: '#1c1917',
      summary: 'طراحی منوی دیجیتال تعاملی، سیستم رزرو میز هوشمند و باشگاه مشتریان اختصاصی برای زنجیره کافه‌های لته.',
      challenge: 'ایجاد تجربه سفارش بدون معطلی سر میز با اسکن کیوآرکد روی گوشی‌های مختلف مشتریان.',
      solution: 'توسعه وب‌اپلیکیشن فوق‌العاده سریع با ذخیره‌سازی محلی سفارش و ارسال آنی به چاپگر باریستا.',
      live_url: 'https://webnick.ir',
      sort_order: 3,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  blog_posts: [
    {
      id: 'post_01',
      title: 'چرا طراحی سایت اختصاصی از وردپرس برای کسب‌وکارهای در حال رشد بهتر است؟',
      slug: 'why-custom-web-development-beats-wordpress',
      excerpt: 'مقایسه عمیق سرعت، امنیت، سئو و قابلیت مقیاس‌پذیری بین وب‌سایت‌های کدنویسی شده اختصاصی و قالب‌های آماده وردپرس.',
      content: 'در دنیای پررقابت امروز، سرعت بارگذاری سایت مستقیماً بر درآمد و نرخ تبدیل شما اثر می‌گذارد. وب‌سایت‌های وردپرسی به مرور زمان با نصب پلاگین‌های متعدد با کندی و حفره‌های امنیتی مواجه می‌شوند. در مقابل، یک معماری مدرن بر پایه React و TypeScript بالاترین پایداری و امنیت را به ارمغان می‌آورد.',
      featured_image: '/files/hero.webp',
      author_name: 'تیم فنی وبنیک',
      reading_time_minutes: 6,
      category: 'طراحی وب',
      tags: ['طراحی اختصاصی', 'وردپرس', 'سئو تکنیکال', 'سرعت سایت'],
      views_count: 850,
      likes_count: 64,
      status: 'PUBLISHED',
      is_featured: true,
      published_at: '2026-10-01T10:00:00.000Z',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'post_02',
      title: 'راهنمای جامع سئو تکنیکال در سال ۲۰۲۶: استانداردهای طلایی گوگل',
      slug: 'technical-seo-guide-2026',
      excerpt: 'بررسی فاکتورهای حیاتی Core Web Vitals جدید، ساختار داده‌های معنایی Schema و بهینه‌سازی خزش ربات‌های گوگل.',
      content: 'گوگل در سال‌های اخیر اهمیت ویژه‌ای به تجربه تعاملی کاربر و سیگنال‌های سرعت داده است. برای حضور در رتبه‌های برتر، تنها تولید محتوا کافی نیست؛ باید ساختار کدنویسی، تگ‌های داده‌ای و زیرساخت میزبانی شما بدون نقص باشد.',
      featured_image: '/files/hero.webp',
      author_name: 'مدیر سئو وبنیک',
      reading_time_minutes: 8,
      category: 'سئو',
      tags: ['سئو', 'گوگل', 'Core Web Vitals', 'رتبه‌بندی'],
      views_count: 1240,
      likes_count: 98,
      status: 'PUBLISHED',
      is_featured: true,
      published_at: '2026-09-28T14:30:00.000Z',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'post_03',
      title: '۵ اصل اساسی در طراحی صفحه اصلی (Landing Page) برای افزایش ۵ برابری فروش',
      slug: '5-landing-page-conversion-principles',
      excerpt: 'چگونه با چیدمان اصولی المان‌ها، ایجاد اعتماد و دکمه‌های اقدام شفاف (CTA)، نرخ تبدیل مخاطب به مشتری را چند برابر کنیم.',
      content: 'صفحه اصلی ویترین آنلاین شرکت شماست. مخاطب در کمتر از ۳ ثانیه تصمیم می‌گیرد که در سایت بماند یا آن را ترک کند. استفاده از تیترهای ارزش‌آفرین، مدارک اعتماد اجتماعی و فرم‌های مشاوره بدون دردسر رمز موفقیت برترین لندینگ‌پیج‌ها است.',
      featured_image: '/files/footer.webp',
      author_name: 'متخصص مارکتینگ وبنیک',
      reading_time_minutes: 5,
      category: 'دیجیتال مارکتینگ',
      tags: ['نرخ تبدیل', 'لندینگ پیج', 'فروش آنلاین', 'طراحی UI'],
      views_count: 670,
      likes_count: 42,
      status: 'PUBLISHED',
      is_featured: false,
      published_at: '2026-09-25T09:15:00.000Z',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  faqs: [
    {
      id: 'faq_01',
      question: 'طراحی یک وب‌سایت اختصاصی چقدر زمان می‌برد؟',
      answer: 'بسته به گستردگی پروژه و نیازمندی‌های کسب‌وکار شما، معمولاً بین ۱۵ تا ۳۵ روز کاری زمان نیاز است. زمان‌بندی دقیق در قرارداد اولیه قید می‌شود.',
      category: 'عمومی',
      sort_order: 1,
      status: 'PUBLISHED',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'faq_02',
      question: 'آیا بعد از تحویل سایت، امکان ویرایش متون و محصولات توسط خودمان وجود دارد؟',
      answer: 'بله کاملاً. یک پنل مدیریت اختصاصی و ساده به زبان فارسی در اختیارتان قرار می‌گیرد و ویدیوی آموزشی نحوه کار با پنل نیز ارائه خواهد شد.',
      category: 'فنی',
      sort_order: 2,
      status: 'PUBLISHED',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'faq_03',
      question: 'پشتیبانی فنی وبنیک به چه صورت است؟',
      answer: 'تمامی پروژه‌ها دارای پشتیبانی فنی رایگان هستند که شامل رفع باگ‌های فنی، مانیتورینگ آپ‌تایم، بکاپ‌گیری منظم و راهنمایی تیم شما در ۷ روز هفته است.',
      category: 'پشتیبانی',
      sort_order: 3,
      status: 'PUBLISHED',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'faq_04',
      question: 'آیا سایت‌ها برای نمایش در موبایل و تبلت بهینه هستند؟',
      answer: 'تمام پروژه‌های وبنیک با رویکرد Mobile-First طراحی می‌شوند و روی انواع صفحات نمایش، تبلت‌ها و گوشی‌های آیفون و اندروید بررسی می‌شوند.',
      category: 'طراحی',
      sort_order: 4,
      status: 'PUBLISHED',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'faq_05',
      question: 'هزینه‌ها به چه شکلی پرداخت می‌شود؟',
      answer: 'پرداخت به صورت مرحله‌ای بر اساس پیشرفت پروژه در قرارداد مشخص می‌شود (پیش‌پرداخت در شروع، مرحله پس از تایید طرح، و تسویه در زمان تحویل نهایی).',
      category: 'مالی',
      sort_order: 5,
      status: 'PUBLISHED',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'faq_06',
      question: 'آیا هاست و دامنه هم توسط وبنیک تهیه می‌شود؟',
      answer: 'مشاوره رایگان انتخاب هاست پرسرعت ابری و دامنه توسط کارشناسان ما انجام می‌شود و در صورت تمایل، فرآیند خرید، ثبت و پیکربندی را برایتان انجام می‌دهیم.',
      category: 'عمومی',
      sort_order: 6,
      status: 'PUBLISHED',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  testimonials: [
    {
      id: 'tst_01',
      client_name: 'مهندس علیرضا سلیمانی',
      client_role: 'مدیرعامل',
      company_name: 'هلدینگ ساختمانی آریان',
      comment: 'همکاری با وبنیک نقطه عطفی برای حضور آنلاین برند ما بود. سرعت تحویل، توجه شگفت‌انگیز به جزئیات معماری و پشتیبانی بدون وقفه، سطح بسیار بالایی از حرفه‌ای‌گری را به نمایش گذاشت.',
      rating: 5,
      avatar_url: '',
      sort_order: 1,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'tst_02',
      client_name: 'دکتر شیوا ناصری',
      client_role: 'هم‌بنیان‌گذار',
      company_name: 'گالری نویان واچ',
      comment: 'فروشگاه آنلاینی که برای ما طراحی کردند از ماه اول فروشی فراتر از انتظار حضوری ما ایجاد کرد. سرعت سایت روی گوشی عالی است و مشتریان از سادگی فرایند خرید بسیار راضی هستند.',
      rating: 5,
      avatar_url: '',
      sort_order: 2,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'tst_03',
      client_name: 'فرزاد کاظمی',
      client_role: 'مدیر توسعه کسب‌وکار',
      company_name: 'زنجیره کافه‌های لته',
      comment: 'سیستم سفارش‌گیری کیوآر اختصاصی باعث شد در ساعات شلوغی کافه هیچ میزی معطل ثبت سفارش نماند. تیم وبنیک واقعاً نیاز ما را شناخت و بهترین راه‌حل را ساخت.',
      rating: 5,
      avatar_url: '',
      sort_order: 3,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  page_sections: [],
  site_settings: {
    site_name: 'وبنیک | آژانس تخصصی طراحی سایت و توسعه وب',
    site_tagline: 'Your Digital Growth Partner - شریک رشد دیجیتال شما',
    contact_phone: '۰۲۱-۸۸۹۹۰۰۰۰',
    contact_email: 'info@webnick.ir',
    office_address: 'تهران، خیابان ولیعصر، برج فناوری، طبقه ۸، واحد ۸۰۴',
    telegram_id: 'webnick_agency',
    instagram_id: 'webnick.ir',
    linkedin_url: 'https://linkedin.com/company/webnick',
    whatsapp_number: '+989120000000',
    working_hours: 'شنبه تا چهارشنبه ۹:۰۰ الی ۱۸:۰۰ | پنجشنبه‌ها ۹:۰۰ الی ۱۳:۰۰',
    hero_headline: 'طراحی سایت مدرن و هدفمند، برای رشد واقعی کسب‌وکار شما',
    hero_subheadline: 'وبنیک با طراحی اختصاصی، سئوی فنی و توسعه پرسرعت، ایده شما را به سامانه‌ای جذاب، پایدار و مشتری‌ساز تبدیل می‌کند.',
    logo_url: '/files/logo.webp',
    favicon_url: '/files/logo.webp'
  },
  seo_settings: {
    meta_title: 'Webnick - آژانس طراحی سایت و توسعه وب اختصاصی',
    meta_description: 'وبنیک؛ آژانس تخصصی طراحی سایت اختصاصی، فروشگاه آنلاین، سئو تکنیکال و سامانه‌های وب با استانداردهای مدرن سال ۲۰۲۶.',
    meta_keywords: 'طراحی سایت, طراحی سایت اختصاصی, سئو, شرکت طراحی سایت, قیمت طراحی سایت',
    og_title: 'وبنیک | طراحی سایت اختصاصی و سئو حرفه‌ای',
    og_description: 'سامانه حضور پرقدرت شما در دنیای دیجیتال. افزایش فروش و مشتری با طراحی سفارشی وبنیک.',
    og_image: '/files/hero.webp',
    robots_content: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://webnick.ir/sitemap.xml'
  },
  leads: [
    {
      id: 'lead_01',
      full_name: 'آرش کیانی',
      phone: '09121112233',
      email: 'arash@kiani-group.ir',
      business_name: 'گروه صنعتی کیانی',
      business_type: 'تولیدی و بازرگانی',
      requested_service: 'طراحی سایت اختصاصی',
      budget: 'بیش از ۴۰ میلیون تومان',
      message: 'نیاز به طراحی مجدد سایت شرکتی و کاتالوگ دو زبانه صادراتی داریم.',
      source: 'hero_cta',
      status: 'NEW',
      priority: 'HIGH',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    },
    {
      id: 'lead_02',
      full_name: 'مریم ابراهیمی',
      phone: '09359998877',
      email: 'm.ebrahimi@shoppy.ir',
      business_name: 'فروشگاه آنلاین شاپ‌شاپ',
      business_type: 'فروشگاه اینترنتی',
      requested_service: 'طراحی فروشگاه اینترنتی',
      budget: '۳۰ تا ۵۰ میلیون تومان',
      message: 'قصد مهاجرت از وردپرس به سامانه اختصاصی پرسرعت با حجم کالای بالای ۵۰۰۰ قلم داریم.',
      source: 'final_cta',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  contact_messages: [],
  users: [
    {
      id: 'usr_admin_01',
      username: 'admin',
      name: 'مدیر ارشد وبنیک',
      email: 'admin@webnick.ir',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      must_change_password: false,
      created_at: '2026-10-02T19:48:45.967Z',
      updated_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  audit_logs: [
    {
      id: 'log_01',
      user_id: 'usr_admin_01',
      username: 'admin',
      action: 'SYSTEM_INIT',
      entity_type: 'system',
      entity_id: '0',
      ip_address: '127.0.0.1',
      details: 'راه‌اندازی اولیه سامانه مدیریت محتوای وبنیک',
      created_at: '2026-10-02T19:48:45.967Z'
    }
  ],
  analytics_events: []
};

export function getLocalDB(): LocalDatabase {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(INITIAL_FALLBACK_DATA));
      return INITIAL_FALLBACK_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FALLBACK_DATA;
  }
}

export function saveLocalDB(data: LocalDatabase): void {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save local db:', e);
  }
}
