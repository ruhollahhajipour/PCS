export interface ReportItem {
  id: number;
  title: string;
  category: string;
  createdBy: string;
  createdAt: string;
  status: "Draft" | "Published";
}

const reports: ReportItem[] = [
  {
    id: 1,
    title: "Monthly Cost Report",
    category: "Cost Control",
    createdBy: "Planning",
    createdAt: "2026-07-01",
    status: "Published",
  },
  {
    id: 2,
    title: "Procurement Status",
    category: "Procurement",
    createdBy: "Procurement",
    createdAt: "2026-07-12",
    status: "Draft",
  },
];

class ReportService {
  async getAll(): Promise<ReportItem[]> {
    return Promise.resolve(reports);
  }

  async getById(
    id: number
  ): Promise<ReportItem | undefined> {
    return Promise.resolve(
      reports.find((r) => r.id === id)
    );
  }

  async create(
    report: ReportItem
  ): Promise<ReportItem> {
    reports.push(report);
    return Promise.resolve(report);
  }

  async update(
    report: ReportItem
  ): Promise<ReportItem> {
    const index = reports.findIndex(
      (r) => r.id === report.id
    );

    if (index >= 0) {
      reports[index] = report;
    }

    return Promise.resolve(report);
  }

  async delete(id: number): Promise<void> {
    const index = reports.findIndex(
      (r) => r.id === id
    );

    if (index >= 0) {
      reports.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new ReportService();