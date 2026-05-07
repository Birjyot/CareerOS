'use client';

import { Brain, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Job {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  applied_date: string;
  salary_range: string;
  job_url: string;
  notes: string;
  platform: string;
}

interface JobCardProps {
  job: Job;
  compact?: boolean;

  onDragStart: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
  onGenerateCoverLetter: (id: number, company: string, position: string) => void;
  onGenerateInterview: (id: number, position: string) => void;

  statusStyles: Record<string, string>;
  isGeneratingCL?: boolean;
  isGeneratingQuestions?: boolean;
}

export default function JobCard({
  job,
  compact = false,
  onDragStart,
  onEdit,
  onDelete,
  onGenerateCoverLetter,
  onGenerateInterview,
  statusStyles,
  isGeneratingCL,
  isGeneratingQuestions,
}: JobCardProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(job)}
      className={`
        rounded-2xl transition-all cursor-grab active:cursor-grabbing relative
        ${compact ? 'p-3' : 'p-5'}
      `}
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Tags */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {job.platform && !compact && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium 
            bg-white/10 text-blue-300 border border-white/10">
            {job.platform}
          </span>
        )}
        {!compact && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md
            ${statusStyles[job.status] || 'bg-white/10 text-white border-white/20'}`}
          >
            {job.status}
          </span>
        )}
      </div>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3 gap-2 pr-16">

        <div className="flex-1 min-w-0">

          {/* POSITION */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className={`font-bold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {job.position}
            </p>
          </div>

          {/* COMPANY */}
          <p className="text-blue-400 text-sm font-medium truncate">
            {job.company}
          </p>

          {/* LOCATION */}
          {job.location && (
            <p className="text-white/40 text-[11px] truncate">
              📍 {job.location}
            </p>
          )}
        </div>
      </div>

      {/* META */}
      <div className="text-white/40 text-[11px] mb-3">
        Applied: {job.applied_date}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 flex-wrap items-center text-xs">

        <button
          onClick={() => onGenerateCoverLetter(job.id, job.company, job.position)}
          disabled={isGeneratingCL}
          className={`text-blue-400 hover:text-blue-300 transition flex items-center gap-1 ${isGeneratingCL ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGeneratingCL ? (
            <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          ) : (
            <FileText size={12} />
          )}
          {isGeneratingCL ? 'Gen...' : 'Cover'}
        </button>

        <button
          onClick={() => onGenerateInterview(job.id, job.position)}
          disabled={isGeneratingQuestions}
          className={`text-blue-400 hover:text-blue-300 transition flex items-center gap-1 ${isGeneratingQuestions ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGeneratingQuestions ? (
            <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          ) : (
            <Brain size={12} />
          )}
          {isGeneratingQuestions ? 'Prep...' : 'Prep'}
        </button>

        <button
          onClick={() => onEdit(job)}
          className="ml-auto text-white/40 hover:text-white/70 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(job.id)}
          className="text-red-400 hover:text-red-300 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}