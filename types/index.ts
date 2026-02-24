export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_from: number;
  salary_to: number;
  employment_type: string;
  application_deadline: string;
  qualifications: string;
  contact: string;
  job_category: string;
  is_remote_work: number;
  openings?: number;
  created_at?: string;
}

export interface PaginatedResponse {
  data: Job[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "salary_high"
  | "salary_low"
  | "most_openings";

export type ViewMode = "pagination" | "infinite";

export interface Filters {
  search: string;
  location: string;
  employmentTypes: string[];
  jobCategory: string;
  remoteOnly: boolean;
  salaryMin: number;
  salaryMax: number;
  minOpenings: number;
  createdWithin: number | null; // 7, 30, or null
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  location: "",
  employmentTypes: [],
  jobCategory: "",
  remoteOnly: false,
  salaryMin: 0,
  salaryMax: 500000,
  minOpenings: 0,
  createdWithin: null,
};
