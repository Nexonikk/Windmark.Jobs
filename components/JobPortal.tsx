"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Job, Filters, SortOption, ViewMode, DEFAULT_FILTERS } from "@/types";
import { useJobs, useDebounce, useDarkMode, useIntersectionObserver } from "@/hooks";
import { applyFilters, applySort, getActiveFilterCount, exportToCSV, cn, formatNumber } from "@/lib/utils";
import { exportToPDF } from "@/lib/pdf";
import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterSummary } from "@/components/FilterSummary";
import { JobCard } from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { SkeletonGrid } from "@/components/SkeletonCard";
import {
  Search,
  SlidersHorizontal,
  Download,
  FileText,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  AlertCircle,
  RefreshCcw,
  Layers,
  Infinity,
} from "lucide-react";

const JOBS_PER_PAGE = 9;
const INFINITE_BATCH = 9;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
  { value: "most_openings", label: "Most Openings" },
];

export default function JobPortal() {
  const { jobs, loading, error } = useJobs();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const [infiniteCount, setInfiniteCount] = useState(INFINITE_BATCH);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync search debounce → filters
  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch }));
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Reset page on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
    setInfiniteCount(INFINITE_BATCH);
  }, [filters, sort]);

  // Filtered + sorted jobs (memoized for perf)
  const processedJobs = useMemo(
    () => applySort(applyFilters(jobs, filters), sort),
    [jobs, filters, sort]
  );

  const totalPages = Math.ceil(processedJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    if (viewMode === "infinite") return processedJobs.slice(0, infiniteCount);
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return processedJobs.slice(start, start + JOBS_PER_PAGE);
  }, [processedJobs, viewMode, currentPage, infiniteCount]);

  const hasMore = viewMode === "infinite" && infiniteCount < processedJobs.length;

  const loadMore = useCallback(() => {
    if (hasMore) setInfiniteCount((c) => c + INFINITE_BATCH);
  }, [hasMore]);

  const sentinelRef = useIntersectionObserver(loadMore, { threshold: 0.1 });

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    setExporting("csv");
    exportToCSV(processedJobs, "filtered-jobs");
    setTimeout(() => setExporting(null), 1000);
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      await exportToPDF(processedJobs, filters);
    } finally {
      setExporting(null);
    }
  };

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark transition-colors duration-300">
      <Header isDark={isDark} onToggleDark={toggleDark} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 py-14 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              Live Job Listings
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Next Role
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Browse thousands of opportunities from top companies worldwide.
            </p>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, company, or description…"
                className={cn(
                  "w-full pl-12 pr-12 py-4 rounded-2xl text-base",
                  "bg-white/10 dark:bg-white/5 backdrop-blur",
                  "border border-white/20 dark:border-white/10",
                  "text-white placeholder:text-slate-500",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50",
                  "transition-all duration-200"
                )}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className={cn(
              "lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
              "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
              "text-slate-700 dark:text-slate-300 hover:border-emerald-400 transition-colors"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-emerald-500 text-white font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results count */}
          <div className="text-sm text-slate-500 dark:text-slate-400 flex-1">
            {loading ? (
              <span>Loading jobs…</span>
            ) : (
              <span>
                <strong className="text-slate-900 dark:text-white">
                  {formatNumber(processedJobs.length)}
                </strong>{" "}
                {processedJobs.length === 1 ? "job" : "jobs"} found
                {jobs.length !== processedJobs.length && (
                  <span className="ml-1">
                    (from {formatNumber(jobs.length)} total)
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className={cn(
              "px-3 py-2 rounded-xl text-sm font-medium",
              "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
              "text-slate-700 dark:text-slate-300",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            )}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <button
              onClick={() => setViewMode("pagination")}
              title="Pagination"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "pagination"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Pages</span>
            </button>
            <button
              onClick={() => setViewMode("infinite")}
              title="Infinite Scroll"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "infinite"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Infinity className="w-4 h-4" />
              <span className="hidden sm:inline">Infinite</span>
            </button>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              disabled={!!exporting || processedJobs.length === 0}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
                "text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Download className="w-4 h-4" />
              {exporting === "csv" ? "Exporting…" : "CSV"}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={!!exporting || processedJobs.length === 0}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
                "text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <FileText className="w-4 h-4" />
              {exporting === "pdf" ? "Generating…" : "PDF"}
            </button>
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="mb-4">
            <FilterSummary filters={filters} onChange={handleFiltersChange} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-surface-card-dark border border-surface-border dark:border-surface-border-dark rounded-2xl p-6">
              <FilterSidebar
                jobs={jobs}
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleReset}
                activeCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <SkeletonGrid count={6} />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Failed to load jobs
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            ) : processedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedJobs.map((job, i) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      style={{ animationDelay: `${(i % JOBS_PER_PAGE) * 50}ms` }}
                    />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                {viewMode === "infinite" && (
                  <div ref={sentinelRef} className="flex justify-center py-6">
                    {hasMore ? (
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Loading more…</span>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        ✓ All {processedJobs.length} jobs loaded
                      </p>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {viewMode === "pagination" && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-slate-900 overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <FilterSidebar
              jobs={jobs}
              filters={filters}
              onChange={(f) => {
                handleFiltersChange(f);
              }}
              onReset={handleReset}
              activeCount={activeFilterCount}
            />
            <div className="mt-6">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
              >
                Show {processedJobs.length} Results
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
