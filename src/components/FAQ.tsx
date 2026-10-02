import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqData } from '../data/websiteData';
import { FAQItem } from '../types';
import { api } from '../services/api';

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(faqData);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.getFAQs();
        if (res.faqs && res.faqs.length > 0) {
          const mapped: FAQItem[] = res.faqs.map((f: any) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }));
          setFaqs(mapped);
          setOpenFaqId(mapped[0].id);
        }
      } catch (e) {
        // fallback
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 md:py-16 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mb-2.5" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            سوالات متداول
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            پاسخ به پرسش‌های پرتکرار شما درباره تعرفه‌ها، مدت زمان و نحوه همکاری
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-right cursor-pointer"
                >
                  <span className="text-xs sm:text-sm md:text-base font-bold text-slate-900 hover:text-blue-700 transition-colors">
                    {faq.question}
                  </span>
                  
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
