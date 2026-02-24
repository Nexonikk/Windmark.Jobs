"use client";

import { Filters } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { X } from "lucide-react";

interface FilterSummaryProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

interface TagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export function FilterSummary({ filters, onChange }: FilterSummaryProps) {
  const tags: { label: string; remove: () => void }[] = [];

  if (filters.search)
    tags.push({
      label: `"${filters.search}"`,
      remove: () => onChange({ ...filters, search: "" }),
    });

  if (filters.location)
    tags.push({
      label: filters.location,
      remove: () => onChange({ ...filters, location: "" }),
    });

  filters.employmentTypes.forEach((type) =>
    tags.push({
      label: type,
      remove: () =>
        onChange({
          ...filters,
          employmentTypes: filters.employmentTypes.filter((t) => t !== type),
        }),
    })
  );

  if (filters.jobCategory)
    tags.push({
      label: filters.jobCategory,
      remove: () => onChange({ ...filters, jobCategory: "" }),
    });

  if (filters.remoteOnly)
    tags.push({
      label: "Remote Only",
      remove: () => onChange({ ...filters, remoteOnly: false }),
    });

  if (filters.salaryMin > 0 || filters.salaryMax < 500000)
    tags.push({
      label: `$${formatNumber(filters.salaryMin)} – $${formatNumber(filters.salaryMax)}`,
      remove: () =>
        onChange({ ...filters, salaryMin: 0, salaryMax: 500000 }),
    });

  if (filters.minOpenings > 0)
    tags.push({
      label: `≥ ${filters.minOpenings} openings`,
      remove: () => onChange({ ...filters, minOpenings: 0 }),
    });

  if (filters.createdWithin)
    tags.push({
      label: `Last ${filters.createdWithin} days`,
      remove: () => onChange({ ...filters, createdWithin: null }),
    });

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
        Active filters:
      </span>
      {tags.map((tag, i) => (
        <FilterTag key={i} label={tag.label} onRemove={tag.remove} />
      ))}
    </div>
  );
}
