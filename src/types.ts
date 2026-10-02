export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconType: 'seo' | 'search' | 'code' | 'marketing' | 'ai';
  deliverables: string[];
  duration: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  categoryKey: 'ecommerce' | 'corporate' | 'cafe' | 'all';
  description: string;
  results: string[];
  techStack: string[];
  year: string;
  client: string;
  accentColor: string;
  previewType: 'watch' | 'building' | 'cafe';
}

export interface ValueProp {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  iconType: 'star' | 'headphones' | 'chart' | 'shield';
}

export interface ProcessStep {
  number: string;
  stepIndex: number;
  title: string;
  subtitle: string;
  details: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarColor: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ConsultationFormData {
  fullName: string;
  phoneNumber: string;
  businessName: string;
  serviceType: string;
  budget: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      tipBox?: string;
    }[];
    conclusion: string;
  };
}
