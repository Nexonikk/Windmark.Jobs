import { Job, Filters } from "@/types";
import { formatSalaryFull } from "@/lib/utils";

export async function exportToPDF(
  jobs: Job[],
  filters: Filters
): Promise<void> {
  // Dynamic import to avoid SSR issues
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleString();

  // ── Title ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text("Filtered Job Results", 14, 20);

  // ── Applied Filters ──
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  const activeFilters: string[] = [];
  if (filters.search) activeFilters.push(`Search: "${filters.search}"`);
  if (filters.location) activeFilters.push(`Location: ${filters.location}`);
  if (filters.employmentTypes.length > 0)
    activeFilters.push(`Employment Types: ${filters.employmentTypes.join(", ")}`);
  if (filters.jobCategory)
    activeFilters.push(`Category: ${filters.jobCategory}`);
  if (filters.remoteOnly) activeFilters.push("Remote Only: Yes");
  if (filters.salaryMin > 0 || filters.salaryMax < 500000)
    activeFilters.push(
      `Salary: ${formatSalaryFull(filters.salaryMin)} – ${formatSalaryFull(filters.salaryMax)}`
    );
  if (filters.createdWithin)
    activeFilters.push(`Created Within: ${filters.createdWithin} days`);

  let y = 30;
  if (activeFilters.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Applied Filters:", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    activeFilters.forEach((f) => {
      doc.text(`• ${f}`, 18, y);
      y += 5;
    });
  } else {
    doc.text("No active filters applied.", 14, y);
    y += 6;
  }

  y += 4;

  // ── Table ──
  autoTable(doc, {
    startY: y,
    head: [
      [
        "Title",
        "Company",
        "Location",
        "Salary Range",
        "Type",
        "Category",
        "Remote",
        "Openings",
      ],
    ],
    body: jobs.map((job) => [
      job.title,
      job.company,
      job.location,
      `${formatSalaryFull(job.salary_from)} – ${formatSalaryFull(job.salary_to)}`,
      job.employment_type,
      job.job_category,
      job.is_remote_work === 1 ? "Yes" : "No",
      job.openings ?? 1,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
    },
  });

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated: ${now}  |  Total Results: ${jobs.length}  |  Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      "Windmark Job Portal",
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" }
    );
  }

  doc.save(`job-results-${Date.now()}.pdf`);
}
