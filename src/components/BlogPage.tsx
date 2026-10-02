import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Bookmark, 
  Check, 
  Sparkles, 
  ChevronRight,
  BookOpen,
  Tag,
  MessageSquare
} from 'lucide-react';
import { BlogPost } from '../types';
import { blogPostsData } from '../data/blogData';
import { api } from '../services/api';

interface BlogPageProps {
  onOpenConsultation: () => void;
  onNavigateHome: () => void;
  initialPostSlug?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ 
  onOpenConsultation, 
  onNavigateHome,
  initialPostSlug 
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPostsData);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    if (initialPostSlug) {
      return blogPostsData.find(p => p.slug === initialPostSlug) || null;
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.getBlogPosts();
        if (res.posts && res.posts.length > 0) {
          const mapped: BlogPost[] = res.posts.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            author: {
              name: p.author_name || 'کارشناس وبنیک',
              role: p.author_role || '',
              avatar: p.author_avatar || '',
            },
            publishedAt: p.published_at,
            readTime: p.read_time,
            coverImage: p.cover_image,
            tags: p.tags || [],
            content: p.content || { intro: p.excerpt, sections: [], conclusion: '' },
          }));
          setPosts(mapped);
          if (initialPostSlug) {
            const found = mapped.find(p => p.slug === initialPostSlug);
            if (found) setSelectedPost(found);
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchBlog();
  }, [initialPostSlug]);

  const categories = ['همه', 'طراحی سایت', 'سئو و گوگل', 'هوش مصنوعی', 'فروشگاه آنلاین'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'همه' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================== */}
        {/* VIEW 1: SINGLE ARTICLE DETAIL VIEW (Sample Blog for Test) */}
        {/* ============================================================== */}
        {selectedPost ? (
          <article className="max-w-4xl mx-auto">
            
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onNavigateHome}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  خانه
                </button>
                <span>/</span>
                <button 
                  onClick={handleBackToList}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  وبلاگ
                </button>
                <span>/</span>
                <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-sm">
                  {selectedPost.title}
                </span>
              </div>

              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به لیست مقالات</span>
              </button>
            </div>

            {/* Article Card Wrapper */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/80 shadow-sm mb-12">
              
              {/* Category & Read Time Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedPost.readTime}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedPost.publishedAt}</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6 tracking-tight text-right">
                {selectedPost.title}
              </h1>

              {/* Author & Share Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900">
                      {selectedPost.author.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {selectedPost.author.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors cursor-pointer"
                    title="کپی لینک مقاله"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'لینک کپی شد!' : 'اشتراک‌گذاری'}</span>
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-md">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="text-right space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
                
                {/* Intro lead */}
                <p className="text-base sm:text-lg font-medium text-slate-800 leading-loose bg-blue-50/40 p-4 sm:p-5 rounded-2xl border-r-4 border-blue-600">
                  {selectedPost.content.intro}
                </p>

                {/* Sections */}
                {selectedPost.content.sections.map((section, idx) => (
                  <div key={idx} className="pt-4 space-y-3">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight pt-2 border-b border-slate-100 pb-2">
                      {section.heading}
                    </h2>
                    
                    {section.body.map((para, pIdx) => (
                      <p key={pIdx} className="text-slate-600 leading-relaxed">
                        {para}
                      </p>
                    ))}

                    {/* Tip / Key takeaway box */}
                    {section.tipBox && (
                      <div className="my-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">
                          {section.tipBox}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Conclusion */}
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    جمع‌بندی و نتیجه‌گیری
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedPost.content.conclusion}
                  </p>
                </div>

                {/* Tags */}
                <div className="pt-6 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {selectedPost.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

            </div>

            {/* Author Bio Box */}
            <div className="bg-gradient-to-r from-blue-900 via-[#0c2242] to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center gap-5 text-right mb-12 shadow-lg">
              <img
                src={selectedPost.author.avatar}
                alt={selectedPost.author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shrink-0"
              />
              <div className="grow">
                <span className="text-xs text-blue-300 font-semibold">درباره نویسنده</span>
                <h4 className="text-base font-bold text-white mb-1">
                  {selectedPost.author.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  متخصص ارشد حوزه وب و معماری ابری با بیش از ۸ سال تجربه در طراحی و توسعه پروژه‌های وب مقیاس‌پذیر در آژانس دیجیتال وبنیک.
                </p>
              </div>
              <button
                onClick={onOpenConsultation}
                className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md cursor-pointer"
              >
                مشاوره با تیم فنی
              </button>
            </div>

            {/* Related Articles */}
            <div className="mb-12">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 text-right">
                سایر مقالات پیشنهادی وبنیک
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPostsData
                  .filter(p => p.id !== selectedPost.id)
                  .slice(0, 2)
                  .map(post => (
                    <div
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 mb-1 block">
                          {post.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 text-right mb-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 text-right">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>{post.readTime}</span>
                        <span className="text-blue-600 font-semibold group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                          مطالعه مقاله ←
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </article>
        ) : (
          /* ============================================================== */
          /* VIEW 2: MAIN BLOG DIRECTORY & POSTS LISTING */
          /* ============================================================== */
          <div>
            
            {/* Header Hero Banner */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>وبلاگ و مقالات تخصصی وبنیک</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                دانش روز طراحی وب، سئو و هوش مصنوعی
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                جدیدترین راهنماها، تحلیل ترندها و استراتژی‌های رشد کسب‌وکارهای آنلاین به قلم متخصصان ارشد آژانس وبنیک.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
              
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0b1c36] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در مقالات..."
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-right shadow-2xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

            </div>

            {/* Featured Sample Article (Top Banner) */}
            {filteredPosts.length > 0 && selectedCategory === 'همه' && !searchQuery && (
              <div 
                onClick={() => handleSelectPost(filteredPosts[0])}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 mb-12 cursor-pointer overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Image side */}
                  <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src={filteredPosts[0].coverImage}
                      alt={filteredPosts[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold shadow-md">
                      مقاله برگزیده ویژه
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="lg:col-span-6 text-right flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          {filteredPosts[0].category}
                        </span>
                        <span>•</span>
                        <span>{filteredPosts[0].readTime}</span>
                        <span>•</span>
                        <span>{filteredPosts[0].publishedAt}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 group-hover:text-blue-700 transition-colors mb-4 leading-snug">
                        {filteredPosts[0].title}
                      </h2>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                        {filteredPosts[0].excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={filteredPosts[0].author.avatar}
                          alt={filteredPosts[0].author.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          {filteredPosts[0].author.name}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:-translate-x-1 transition-transform">
                        <span>مطالعه مقاله کامل</span>
                        <ArrowLeft className="w-4 h-4" />
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => handleSelectPost(post)}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[11px] font-bold text-blue-700 shadow-xs">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 text-right">
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2.5 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>

                    </div>
                  </div>

                  {/* Author and Action footer */}
                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-medium text-slate-600">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-blue-600 group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>مطالعه</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </article>
              ))}
            </div>

            {/* Empty Search state */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  مقاله‌ای یافت نشد
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  لطفاً با کلمات کلیدی دیگری جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید.
                </p>
                <button
                  onClick={() => { setSelectedCategory('همه'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  مشاهده همه مقالات
                </button>
              </div>
            )}

            {/* Free Consultation Callout Card */}
            <div className="mt-16 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#0b1c36] via-[#0f284e] to-[#0b1c36] text-white flex flex-col md:flex-row items-center justify-between gap-6 text-right">
              <div>
                <span className="text-xs text-blue-300 font-semibold mb-1 block">مشاوره تخصصی آنلاین</span>
                <h3 className="text-xl sm:text-2xl font-black mb-2">
                  می‌خواهید این استراتژی‌ها را در وب‌سایت خود پیاده کنید؟
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  مشاوران وبنیک آماده‌اند وضعیت فعلی سایت و فرصت‌های رشد دیجیتال برند شما را به صورت کاملاً رایگان تحلیل کنند.
                </p>
              </div>
              <button
                onClick={onOpenConsultation}
                className="shrink-0 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                درخواست مشاوره رایگان
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
