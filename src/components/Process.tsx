import React, { useState } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { processStepsData } from '../data/websiteData';

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="process" className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mb-2.5" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            فرآیند کار ما
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            از ایده تا موفقیت؛ در کنار شما هستیم
          </p>
        </div>

        {/* Process Steps Track */}
        <div className="relative">
          
          {/* Desktop Horizontal Connecting Line (RTL: right to left) */}
          <div className="hidden lg:block absolute top-6 right-16 left-16 h-0.5 bg-gradient-to-l from-blue-300 via-blue-500 to-blue-200 -z-0" />

          {/* 4 Steps Grid (in RTL, step 1 is rightmost) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {processStepsData.map((step) => {
              const isSelected = activeStep === step.stepIndex;

              return (
                <div
                  key={step.stepIndex}
                  onClick={() => setActiveStep(isSelected ? null : step.stepIndex)}
                  className={`group bg-white rounded-2xl p-6 border transition-all duration-300 text-center flex flex-col items-center cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 shadow-md bg-blue-50/20 -translate-y-1'
                      : 'border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  {/* Numbered Node Circle */}
                  <div className="w-12 h-12 rounded-full bg-[#0b1c36] text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                    <span className="tabular-nums">{step.number}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {step.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-4">
                    {step.subtitle}
                  </p>

                  {/* Expandable details */}
                  <div className="w-full pt-3 border-t border-slate-100 text-right space-y-1.5">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hint indicator */}
                  <div className="mt-3 flex items-center justify-center text-[10px] text-blue-600 font-medium">
                    <span>مرحله {step.number} از ۴</span>
                    <ChevronLeft className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
