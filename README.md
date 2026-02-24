# JobBoard Pro — Windmark Frontend Assignment

A production-ready Job Listing Portal built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## 🚀 Live Demo

> **TODO:** Add your deployed URL here after deployment  
> Example: `https://windmark-jobboard.vercel.app`

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Radix UI primitives + custom components |
| Icons | Lucide React |
| PDF Export | jsPDF + jspdf-autotable |
| Date Utilities | date-fns |
| Data Source | [JSONFakery Jobs API](https://jsonfakery.com/jobs/paginated) |

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles + Tailwind directives
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry page (renders JobPortal)
├── components/
│   ├── JobPortal.tsx        # 🏠 Main orchestrator component
│   ├── JobCard.tsx          # Individual job listing card
│   ├── FilterSidebar.tsx    # All filter controls
│   ├── FilterSummary.tsx    # Active filter tags (removable)
│   ├── Header.tsx           # Sticky navbar + dark mode toggle
│   ├── Pagination.tsx       # Page number navigation
│   └── SkeletonCard.tsx     # Loading skeleton UI
├── hooks/
│   └── index.ts             # useJobs, useDarkMode, useDebounce, useIntersectionObserver
├── lib/
│   ├── utils.ts             # Filter/sort logic, CSV export, helpers
│   └── pdf.ts               # PDF generation with jsPDF
├── types/
│   └── index.ts             # TypeScript interfaces & types
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/windmark-jobboard.git
cd windmark-jobboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## ✅ Feature Checklist

### Core
- [x] Fetches all jobs from `https://jsonfakery.com/jobs/paginated` (all pages)
- [x] Displays all job details: title, company, location, salary, type, category, remote, qualifications, contact, deadline
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Clean, modern UI with Syne + JetBrains Mono fonts

### Filtering (Frontend-only)
- [x] **Search** — title, company, description (500ms debounced)
- [x] **Location** — dropdown from live data
- [x] **Employment Type** — multi-select checkboxes (Full-Time, Part-Time, Contract, Internship)
- [x] **Job Category** — dropdown from live data
- [x] **Remote Only** — toggle switch
- [x] **Salary Range** — dual range sliders (min/max)
- [x] **Minimum Openings** — numeric input
- [x] **Created Within** — 7 days / 30 days / Any time

### Filter UX
- [x] Active filter summary with removable tags
- [x] Clear all filters button
- [x] Mobile filter drawer with overlay

### Sorting
- [x] Newest First
- [x] Oldest First
- [x] Salary High to Low
- [x] Salary Low to High
- [x] Most Openings

### Performance
- [x] **In-memory cache** — jobs fetched once, cached for 5 minutes
- [x] **Memoized filtering** — `useMemo` prevents recomputation
- [x] **500ms debounced search** — avoids excessive processing
- [x] **Lazy imports** — PDF library loaded only on demand

### Loading
- [x] 6 skeleton cards shown during initial load
- [x] Spinner for infinite scroll loading
- [x] Error state with retry button
- [x] Empty state with clear filters CTA

### Dark Mode
- [x] Toggle switch in header
- [x] `localStorage` persistence across sessions
- [x] Respects `prefers-color-scheme` on first visit
- [x] Smooth transitions

### Pagination
- [x] Page number buttons with ellipsis
- [x] Previous / Next controls
- [x] Filters maintained across page changes
- [x] Auto-scroll to top on page change

### Infinite Scroll
- [x] IntersectionObserver-based sentinel loading
- [x] Batched loading (9 items per batch)
- [x] "All jobs loaded" indicator at end

### View Mode Toggle
- [x] Switch between Pagination and Infinite Scroll modes

### Exports
- [x] **CSV** — filtered data with all required columns
- [x] **PDF** — title, applied filters section, data table, footer (timestamp + count)

---

## 🏗 Architectural Decisions

### 1. Fetch-all Strategy with Client-side Filtering
Rather than paginating API requests per filter change, we fetch **all jobs upfront** and do filtering/sorting in memory. This enables:
- Instant filter response (no network round-trips)
- Consistent pagination across filtered results
- Simpler state management

The trade-off (large initial payload) is mitigated by a **5-minute in-memory cache** so navigating away and back doesn't re-fetch.

### 2. Custom Hooks Architecture
Logic is separated into focused hooks:
- `useJobs` — data fetching + caching
- `useDarkMode` — localStorage-backed theme
- `useDebounce` — 500ms search debounce
- `useIntersectionObserver` — infinite scroll detection

### 3. Memoized Processing Pipeline
```
jobs → applyFilters(filters) → applySort(sort) → processedJobs
```
Wrapped in `useMemo` so it only recomputes when `jobs`, `filters`, or `sort` changes.

### 4. Synthetic Fields
The JSONFakery API doesn't return `openings` or `created_at`. We generate them deterministically on first fetch and freeze them in cache, ensuring consistent sorting/filtering behavior.

### 5. PDF on Demand
`jsPDF` and `jspdf-autotable` are dynamically imported only when the user clicks "Export PDF", keeping the initial bundle lean.

---

## 🎨 Design Decisions

- **Font**: Syne (distinctive geometric sans) for all text — avoids the generic Inter/Roboto look
- **Color accent**: Emerald green — professional, accessible, distinct from typical blue job portals
- **Card interactions**: Subtle lift + border tint on hover for tactile feedback
- **Expandable cards**: Details hidden by default to keep the grid scannable, revealed on demand
- **Company avatars**: Color gradient initials as fallback (no broken image states)

---

## 📦 Deployment

Deploy to Vercel (recommended):

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to [vercel.com](https://vercel.com) for automatic deployments.

---

## 📧 Contact

Built for the Windmark frontend assignment.  
For questions: [rishabh@windmark.co](mailto:rishabh@windmark.co)
