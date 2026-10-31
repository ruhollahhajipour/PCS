export interface Report {
  id: number;

  title: string;

  category: string;

  description?: string;

  createdBy: string;

  createdAt: string;

  status: "Draft" | "Published";
}

export interface ReportFilter {
  category?: string;

  status?: string;

  fromDate?: string;

  toDate?: string;
}

export interface ReportExportOptions {
  format: "pdf" | "excel" | "csv";

  includeCharts: boolean;

  includeTables: boolean;
}