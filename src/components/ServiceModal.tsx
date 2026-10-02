import React from 'react';
import { X, Check, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { Service } from '../types';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onRequestService: (serviceTitle: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onRequestService
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto text-right"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="بستن پنجره"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold">خدمات تخصصی وبنیک</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
          {service.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {service.longDesc}
        </p>

        <div className="mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>زمان تقریبی اجرا: {service.duration}</span>
          </div>

          <h4 className="text-xs font-bold text-slate-800 mb-2">خروجی‌ها و تعهدات این خدمت:</h4>
          <ul className="space-y-2">
            {service.deliverables.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onRequestService(service.title);
            }}
            className="grow py-3 px-4 rounded-xl bg-[#0b1c36] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>استعلام هزینه و سفارش این خدمت</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
