import React from 'react';
import { X, CheckCircle, Award, Calendar, User, ArrowLeft } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onRequestSimilar: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onRequestSimilar
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto text-right"
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
          <Award className="w-4 h-4" />
          <span className="text-xs font-semibold">{project.category}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          {project.title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>کارفرما: {project.client}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>سال اجرا: {project.year}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Quantified Results */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-900 mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>نتایج و دستاوردهای کلیدی پروژه:</span>
          </h4>
          <ul className="space-y-1.5">
            {project.results.map((result, idx) => (
              <li key={idx} className="text-xs text-emerald-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-700 mb-2">تکنولوژی‌های استفاده شده:</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onRequestSimilar(project.title);
            }}
            className="grow py-3 px-4 rounded-xl bg-[#0b1c36] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>سفارش طراحی سایت مشابه این پروژه</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
