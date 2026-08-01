export interface DashboardSummary {
  companies: number;
  plants: number;
  projects: number;
  users: number;
  documents: number;
  vendors: number;
  materials: number;
  purchaseOrders: number;
}

const summary: DashboardSummary = {
  companies: 2,
  plants: 4,
  projects: 12,
  users: 48,
  documents: 286,
  vendors: 33,
  materials: 1842,
  purchaseOrders: 127,
};

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    return Promise.resolve(summary);
  }
}

export default new DashboardService();