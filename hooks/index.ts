import { useState, useEffect, useRef, useCallback } from "react";
import { Job, PaginatedResponse } from "@/types";

// ─── Debounce Hook ─────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── Dark Mode Hook ─────────────────────────────────────────────────────────
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored !== null ? stored === "true" : prefersDark;
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return { isDark, toggle };
}

// ─── Jobs Cache ─────────────────────────────────────────────────────────────
const cache = new Map<string, { data: Job[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchAllJobs(): Promise<Job[]> {
  const cacheKey = "all_jobs";
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const allJobs: Job[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `https://jsonfakery.com/jobs/paginated?page=${page}`
    );
    if (!res.ok) throw new Error("Failed to fetch jobs");
    const data: PaginatedResponse = await res.json();

    // Augment with synthetic fields if missing
    const augmented = data.data.map((job, i) => ({
      ...job,
      openings: job.openings ?? Math.floor(Math.random() * 10) + 1,
      created_at:
        job.created_at ??
        new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        ).toISOString(),
    }));

    allJobs.push(...augmented);

    if (!data.next_page_url || page >= data.last_page) {
      hasMore = false;
    } else {
      page++;
      // Safety: stop at 10 pages to avoid infinite loops
      if (page > 10) hasMore = false;
    }
  }

  cache.set(cacheKey, { data: allJobs, timestamp: Date.now() });
  return allJobs;
}

// ─── Jobs Hook ──────────────────────────────────────────────────────────────
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAllJobs()
      .then((data) => {
        if (!cancelled) {
          setJobs(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load jobs");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { jobs, loading, error };
}

// ─── Intersection Observer (Infinite Scroll) ───────────────────────────────
export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}
