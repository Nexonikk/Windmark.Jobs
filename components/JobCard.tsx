"use client";

import { Job } from "@/types";
import {
  cn,
  formatSalary,
  getEmploymentTypeColor,
  parseQualifications,
} from "@/lib/utils";
import {
  MapPin,
  Building2,
  Calendar,
  Wifi,
  DollarSign,
  Users,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";

interface JobCardProps {
  job: Job;
  style?: React.CSSProperties;
}

export function JobCard({ job, style }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const qualifications = parseQualifications(job.qualifications);

  const isEmail = job.contact.includes("@");
  const deadlineDate = (() => {
    try {
      return format(parseISO(job.application_deadline), "MMM d, yyyy");
    } catch {
      return job.application_deadline;
    }
  })();

  return (
    <div
      style={style}
      className={cn(
        "group relative flex flex-col bg-white dark:bg-surface-card-dark",
        "border border-surface-border dark:border-surface-border-dark",
        "rounded-2xl overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5",
        "hover:border-emerald-300 dark:hover:border-emerald-700",
        "animate-fade-in"
      )}
    >
      {/* Remote badge */}
      {job.is_remote_work === 1 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
          <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Remote
          </span>
        </div>
      )}

      <div className="p-6 flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4 pr-16">
          {/* Company initial avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold",
              getEmploymentTypeColor(job.employment_type)
            )}
          >
            {job.employment_type}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {job.job_category}
          </span>
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {formatSalary(job.salary_from)} – {formatSalary(job.salary_to)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">Deadline: {deadlineDate}</span>
          </div>
          {job.openings && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span>
                {job.openings} {job.openings === 1 ? "opening" : "openings"}
              </span>
            </div>
          )}
        </div>

        {/* Description preview */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Full Description
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            {qualifications.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Qualifications
                </h4>
                <ul className="space-y-1">
                  {qualifications.map((q, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Contact
              </h4>
              <a
                href={isEmail ? `mailto:${job.contact}` : `tel:${job.contact}`}
                className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {isEmail ? (
                  <Mail className="w-3.5 h-3.5" />
                ) : (
                  <Phone className="w-3.5 h-3.5" />
                )}
                {job.contact}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium",
            "transition-all duration-200",
            "text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400",
            "hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          )}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Details
            </>
          )}
        </button>
      </div>
    </div>
  );
}
