import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Job, Filters, SortOption } from "@/types";
import { subDays, parseISO, isAfter } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Locale-independent number formatter — always produces en-US style commas.
 *  Avoids hydration mismatches caused by toLocaleString() differing between
 *  the Node.js server locale and the browser locale.
 */
export function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatSalary(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return `$${formatNumber(amount)}`;
}

export function formatSalaryFull(amount: number): string {
  return `$${formatNumber(amount)}`;
}

export function parseQualifications(qualifications: string): string[] {
  try {
    const parsed = JSON.parse(qualifications);
    if (Array.isArray(parsed)) return parsed;
    return [qualifications];
  } catch {
    return [qualifications];
  }
}

export function getEmploymentTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "Full-Time": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Part-Time": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Contract: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Internship: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return colors[type] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
}

export function applyFilters(jobs: Job[], filters: Filters): Job[] {
  return jobs.filter((job) => {
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location && job.location !== filters.location) return false;

    // Employment type filter
    if (
      filters.employmentTypes.length > 0 &&
      !filters.employmentTypes.includes(job.employment_type)
    )
      return false;

    // Job category filter
    if (filters.jobCategory && job.job_category !== filters.jobCategory)
      return false;

    // Remote only
    if (filters.remoteOnly && job.is_remote_work !== 1) return false;

    // Salary range
    if (
      job.salary_from < filters.salaryMin ||
      job.salary_to > filters.salaryMax
    )
      return false;

    // Min openings
    if (filters.minOpenings > 0 && (job.openings ?? 1) < filters.minOpenings)
      return false;

    // Created within
    if (filters.createdWithin && job.created_at) {
      const cutoff = subDays(new Date(), filters.createdWithin);
      try {
        const jobDate = parseISO(job.created_at);
        if (!isAfter(jobDate, cutoff)) return false;
      } catch {
        // ignore parse errors
      }
    }

    return true;
  });
}

export function applySort(jobs: Job[], sort: SortOption): Job[] {
  const sorted = [...jobs];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at ?? b.application_deadline).getTime() -
          new Date(a.created_at ?? a.application_deadline).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at ?? a.application_deadline).getTime() -
          new Date(b.created_at ?? b.application_deadline).getTime()
      );
    case "salary_high":
      return sorted.sort((a, b) => b.salary_to - a.salary_to);
    case "salary_low":
      return sorted.sort((a, b) => a.salary_from - b.salary_from);
    case "most_openings":
      return sorted.sort((a, b) => (b.openings ?? 1) - (a.openings ?? 1));
    default:
      return sorted;
  }
}

export function getUniqueValues<T extends keyof Job>(
  jobs: Job[],
  key: T
): string[] {
  const values = jobs.map((job) => String(job[key])).filter(Boolean);
  return Array.from(new Set(values)).sort();
}

export function exportToCSV(jobs: Job[], filename = "filtered-jobs"): void {
  const headers = [
    "Title",
    "Company",
    "Location",
    "Salary From",
    "Salary To",
    "Employment Type",
    "Job Category",
    "Remote",
    "Openings",
    "Created At",
  ];

  const rows = jobs.map((job) => [
    `"${job.title}"`,
    `"${job.company}"`,
    `"${job.location}"`,
    job.salary_from,
    job.salary_to,
    `"${job.employment_type}"`,
    `"${job.job_category}"`,
    job.is_remote_work === 1 ? "Yes" : "No",
    job.openings ?? 1,
    job.created_at ?? "",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function getActiveFilterCount(filters: Filters): number {
  let count = 0;
  if (filters.search) count++;
  if (filters.location) count++;
  if (filters.employmentTypes.length > 0) count++;
  if (filters.jobCategory) count++;
  if (filters.remoteOnly) count++;
  if (filters.salaryMin > 0 || filters.salaryMax < 500000) count++;
  if (filters.minOpenings > 0) count++;
  if (filters.createdWithin) count++;
  return count;
}
