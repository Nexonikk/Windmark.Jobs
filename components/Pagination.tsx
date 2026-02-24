"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
          currentPage === 1
            ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {pages.map((page, i) => (
        <div key={i}>
          {page === "..." ? (
            <span className="px-3 py-2 text-sm text-slate-400">…</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150",
                currentPage === page
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
          currentPage === totalPages
            ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
