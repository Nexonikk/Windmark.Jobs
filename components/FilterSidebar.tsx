"use client";

import { Job, Filters, DEFAULT_FILTERS } from "@/types";
import { cn, getUniqueValues, formatNumber } from "@/lib/utils";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  jobs: Job[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  activeCount: number;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 last:border-none last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];

export function FilterSidebar({
  jobs,
  filters,
  onChange,
  onReset,
  activeCount,
}: FilterSidebarProps) {
  const locations = getUniqueValues(jobs, "location");
  const categories = getUniqueValues(jobs, "job_category");
  const maxSalary = Math.max(...jobs.map((j) => j.salary_to), 500000);

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleEmploymentType = (type: string) => {
    const next = filters.employmentTypes.includes(type)
      ? filters.employmentTypes.filter((t) => t !== type)
      : [...filters.employmentTypes, type];
    update("employmentTypes", next);
  };

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-900 dark:text-white">Filters</h2>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <Section title="Location">
        <select
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          className={cn(
            "w-full rounded-xl px-3 py-2 text-sm",
            "bg-slate-50 dark:bg-slate-800/60",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-300",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          )}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </Section>

      <Section title="Employment Type">
        {EMPLOYMENT_TYPES.map((type) => (
          <label
            key={type}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              onClick={() => toggleEmploymentType(type)}
              className={cn(
                "w-4 h-4 rounded flex-shrink-0 border-2 transition-all duration-150 flex items-center justify-center cursor-pointer",
                filters.employmentTypes.includes(type)
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-slate-300 dark:border-slate-600 hover:border-emerald-400"
              )}
            >
              {filters.employmentTypes.includes(type) && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors"
              onClick={() => toggleEmploymentType(type)}
            >
              {type}
            </span>
          </label>
        ))}
      </Section>

      <Section title="Job Category">
        <select
          value={filters.jobCategory}
          onChange={(e) => update("jobCategory", e.target.value)}
          className={cn(
            "w-full rounded-xl px-3 py-2 text-sm",
            "bg-slate-50 dark:bg-slate-800/60",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-300",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          )}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Section>

      <Section title="Salary Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>${formatNumber(filters.salaryMin)}</span>
            <span>${formatNumber(filters.salaryMax)}</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Minimum
            </label>
            <input
              type="range"
              min={0}
              max={maxSalary}
              step={5000}
              value={filters.salaryMin}
              onChange={(e) => update("salaryMin", Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Maximum
            </label>
            <input
              type="range"
              min={0}
              max={maxSalary}
              step={5000}
              value={filters.salaryMax}
              onChange={(e) => update("salaryMax", Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </Section>

      <Section title="Work Mode">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Remote Only
          </span>
          <div
            onClick={() => update("remoteOnly", !filters.remoteOnly)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer",
              filters.remoteOnly
                ? "bg-emerald-500"
                : "bg-slate-200 dark:bg-slate-700"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                filters.remoteOnly && "translate-x-5"
              )}
            />
          </div>
        </label>
      </Section>

      <Section title="Minimum Openings" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.minOpenings}
            onChange={(e) => update("minOpenings", Number(e.target.value))}
            className={cn(
              "w-full rounded-xl px-3 py-2 text-sm",
              "bg-slate-50 dark:bg-slate-800/60",
              "border border-slate-200 dark:border-slate-700",
              "text-slate-700 dark:text-slate-300",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            )}
            placeholder="0"
          />
        </div>
      </Section>

      <Section title="Posted Within" defaultOpen={false}>
        <div className="space-y-1.5">
          {[
            { label: "Any time", value: null },
            { label: "Last 7 days", value: 7 },
            { label: "Last 30 days", value: 30 },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => update("createdWithin", opt.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-150",
                filters.createdWithin === opt.value
                  ? "bg-emerald-500 text-white font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>
    </aside>
  );
}
