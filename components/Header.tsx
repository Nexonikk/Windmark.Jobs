"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun, Briefcase } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Header({ isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
              Windmark
            </span>
            <span className="font-bold text-emerald-500 text-base">.Jobs</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDark}
            className={cn(
              "relative w-14 h-7 rounded-full transition-colors duration-300 flex items-center",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
              isDark
                ? "bg-emerald-500"
                : "bg-slate-200 dark:bg-slate-700"
            )}
            aria-label="Toggle dark mode"
          >
            <div
              className={cn(
                "absolute flex items-center justify-center w-5 h-5 rounded-full bg-white shadow transition-transform duration-300",
                isDark ? "translate-x-8" : "translate-x-1"
              )}
            >
              {isDark ? (
                <Moon className="w-3 h-3 text-emerald-600" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
